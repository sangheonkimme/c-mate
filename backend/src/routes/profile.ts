import { Router } from 'express';
import {
  getMyPage,
  getProfile,
  saveProfile,
} from '../controllers/profileController';
import { upload } from '../middleware/upload';

const router = Router();
const SUB_PROFILE_SLOT_COUNT = 4;
const PHOTOBOOK_SLOT_COUNT = 10;
const uploadFields = [
  { name: 'profileImage', maxCount: 1 },
  ...Array.from({ length: SUB_PROFILE_SLOT_COUNT }, (_, index) => ({
    name: `sub_${index + 1}`,
    maxCount: 1,
  })),
  ...Array.from({ length: PHOTOBOOK_SLOT_COUNT }, (_, index) => ({
    name: `photobook_${index + 1}`,
    maxCount: 1,
  })),
  { name: 'photobook', maxCount: PHOTOBOOK_SLOT_COUNT },
];

// 마이페이지 요약 정보 (이름, 나이, 지역 등 + 완성도)
router.get('/:userId/mypage', getMyPage);

// 프로필 상세 조회 (메인이미지 + 서브이미지 + 포토북 전부 포함)
router.get('/:userId', getProfile);

// 프로필 통합 저장 (텍스트 + 이미지 한 번에)
router.post('/:userId/save', upload.fields(uploadFields), saveProfile);

export default router;
