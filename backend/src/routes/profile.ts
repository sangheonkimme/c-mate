import { Router } from 'express';
import {
  getMyPage,
  getProfile,
  saveProfile,
} from '../controllers/profileController';
import { upload } from '../middleware/upload';

const router = Router();

// 마이페이지 요약 정보 (이름, 나이, 지역 등 + 완성도)
router.get('/:userId/mypage', getMyPage);

// 프로필 상세 조회 (메인이미지 + 서브이미지 + 포토북 전부 포함)
router.get('/:userId', getProfile);

// 프로필 통합 저장 (텍스트 + 이미지 한 번에)
router.post('/:userId/save', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'sub_1', maxCount: 1 },
  { name: 'sub_2', maxCount: 1 },
  { name: 'sub_3', maxCount: 1 },
  { name: 'sub_4', maxCount: 1 },
  { name: 'photobook', maxCount: 10 },
]), saveProfile);

export default router;
