import { imageAssets } from "./image-assets";

export type Account = {
  bank: string;
  number: string;
  holder: string;
  relation: string;
};

export type Transport = {
  title: string;
  description: string;
  description2?: string;
};

export const invitation = {
  couple: {
    groom: "편범준",
    bride: "유정아",
    groomParents: "편진영 · 황선애",
    brideParents: "유창호 · 이현진",
  },
  event: {
    dateText: "2026년 10월 4일 일요일",
    timeText: "오후 5시",
    hall: "📍 리움 하우스웨딩",
    address: "인천광역시 중구 북성동 제물량로232번길 23",
    lat: 37.474727503707,
    lng: 126.62048207432,
    mapUrl:
      "https://map.naver.com/p/search/%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%A4%91%EA%B5%AC%20%EB%B6%81%EC%84%B1%EB%8F%99%20%EC%A0%9C%EB%AC%BC%EB%9F%89%EB%A1%9C232%EB%B2%88%EA%B8%B8%2023/place/31098812?c=15.00,0,0,0,dh&placePath=/home?bk_query=%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%A4%91%EA%B5%AC%20%EB%B6%81%EC%84%B1%EB%8F%99%20%EC%A0%9C%EB%AC%BC%EB%9F%89%EB%A1%9C232%EB%B2%88%EA%B8%B8%2023&entry=bmp&from=map&fromPanelNum=2&timestamp=202604221952&locale=ko&svcName=map_pcv5&searchText=%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%A4%91%EA%B5%AC%20%EB%B6%81%EC%84%B1%EB%8F%99%20%EC%A0%9C%EB%AC%BC%EB%9F%89%EB%A1%9C232%EB%B2%88%EA%B8%B8%2023",
    kakaoMapUrl:
      "https://map.kakao.com/link/map/%EB%A6%AC%EC%9B%80%20%ED%95%98%EC%9A%B0%EC%8A%A4%EC%9B%A8%EB%94%A9,37.474727503707,126.62048207432",
    calendarUrl:
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=%ED%8E%B8%EB%B2%94%EC%A4%80%C2%B7%EC%9C%A0%EC%A0%95%EC%95%84%20%EA%B2%B0%ED%98%BC%EC%8B%9D&dates=20261004T080000Z/20261004T100000Z&location=%EB%A6%AC%EC%9B%80%20%ED%95%98%EC%9A%B0%EC%8A%A4%EC%9B%A8%EB%94%A9",
  },
  message: {
    headline: "너의 바람은",
    body: [
      "결혼은 당신의 모든 것에 관심을",
      "기울이겠다고 약속하는 거예요.",
      "좋은 일, 나쁜 일",
      "일상적이고 지루한 일,",
      "모든 것을, 항상 매일매일",
      "당신은 이렇게 말하는 거죠.",
      "\"너의 삶은 그냥 흘러가지 않을 거야,",
      "내가 그 모든 순간을 지켜볼 테니까.",
      "너의 인생은 혼자가 아니야.",
      "내가 너의 증인이 되어줄게.\"",
      "영화 [Shall We Dance(2024)] 中",
    ],
    
  },
  ribbonImage: imageAssets.photos.ribbon,
  heroImage: imageAssets.photos.hero,
  /** 히어로 상단 짧은 문장 (쉼으로 구분, 첫 덩이는 --terra) */
  heroTagline: ["우리", "둘의", "첫시작"] as const,
  gallery: imageAssets.photos.gallery,
  invitation: imageAssets.invitation.main,
  transport: [
    {
      title: "자가용",
      description: "상상플랫폼 8부두 주차장 이용",
      description2: "(주소: 인천시 중구 북성동 1가 4-248)",
    },
    {
      title: "지하철",
      description: "피치역 1번 출구 맞은편 CU편의점 앞 8시 30분 출발",
      description2: "피치역 1번 출구 맞은편 CU편의점 앞 8시 30분 출발",
    },
    {
      title: "버스",
      description: "1-1, 1-2 웨딩피치역 하차",
      description2: "1-1, 1-2 웨딩피치역 하차",
    },
  ] satisfies Transport[],
  accounts: {
    groom: [
      {
        relation: "신랑",
        bank: "카카오뱅크",
        number: "3333-37-8014809",
        holder: "편범준",
      },
      {
        relation: "아버지",
        bank: "카카오뱅크",
        number: "12345-123-12",
        holder: "편진영",
      },
    ] satisfies Account[],
    bride: [
      {
        relation: "신부",
        bank: "국민",
        number: "484201-01-324797",
        holder: "유정아",
      },

      {
        relation: "어머니",
        bank: "농협",
        number: "356-0780-7091-83",
        holder: "이현진",
      },
    ] satisfies Account[],
  },
} as const;
