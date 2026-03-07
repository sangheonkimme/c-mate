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
  marriage_status ENUM('미혼', '기혼') DEFAULT '미혼',
  height INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 사진 테이블 (서브 프로필 + 포토북 통합)
CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR(36) PRIMARY KEY,
  profile_id INT NOT NULL,
  type ENUM('sub', 'photobook') NOT NULL,
  slot_number INT DEFAULT NULL COMMENT '서브 프로필일 때 슬롯 번호 (1~4)',
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
);

-- =====================
-- 시드 데이터
-- =====================

-- 기본 프로필
INSERT INTO profile (id, name, profile_image, marriage_status, height)
VALUES (1, '임승리', NULL, '미혼', 170)
ON DUPLICATE KEY UPDATE name = name;


