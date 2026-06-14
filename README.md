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

### Handwriting SVG

필기 애니메이션 문구를 바꿀 때 SVG 데이터를 자동 생성합니다. 실행 전에
`npm run dev` 또는 `npm run build`를 한 번 실행해 Nanum Pen Script 파일을
`.next`에 생성해야 합니다.

```bash
npm run handwriting:generate -- \
  --eyebrow "THE WEDDING OF" \
  --title "새로운 문구" \
  --date "2026. 10. 04"
```

결과는 아래 두 파일에 기록됩니다.

- `src/components/handwriting-text.outlines.ts`
- `src/components/handwriting-text.paths.ts`

자동 마스크는 폰트 외곽선을 기준으로 생성됩니다. 실제 손글씨의 정확한 획
순서가 중요한 글자는 `handwriting-text.paths.ts`의 해당 `strokes`만
중심선 SVG path로 보정할 수 있습니다.
