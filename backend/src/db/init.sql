-- C-Mate Database Initialization Script

CREATE DATABASE IF NOT EXISTS c_mate
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE c_mate;

-- 프로필 테이블 (메인 프로필 이미지 포함)
CREATE TABLE IF NOT EXISTS profile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL DEFAULT '홍길동',
  profile_image VARCHAR(255) DEFAULT NULL,
  marriage_status ENUM('초혼', '재혼', '사실혼') DEFAULT '초혼',
  height INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 사진 테이블 (서브 프로필 + 포토북 통합)
CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR(36) PRIMARY KEY,
  profile_id INT NOT NULL,
  type ENUM('sub', 'photobook') NOT NULL,
  slot_number INT DEFAULT NULL COMMENT '서브 프로필/포토북 슬롯 번호',
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_profile_photo_slot (profile_id, type, slot_number),
  FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
);

-- =====================
-- 시드 데이터
-- =====================

-- 기본 프로필
INSERT INTO profile (id, name, profile_image, marriage_status, height)
VALUES (1, '임승리', '/uploads/1/seed-profile-main.jpg', '초혼', 170)
ON DUPLICATE KEY UPDATE name = name;

-- 기본 서브 프로필 / 포토북
INSERT INTO photos (id, profile_id, type, slot_number, url)
VALUES
  ('seed-sub-photo-1', 1, 'sub', 1, '/uploads/1/seed-sub-01.jpg'),
  ('seed-sub-photo-2', 1, 'sub', 2, '/uploads/1/seed-sub-02.jpg'),
  ('seed-photobook-1', 1, 'photobook', 1, '/uploads/1/seed-photobook-01.jpg')
ON DUPLICATE KEY UPDATE url = VALUES(url);
