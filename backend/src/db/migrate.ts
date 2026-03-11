import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "./connection";

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
      ["photobook"],
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
        "UPDATE photos SET slot_number = ? WHERE id = ?",
        [nextSlotNumber, photo.id],
      );

      usedSlots.add(nextSlotNumber);
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
      "SHOW INDEX FROM photos WHERE Key_name = ?",
      ["uniq_profile_photo_slot"],
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
};
