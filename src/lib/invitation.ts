export type Account = {
  bank: string;
  number: string;
  holder: string;
  relation: string;
};

export type Transport = {
  title: string;
  description: string;
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
    hall: "리움 하우스웨딩",
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
      "먼 훗날에도 우리가 서로의 삶에 섞여 있는 것.",
      "그대도 눈이 마주치면 아무 이유 없이 웃을 수 있는 것.",
      "사랑한다는 말을 주저하지 않고 전할 수 있는 것.",
      "그리고 나의 평생에 네가 사는 것.",
    ],
  },
  heroImage: "/image/A7401864.jpeg",
  /** 히어로 상단 짧은 문장 (쉼으로 구분, 첫 덩이는 --terra) */
  heroTagline: ["우리", "둘의", "첫시작"] as const,
  gallery: [
    "/image/A7402598.jpeg",
    "/image/A7401864.jpeg",
    "/image/A7402567.jpeg",
    "/image/A7402661.jpeg",
    "/image/A7402405.jpeg",
    "/image/A7402203.jpeg",
    "/image/A7401819.jpeg",
    "/image/A7402171.jpeg",
    "/image/A7401966.jpeg",
    "/image/A7402503.jpeg",
    "/image/A7402446.jpeg",
    "/image/A7402467.jpeg",
    "/image/A7402390.jpeg",
    "/image/A7402191.jpeg",
    "/image/A7402216.jpeg",
    "/image/A7402319.jpeg",
    "/image/A7401807.jpeg",
    "/image/A7402230.jpeg",
    "/image/A7402621.jpeg",
    "/image/A7402565.jpeg",
  ],
  transport: [
    {
      title: "셔틀버스",
      description: "피치역 1번 출구 맞은편 CU편의점 앞 8시 30분 출발",
    },
    {
      title: "자가용",
      description: "B1~B4층 웨딩피치 주차장 무료 주차",
    },
    {
      title: "버스",
      description: "1-1, 1-2 웨딩피치역 하차",
    },
  ] satisfies Transport[],
  accounts: {
    groom: [
      {
        relation: "신랑",
        bank: "농협",
        number: "12345-123-12",
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
        bank: "농협",
        number: "12345-123-12",
        holder: "유정아",
      },
      {
        relation: "아버지",
        bank: "카카오뱅크",
        number: "12345-123-12",
        holder: "유창호",
      },
      {
        relation: "어머니",
        bank: "카카오뱅크",
        number: "12345-123-12",
        holder: "이현진",
      },
    ] satisfies Account[],
  },
} as const;
