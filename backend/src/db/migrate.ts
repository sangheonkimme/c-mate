import { ResultSetHeader, RowDataPacket } from 'mysql2';
import fs from 'fs';
import pool from './connection';
import { ensureUploadsDir, resolveUploadUrlToPath } from '../utils/uploads';

const SEED_PROFILE_ID = 1;
const SEED_PROFILE_NAME = '임승리';
const SEED_MAIN_IMAGE_URL = '/uploads/1/seed-profile-main.jpg';
const SEED_SUB_IMAGES = [
  { id: 'seed-sub-photo-1', slotNumber: 1, url: '/uploads/1/seed-sub-01.jpg' },
  { id: 'seed-sub-photo-2', slotNumber: 2, url: '/uploads/1/seed-sub-02.jpg' },
];
const SEED_PHOTOBOOK_IMAGES = [
  { id: 'seed-photobook-1', slotNumber: 1, url: '/uploads/1/seed-photobook-01.jpg' },
];

const assignPhotobookSlots = async () => {
  const connection = await pool.getConnection();

  try {
    const [photos] = await connection.query<RowDataPacket[]>(
      `
        SELECT id, profile_id, slot_number
        FROM photos
        WHERE type = ?
        ORDER BY profile_id ASC, created_at ASC
      `,
      ['photobook']
    );

    const usedSlotsByProfile = new Map<number, Set<number>>();

    for (const photo of photos) {
      const profileId = Number(photo.profile_id);
      const currentSlotNumber = Number(photo.slot_number);

      if (!usedSlotsByProfile.has(profileId)) {
        usedSlotsByProfile.set(profileId, new Set());
      }

      const usedSlots = usedSlotsByProfile.get(profileId)!;

      if (Number.isFinite(currentSlotNumber) && currentSlotNumber > 0) {
        usedSlots.add(currentSlotNumber);
        continue;
      }

      let nextSlotNumber = 1;

      while (usedSlots.has(nextSlotNumber)) {
        nextSlotNumber += 1;
      }

      await connection.query<ResultSetHeader>(
        'UPDATE photos SET slot_number = ? WHERE id = ?',
        [nextSlotNumber, photo.id]
      );

      usedSlots.add(nextSlotNumber);
    }
  } finally {
    connection.release();
  }
};

const hasUploadFile = (url?: string | null) => {
  const filePath = resolveUploadUrlToPath(url);
  return filePath ? fs.existsSync(filePath) : false;
};

const syncSeedImages = async () => {
  ensureUploadsDir();

  const connection = await pool.getConnection();

  try {
    await connection.query(
      `
        INSERT INTO profile (id, name, profile_image, marriage_status, height)
        VALUES (?, ?, ?, '초혼', 170)
        ON DUPLICATE KEY UPDATE name = name
      `,
      [SEED_PROFILE_ID, SEED_PROFILE_NAME, SEED_MAIN_IMAGE_URL]
    );

    const [profiles] = await connection.query<RowDataPacket[]>(
      'SELECT profile_image FROM profile WHERE id = ?',
      [SEED_PROFILE_ID]
    );

    if (profiles.length > 0 && !hasUploadFile(profiles[0].profile_image)) {
      await connection.query<ResultSetHeader>(
        'UPDATE profile SET profile_image = ? WHERE id = ?',
        [SEED_MAIN_IMAGE_URL, SEED_PROFILE_ID]
      );
    }

    const seedPhotos = [
      ...SEED_SUB_IMAGES.map((photo) => ({ ...photo, type: 'sub' as const })),
      ...SEED_PHOTOBOOK_IMAGES.map((photo) => ({ ...photo, type: 'photobook' as const })),
    ];
    const seedPhotoMap = new Map(
      seedPhotos.map((photo) => [`${photo.type}:${photo.slotNumber}`, photo])
    );

    const [existingPhotos] = await connection.query<RowDataPacket[]>(
      'SELECT id, type, slot_number, url FROM photos WHERE profile_id = ?',
      [SEED_PROFILE_ID]
    );

    for (const photo of existingPhotos) {
      if (hasUploadFile(photo.url)) {
        continue;
      }

      const key = `${photo.type}:${Number(photo.slot_number)}`;
      const seedPhoto = seedPhotoMap.get(key);

      if (seedPhoto) {
        await connection.query<ResultSetHeader>(
          'UPDATE photos SET url = ? WHERE id = ?',
          [seedPhoto.url, photo.id]
        );
        continue;
      }

      await connection.query<ResultSetHeader>(
        'DELETE FROM photos WHERE id = ?',
        [photo.id]
      );
    }

    for (const seedPhoto of seedPhotos) {
      const [photos] = await connection.query<RowDataPacket[]>(
        'SELECT id, url FROM photos WHERE profile_id = ? AND type = ? AND slot_number = ?',
        [SEED_PROFILE_ID, seedPhoto.type, seedPhoto.slotNumber]
      );

      if (photos.length === 0) {
        await connection.query<ResultSetHeader>(
          'INSERT INTO photos (id, profile_id, type, slot_number, url) VALUES (?, ?, ?, ?, ?)',
          [seedPhoto.id, SEED_PROFILE_ID, seedPhoto.type, seedPhoto.slotNumber, seedPhoto.url]
        );
        continue;
      }

      if (!hasUploadFile(photos[0].url)) {
        await connection.query<ResultSetHeader>(
          'UPDATE photos SET url = ? WHERE id = ?',
          [seedPhoto.url, photos[0].id]
        );
      }
    }
  } finally {
    connection.release();
  }
};

export const runMigrations = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.query(`
      ALTER TABLE profile
      MODIFY marriage_status VARCHAR(20)
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci
      NULL
    `);

    await connection.query(`
      UPDATE profile
      SET marriage_status = CASE
        WHEN marriage_status IS NULL THEN '초혼'
        WHEN TRIM(marriage_status) IN ('초혼', '재혼', '사실혼') THEN TRIM(marriage_status)
        WHEN TRIM(marriage_status) = '미혼' THEN '초혼'
        WHEN TRIM(marriage_status) = '기혼' THEN '재혼'
        WHEN TRIM(marriage_status) = '' THEN '초혼'
        ELSE '초혼'
      END
    `);

    await connection.query(`
      ALTER TABLE profile
      MODIFY marriage_status ENUM('초혼', '재혼', '사실혼')
      NOT NULL
      DEFAULT '초혼'
    `);

    await connection.query(`
      ALTER TABLE photos
      MODIFY slot_number INT DEFAULT NULL COMMENT '서브 프로필/포토북 슬롯 번호'
    `);

    const [indexes] = await connection.query<RowDataPacket[]>(
      'SHOW INDEX FROM photos WHERE Key_name = ?',
      ['uniq_profile_photo_slot']
    );

    if (indexes.length === 0) {
      await connection.query(`
        ALTER TABLE photos
        ADD UNIQUE KEY uniq_profile_photo_slot (profile_id, type, slot_number)
      `);
    }
  } finally {
    connection.release();
  }

  await assignPhotobookSlots();
  await syncSeedImages();
};
