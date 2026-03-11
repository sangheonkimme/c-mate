import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import pool from '../db/connection';

// 프로필 수정 불가 항목 (상수)
const STATIC_PROFILE = {
  age: 36,
  location: '서울',
  religion: '창신교회',
  job: '사무직',
};
const SUB_PROFILE_SLOT_COUNT = 4;
const PHOTOBOOK_SLOT_COUNT = 10;

const parseHeightValue = (height?: string | number | null) => {
  if (typeof height === 'number' && Number.isFinite(height)) {
    return height;
  }

  if (typeof height === 'string') {
    const parsedHeight = Number(height.replace(/\D/g, ''));
    return Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : null;
  }

  return null;
};

const upsertPhotoBySlot = async ({
  connection,
  profileId,
  type,
  slotNumber,
  imageUrl,
}: {
  connection: PoolConnection;
  profileId: number;
  type: 'sub' | 'photobook';
  slotNumber: number;
  imageUrl: string;
}) => {
  const [existing] = await connection.query<RowDataPacket[]>(
    'SELECT id FROM photos WHERE profile_id = ? AND type = ? AND slot_number = ?',
    [profileId, type, slotNumber]
  );

  if (existing.length > 0) {
    await connection.query<ResultSetHeader>(
      'UPDATE photos SET url = ? WHERE id = ?',
      [imageUrl, existing[0].id]
    );
    return;
  }

  await connection.query<ResultSetHeader>(
    'INSERT INTO photos (id, profile_id, type, slot_number, url) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), profileId, type, slotNumber, imageUrl]
  );
};

const getNextPhotobookSlot = async ({
  connection,
  profileId,
}: {
  connection: PoolConnection;
  profileId: number;
}) => {
  const [photos] = await connection.query<RowDataPacket[]>(
    'SELECT slot_number FROM photos WHERE profile_id = ? AND type = ? ORDER BY slot_number ASC',
    [profileId, 'photobook']
  );

  const usedSlots = new Set(
    photos
      .map((photo) => Number(photo.slot_number))
      .filter((slotNumber) => Number.isFinite(slotNumber) && slotNumber > 0)
  );

  for (let slotNumber = 1; slotNumber <= PHOTOBOOK_SLOT_COUNT; slotNumber += 1) {
    if (!usedSlots.has(slotNumber)) {
      return slotNumber;
    }
  }

  return null;
};

// 마이페이지 요약 정보 조회
export const getMyPage = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const [profiles] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, profile_image, marriage_status, height FROM profile WHERE id = ?',
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }

    const profile = profiles[0];

    // 프로필 완성도 계산 (상수 항목 + 수정 가능 항목 전체 기준)
    const allFields = [
      profile.name,
      profile.profile_image,
      profile.marriage_status,
      profile.height,
      ...Object.values(STATIC_PROFILE),
    ];
    const filledCount = allFields.filter((value) => value !== null && value !== undefined).length;
    const completionRate = Math.round((filledCount / allFields.length) * 100);

    return res.json({
      id: profile.id,
      name: profile.name,
      profileImage: profile.profile_image,
      marriageStatus: profile.marriage_status,
      height: profile.height,
      ...STATIC_PROFILE,
      completionRate,
    });
  } catch (error) {
    console.error('마이페이지 조회 실패:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 상세 조회 (메인 이미지 + 서브 프로필 + 포토북)
export const getProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const [profiles] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM profile WHERE id = ?',
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }

    const profile = profiles[0];

    const [subImages] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM photos WHERE profile_id = ? AND type = ? ORDER BY slot_number ASC',
      [profile.id, 'sub']
    );

    const [photobook] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM photos WHERE profile_id = ? AND type = ? ORDER BY slot_number ASC, created_at DESC',
      [profile.id, 'photobook']
    );

    return res.json({
      ...profile,
      subImages,
      photobook,
    });
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 통합 저장 (텍스트 + 모든 이미지를 한 번에)
export const saveProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const profileId = Number(userId);

    // 1. 프로필 존재 확인
    const [profiles] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM profile WHERE id = ?',
      [profileId]
    );

    if (profiles.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }

    // 2. 텍스트 데이터 업데이트
    const { name, marriageStatus, height } = req.body;
    const updateFields: string[] = [];
    const updateValues: (string | number | null)[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(String(name).trim());
    }

    if (marriageStatus !== undefined) {
      updateFields.push('marriage_status = ?');
      updateValues.push(String(marriageStatus).trim());
    }

    if (height !== undefined) {
      updateFields.push('height = ?');
      updateValues.push(parseHeightValue(height));
    }

    // 3. 메인 프로필 이미지 처리
    if (files?.profileImage?.[0]) {
      const imageUrl = `/uploads/${userId}/${files.profileImage[0].filename}`;
      updateFields.push('profile_image = ?');
      updateValues.push(imageUrl);
    }

    if (updateFields.length > 0) {
      updateValues.push(profileId);
      await connection.query<ResultSetHeader>(
        `UPDATE profile SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // 4. 서브 프로필 이미지 처리 (sub_1 ~ sub_4)
    for (let slotNumber = 1; slotNumber <= SUB_PROFILE_SLOT_COUNT; slotNumber += 1) {
      const subFile = files?.[`sub_${slotNumber}`]?.[0];

      if (!subFile) {
        continue;
      }

      const imageUrl = `/uploads/${userId}/${subFile.filename}`;

      await upsertPhotoBySlot({
        connection,
        profileId,
        type: 'sub',
        slotNumber,
        imageUrl,
      });
    }

    // 5. 포토북 이미지 처리 (photobook_1 ~ photobook_10)
    for (let slotNumber = 1; slotNumber <= PHOTOBOOK_SLOT_COUNT; slotNumber += 1) {
      const photobookFile = files?.[`photobook_${slotNumber}`]?.[0];

      if (!photobookFile) {
        continue;
      }

      const imageUrl = `/uploads/${userId}/${photobookFile.filename}`;

      await upsertPhotoBySlot({
        connection,
        profileId,
        type: 'photobook',
        slotNumber,
        imageUrl,
      });
    }

    // 6. 레거시 포토북 업로드도 빈 슬롯에 추가 저장
    if (files?.photobook) {
      for (const file of files.photobook) {
        const nextSlotNumber = await getNextPhotobookSlot({
          connection,
          profileId,
        });

        if (!nextSlotNumber) {
          break;
        }

        const imageUrl = `/uploads/${userId}/${file.filename}`;

        await upsertPhotoBySlot({
          connection,
          profileId,
          type: 'photobook',
          slotNumber: nextSlotNumber,
          imageUrl,
        });
      }
    }

    await connection.commit();

    // 7. 업데이트된 전체 프로필 반환
    const [updated] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM profile WHERE id = ?',
      [profileId]
    );
    const [subImages] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM photos WHERE profile_id = ? AND type = ? ORDER BY slot_number ASC',
      [profileId, 'sub']
    );
    const [photobook] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM photos WHERE profile_id = ? AND type = ? ORDER BY slot_number ASC, created_at DESC',
      [profileId, 'photobook']
    );

    connection.release();

    return res.json({
      ...updated[0],
      subImages,
      photobook,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('프로필 저장 실패:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
