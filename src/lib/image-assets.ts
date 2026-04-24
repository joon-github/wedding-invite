/**
 * public/image 이하 정적 자산.
 * - textures/ — UI 배경
 * - intro/ — 봉투·인트로
 * - photos/hero — 히어로 대표 사진
 * - photos/gallery/01…20 — 갤러리 순서(캐로셀·콜라주와 동일)
 */
const base = "/image" as const;

export const imageAssets = {
  textures: {
    backgroundPaper: `${base}/textures/background-paper.jpg`,
  },
  intro: {
    welcome: `${base}/intro/welcome.png`,
  },
  photos: {
    hero: `${base}/photos/hero/primary.png`,
    gallery: [
      `${base}/photos/gallery/01.jpg`,
      `${base}/photos/gallery/02.jpg`,
      `${base}/photos/gallery/03.jpg`,
      `${base}/photos/gallery/04.jpg`,
      `${base}/photos/gallery/05.jpg`,
      `${base}/photos/gallery/06.jpg`,
      `${base}/photos/gallery/07.jpg`,
      `${base}/photos/gallery/08.jpg`,
      `${base}/photos/gallery/09.jpg`,
      `${base}/photos/gallery/10.jpg`,
      `${base}/photos/gallery/11.jpg`,
      `${base}/photos/gallery/12.jpg`,
      `${base}/photos/gallery/13.jpg`,
      `${base}/photos/gallery/14.jpg`,
      `${base}/photos/gallery/15.jpg`,
      `${base}/photos/gallery/16.jpg`,
      `${base}/photos/gallery/17.jpg`,
      `${base}/photos/gallery/18.jpg`,
      `${base}/photos/gallery/19.jpg`,
      `${base}/photos/gallery/20.jpg`,
    ] as const,
  },
} as const;
