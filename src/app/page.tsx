import { AccountAccordion } from "@/components/account-accordion";
import { CopyButton } from "@/components/copy-button";
import { DdayCounter } from "@/components/dday-counter";
import { EnvelopeGate } from "@/components/envelope-gate";
import { Gallery } from "@/components/gallery";
import { Guestbook } from "@/components/guestbook";
import { HeroConfettiTrigger } from "@/components/hero-confetti-trigger";
import { HeroEnvelope } from "@/components/hero-envelope";
import { KakaoMap } from "@/components/kakao-map";
import { PhotoUpload } from "@/components/photo-upload";
import { ShareActions } from "@/components/share-actions";
import { WeddingQuiz } from "@/components/wedding-quiz";
import { colors } from "@/lib/design-tokens";
import { invitation } from "@/lib/invitation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function getSiteSettings() {
  const { data } = await supabase.from("site_settings").select("key, value");
  const settings: Record<string, boolean> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value === true || row.value === "true";
  }
  return settings;
}

export default async function Home({ searchParams }: HomeProps) {
  const [settings, params] = await Promise.all([
    getSiteSettings(),
    searchParams,
  ]);
  const hasName = typeof params.name === "string" && params.name.length > 0;

  return (
    <>
      {hasName ? (
        <div
          id="envelope-curtain"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 9998,
            backgroundColor: colors.curtain,
          }}
        />
      ) : null}
      <EnvelopeGate />
      <main className={styles.main}>
        <HeroSection />
        <PaperInvitation />
        <FamilyStory />
        <PinkGallery />
        <SaveTheDate />
        <DdayCounter targetDate="2026-10-04" />
        <LocationSection />
        <AccountSection />
        {settings.show_guestbook !== false ? <Guestbook /> : null}
        {settings.show_photo_upload !== false ? <PhotoUpload /> : null}
        {/* {settings.show_quiz !== false ? <WeddingQuiz /> : null} */}
        <DescriptionSection />
        <ShareSection />
      </main>
    </>
  );
}

function DescriptionSection() {
  return (
    <>
      <section className={styles.descriptionSection}>
        <div className={styles.descriptionCard}>
          <div className={styles.title}>예식 안내</div>
          <div className={styles.content}>
            <p>예식 관련 안내사항 입니다. 💁🏻‍♀️</p>
            <br />
            <p>본 예식은 싱랑, 신부 측 구분 없이</p>
            <p>자유롭게 원하시는 자리에 착석</p>
            <p>부탁드립니다. 🪑</p>
          </div>
        </div>
      </section>
      <section className={styles.descriptionSection}>
        <div className={styles.descriptionCard}>
          <div className={styles.title}>애견화동 안내</div>
          <div className={styles.content}>
            <p>예식 진행시 신부의 반려견</p>
            <p>'법규'의 화동이 준비되어 있습니다.</p>
            <p>🐶💐</p>
            <br />
            <p>넓은 이해와 사랑으로 지켜봐</p>
            <p>주시면 감사드리겠습니다.🧚🏻</p>
          </div>
        </div>
      </section>
    </>
  );
}
function HeroSection() {
  const [a, b, c] = invitation.heroTagline;
  const heroDate = formatHeroDateKor(2026, 9, 4);

  return (
    <section id="hero-section" className={`hand-text ${styles.hero}`}>
      <div className={styles.heroSticky}>
        <HeroConfettiTrigger targetId="hero-section" />
        {/* <p className={styles.heroTagline} lang="ko">
          <span className={styles.heroSlashTerra} aria-hidden>
            /
          </span>
          <span className={styles.heroTagAccent}>
            {a}
          </span>
          <span className={styles.heroSlash} aria-hidden>
            /
          </span>
          <span className={styles.heroTagRest}>
            {b}
          </span>
          <span className={styles.heroSlash} aria-hidden>
            /
          </span>
          <span className={styles.heroTagRest}>
            {c}
          </span>
        </p> */}
        <div className={styles.heroVisualGroup}>
          <div className={styles.heroImageFrame}>
            <HeroEnvelope imageSrc={invitation.heroImage} />
          </div>

          {/* <p className={styles.heroDateLine}>{heroDate}</p> */}

          {/* <div className={styles.heroNames} lang="ko">
            <span className={styles.heroGroomName}>{invitation.couple.groom}</span>
            <span className={styles.heroAnd}>그리고</span>
            <span className={styles.heroBrideName}>{invitation.couple.bride}</span>
          </div> */}

          {/* <p className={styles.heroClosing}>저희, 결혼합니다.</p> */}

          {/* <div className={styles.heroMeta} lang="ko">
            <p>
              {invitation.event.dateText} {invitation.event.timeText}
            </p>
            <p>{invitation.event.hall}</p>
            <a
              href={invitation.event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroAddress}
            >
              {invitation.event.address}
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
}

function PaperInvitation() {
  return (
    <section className={styles.paperSection}>
      <div className={`paper-texture paper-border ${styles.paperCard}`}>
        {/* <span className={styles.paperHeart}>♡</span> */}
        <p className={`${styles.paperHeadline}`}>
          Invitation
        </p>
        <div className={`hand-text ${styles.paperBody}`}>
          {/* <p>결혼은 당신의 모든 것에 관심을</p>
          <p>기울이겠다고 약속하는 거예요.</p>
          <br />
          <p>좋은 일, 나쁜 일</p>
          <p>일상적이고 지루한 일,</p>
          <br />
          <p>모든 것을, 항상 매일매일</p>
          <p>당신은 이렇게 말하는 거죠.</p>
          <br />
          <p>"너의 삶은 그냥 흘러가지 않을 거야,</p>
          <p>내가 그 모든 순간을 지켜볼 테니까.</p>
          <br />
          <p>너의 인생은 혼자가 아니야.</p>
          <p>내가 너의 증인이 되어줄게."</p>
          <br />
          <p>영화 [Shall We Dance(2024)] 中</p> */}
          <p>나와 몹시 다르고,다양해서</p>
          <p>이따금 경이로울것이다.</p>
          <br />
          <p>한 사람이 오는건 그 사람의 삶 전체가</p>
          <p>오는 것 이라는 말을 웬 광고판에서 본 적 있다.</p>
          <br />
          <p>왜 아침에 그 문구가 생각났을까.</p>
          <br />
          <p>아무튼 사람을,인연을</p>
          <p>곁에 두기로 하는 것은</p>
          <p>그래서, 무척이나 거대한 결심이다.</p>
          <br />
          <p>정현종 시의 <strong>방문객</strong> 으로부터</p>
        </div>
        <p className={`hand-text ${styles.paperClosing}`}>
          편진영 · 황선애의 아들 범준
          <br />
          유창호 · 이현진의 딸 정아
        </p>
        <p className={`hand-text ${styles.paperClosing}`}
          style={{ marginBottom: "1.8rem" }}
        >
          2026년 10월 04일 (일) 오후 5시
          <br />
          리움 하우스 웨딩
        </p>

        {/* <div className={styles.paperPhotoGrid}>
          <div className={styles.paperPhotoLeft}>
            <Image
              src={invitation.gallery[0]}
              alt=""
              fill
              sizes="220px"
              className={styles.paperPhotoLeftImg}
            />
          </div>
          <div className={styles.paperPhotoRight}>
            <Image
              src={invitation.gallery[1]}
              alt=""
              fill
              sizes="92px"
              className={styles.paperPhotoRightImg}
            />
          </div>
        </div> */}

        {/* <div className={styles.paperBadge}>
          <p>{romanize(invitation.couple.groom)}</p>
          <p className={styles.paperBadgeLine}>October 4, 2026</p>
          <p className={styles.paperBadgeLine}>17:00 PM</p>
          <p className={styles.paperBadgeLine}>{romanize(invitation.couple.bride)}</p>
        </div> */}
      </div>
    </section >
  );
}

function FamilyStory() {
  return (
    <section className={styles.familySection}>
      <div className={styles.familyStory}>
        <div className={styles.familyPhotoMain}>
          <div className={styles.familyPhotoMainCrop}>
            <Image
              src={invitation.invitation}
              alt=""
              width={760}
              height={900}
              className={styles.familyPhotoMainImg}
            />
          </div>
          <span className={styles.familyTape} />
        </div>
      </div>
      <div className={`hand-text ${styles.introMent}`}>
        <p>엄마 품에 숨어 낯가림이 많았던 범준,</p>
        <p>동네 할머니들 사랑받던 수다쟁이 정아</p>
        <br />
        <p>성격도 자라온 환경도 다르지만</p>
        <p>사랑하고 존중하며 예쁘게 살겠습니다.</p>
      </div>
    </section>
  );
}

function SaveTheDate() {
  return (
    <section className={styles.calendarSection}>
      {/* <div
        className="section-badge section-badge--static"
        role="img"
        aria-label="일정"
      >
        <span className="section-badge__icon">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="section-badge__svg"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M3 9h18M8 2v3M16 2v3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="section-badge__divider" />
        <span className="section-badge__text">날짜</span>
        <span className="section-badge__arrow">›</span>
      </div> */}
      <h4 className={`${styles.calendarTitle}`} style={{ fontSize: "25px" }}>Save the Date</h4>
      {/* <p className={`${styles.calendarSubTitle}`}>2026.10.04. SUN 17:00</p> */}
      <div className={`paper-texture ${styles.calendarCard}`}>
        {/* <span className={styles.calendarTape} aria-hidden /> */}
        <div className={styles.calendarImageWrap}>
          <Image
            src="/image/calendar/calendar.png"
            alt="2026년 10월 달력"
            width={1200}
            height={1448}
            unoptimized
            className={styles.calendarImage}
          />
        </div>
      </div>
    </section>
  );
}

function PinkGallery() {
  return (
    <section className={`pink-collage ${styles.pinkSection}`}>
      <h4 className={`${styles.pinkTitle}`}>Photography</h4>
      <div className={styles.pinkInner}>
        {/* <div className={styles.pinkPhotoCard}>
          <Image
            src={invitation.gallery[4]}
            alt=""
            width={760}
            height={900}
            className={styles.pinkPhotoImg}
          />
        </div> */}

        <Gallery images={invitation.gallery} />
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className={styles.locationSection}>
      <div className={`${styles.calendarTitle}`} style={{ fontSize: "25px", textAlign: "center", marginBottom: "2rem" }}>
        Location
      </div>
      {/* <a
        href={invitation.event.kakaoMapUrl}
        target="_blank"
        rel="noreferrer"
        className="section-badge section-badge--link"
        aria-label="카카오맵으로 오시는 길 열기"
      >
        <span className="section-badge__icon">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="section-badge__svg"
          >
            <path d="M12 22s7-7.1 7-13a7 7 0 0 0-14 0c0 5.9 7 13 7 13Z" />
            <circle cx="12" cy="9" r="2.4" />
          </svg>
        </span>
        <span className="section-badge__divider section-badge__divider--muted" />

        <span className="section-badge__arrow">›</span>
      </a> */}

      <div className={`paper-texture ${styles.locationCard}`}>
        <div className={styles.locationHeader}>
          <div>
            <p className={styles.locationLabel}>Location</p>
            <p className={styles.locationHallName}>{invitation.event.hall}</p>
          </div>
        </div>
        <KakaoMap
          title={invitation.event.hall}
          address={invitation.event.address}
          lat={invitation.event.lat}
          lng={invitation.event.lng}
          naverUrl={invitation.event.mapUrl}
          kakaoUrl={invitation.event.kakaoMapUrl}
        />
        <div className={styles.locationInfo}>
          <div className={styles.locationAddress}>
            <p className={styles.locationAddressLabel}>Address</p>
            <p className={styles.locationAddressText}>
              {invitation.event.address}
            </p>
          </div>
          <div className={styles.locationActions}>
            <CopyButton
              value={invitation.event.address}
              label="복사"
              className={styles.locationCopyButton}
            />
            <a
              href={invitation.event.mapUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.locationActionNaver}
            >
              네이버
            </a>
            <a
              href={invitation.event.kakaoMapUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.locationActionKakao}
            >
              카카오
            </a>
          </div>
        </div>
        <div className={styles.locationDivider}>
          <span className={styles.locationDividerLine} />
          <span className={styles.locationDividerText}>Guide</span>
          <span className={styles.locationDividerLine} />
        </div>
        <div className={styles.locationTransport}>
          <div className={styles.locationTransportItem}>
            <p className={styles.locationTransportTitle}>🚘 자 가 용</p>
            <div className={styles.locationTransportDesc}>
              <p>상상플랫폼 8부두 주차장 이용</p>
              <p>(주소: 인천시 중구 북성동 1가 4-248)</p>
              <br />
              <p>주차장 입구 앞에 있는 자사 직원의 인솔에</p>
              <p>따라 셔틀버스를 이용하시면 됩니다.</p>
            </div>
          </div>
          <div className={styles.locationTransportItem}>
            <p className={styles.locationTransportTitle}>🚊 지 하 철</p>
            <div className={styles.locationTransportDesc}>
              <p>1호선/수인선(인천역) 하차 → 1번 출구 → 웅이돈가스 앞 셔틀버스 탑승 (셔틀버스 수시운행/직원 항시안내)</p>
            </div>
          </div>
          <div className={styles.locationTransportItem}>
            <p className={styles.locationTransportTitle}>🚍 버 스</p>
            <div className={styles.locationTransportDesc}>
              <p>(간선)
                15, 26, 307번 버스
              </p>
              <p>
                [중구청] 하차
              </p>
              <p>

                (간선)
                2, 10, 15, 26, 45번 버스
              </p>
              <p>
                [인천역(차이나타운)] 하차
              </p>
              <p>
                (좌석)
                307번 버스
              </p>
              <p>
                [인천역(차이나타운)] 하차
              </p>
            </div>
          </div>

        </div>
      </div>
    </section >
  );
}

function AccountSection() {
  return (
    <section className={styles.accountSection}>
      <div style={{ fontSize: "25px", textAlign: "center", marginBottom: "2rem", fontWeight: "700" }}>마음 전하실 곳</div>
      <div className={`paper-texture ${styles.accountCard}`}>
        <div className={styles.accountHeader}>
          <p className={styles.accountLabel}>Account</p>
          <p className={styles.accountDesc}>
            참석이 어려우신 분들을 위해 계좌번호를 안내드립니다.
          </p>
        </div>
        <AccountAccordion
          title="신랑 측 계좌번호"
          accounts={invitation.accounts.groom}
        />
        <AccountAccordion
          title="신부 측 계좌번호"
          accounts={invitation.accounts.bride}
        />
      </div>
    </section>
  );
}

function ShareSection() {
  return (
    <section className={styles.shareSection}>
      <ShareActions
        title={`${invitation.couple.groom} · ${invitation.couple.bride} 결혼합니다`}
        text={`${invitation.event.dateText} ${invitation.event.timeText}, ${invitation.event.hall}`}
      />
      <footer className={styles.shareFooter}>© wedding invitation</footer>
    </section>
  );
}

function FamilyBlock({
  label,
  name,
  role,
}: Readonly<{
  label: string;
  name: string;
  role: string;
}>) {
  return (
    <div className={styles.familyBlock}>
      <p className={styles.familyBlockLabel}>{label}</p>
      <p className={styles.familyBlockRole}>{role}</p>
      <p className={styles.familyBlockName}>{name}</p>
    </div>
  );
}

function formatHeroDateKor(
  year: number,
  monthZeroIndexed: number,
  day: number,
) {
  const d = new Date(year, monthZeroIndexed, day, 12, 0, 0);
  const w = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${year}.${m}.${dd}.${w[d.getDay()]}`;
}

function romanize(value: string) {
  const names: Record<string, string> = {
    편범준: "Pyeon Beom Jun",
    유정아: "Yu Jeong Ah",
    이장현: "Lee Jang Hyeon",
    노은아: "Noh Eun Ah",
  };

  return names[value] ?? value;
}
