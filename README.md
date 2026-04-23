# Mobile Wedding Invitation

Next.js App Router 기반 모바일 청첩장 MVP입니다.

## Features

- 모바일 우선 청첩장 랜딩 페이지
- 커버, 초대 문구, 가족 소개, 갤러리, 예식 정보, 오시는 길
- 주소/계좌번호 복사
- Web Share API 기반 공유 및 URL 복사
- 청첩장 데이터 API: `/api/invitation`
- Google Sheets + Apps Script 기반 방명록
- Vercel 무료 배포 가능 구조

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data

청첩장 내용은 `src/lib/invitation.ts`에서 수정합니다.

## Guestbook

방명록은 Next API가 Google Apps Script 웹앱을 프록시하고, Apps Script가 Google Sheets에 저장합니다.

1. Google Sheets를 새로 만들고 `확장 프로그램 > Apps Script`를 엽니다.
2. `apps-script/guestbook.gs` 내용을 Apps Script 편집기에 붙여넣습니다.
3. Apps Script의 `프로젝트 설정 > 스크립트 속성`에 선택적으로 `GUESTBOOK_SECRET` 값을 추가합니다.
4. `배포 > 새 배포 > 웹 앱`을 선택합니다.
5. 실행 권한은 본인, 액세스 권한은 모든 사용자로 설정하고 배포합니다.
6. 배포 URL을 `.env.local`과 Vercel 환경변수에 넣습니다.

```env
GOOGLE_APPS_SCRIPT_URL=Apps_Script_웹앱_URL
GUESTBOOK_SECRET=스크립트_속성과_같은_값
```

## Scripts

```bash
npm run lint
npm run build
```
