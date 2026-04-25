import { AccountAccordion } from "@/components/account-accordion";
import { CopyButton } from "@/components/copy-button";
import { DdayCounter } from "@/components/dday-counter";
import { EnvelopeGate } from "@/components/envelope-gate";
import { Gallery } from "@/components/gallery";
import { Guestbook } from "@/components/guestbook";
import { KakaoMap } from "@/components/kakao-map";
import { PhotoUpload } from "@/components/photo-upload";
import { ShareActions } from "@/components/share-actions";
import { WeddingQuiz } from "@/components/wedding-quiz";
import { colors } from "@/lib/design-tokens";
import { invitation } from "@/lib/invitation";
import { supabase } from "@/lib/supabase";
import { Gowun_Batang } from "next/font/google";
import Image from "next/image";
import styles from "./page.module.scss";

const heroSerif = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

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
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);
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
        <DdayCounter targetDate="2026-10-04" />
        <PaperInvitation />
        <FamilyStory />
        <SaveTheDate />
        <PinkGallery />
        <LocationSection />
        <AccountSection />
        {settings.show_guestbook !== false ? <Guestbook /> : null}
        {settings.show_photo_upload !== false ? <PhotoUpload /> : null}
        {settings.show_quiz !== false ? <WeddingQuiz /> : null}
        <ShareSection />
      </main>
    </>
  );
}

function HeroSection() {
  const [a, b, c] = invitation.heroTagline;
  const heroDate = formatHeroDateKor(2026, 9, 4);

  return (
    <section className={`${styles.hero} ${heroSerif.className}`}>
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

      <div className={styles.heroRibbonImageFrame}> {/* ribbon */}
        <div className={styles.heroRibbonImageWrap}>
          <Image
            src={invitation.ribbonImage}  //ribbon
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 480px) 90vw, 400px"
            className={styles.heroImage}
          />
        </div>
      </div>
      <div className={styles.heroImageFrame}>
        <div className={styles.heroImageWrap}>
          <Image
            src={invitation.heroImage}
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 480px) 90vw, 400px"
            className={styles.heroImage}
          />
        </div>
      </div>

      {/* <p className={styles.heroDateLine}>{heroDate}</p> */}

      {/* <div className={styles.heroNames} lang="ko">
        <span className={styles.heroGroomName}>{invitation.couple.groom}</span>
        <span className={styles.heroAnd}>그리고</span>
        <span className={styles.heroBrideName}>{invitation.couple.bride}</span>
      </div> */}

      {/* <p className={styles.heroClosing}>저희, 결혼합니다.</p> */}

      <div className={styles.heroMeta} lang="ko">
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
      </div>
    </section>
  );
}

function PaperInvitation() {
  return (
    <section className={styles.paperSection}>
      <div className={`paper-texture paper-border ${styles.paperCard}`}>
        <span className={styles.paperHeart}>
          ♡
        </span>
        <p className={`hand-text ${styles.paperHeadline}`}>
          {invitation.message.headline}
        </p>
        <div className={`hand-text ${styles.paperBody}`}>
          {invitation.message.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className={`hand-text ${styles.paperClosing}`}>
          소중한 분들을 모시고 첫 시작을 함께하고자 합니다.
          <br />
          귀한 걸음 하시어 축복해주신다면
          <br />더 없는 기쁨으로 간직하겠습니다.
        </p>

        <div className={styles.paperPhotoGrid}>
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
        </div>

        <div className={styles.paperBadge}>
          <p>{romanize(invitation.couple.groom)}</p>
          <p className={styles.paperBadgeLine}>October 4, 2026</p>
          <p className={styles.paperBadgeLine}>17:00 PM</p>
          <p className={styles.paperBadgeLine}>{romanize(invitation.couple.bride)}</p>
        </div>
      </div>
    </section>
  );
}

function FamilyStory() {
  return (
    <section className={styles.familySection}>
      <div className={styles.familyStory}>
        <div className={styles.familyPhotoMain}>
          <Image
            src={invitation.gallery[2]}
            alt=""
            width={760}
            height={900}
            className={styles.familyPhotoMainImg}
          />
          <span className={styles.familyTape} />
        </div>
        <div className={`notebook-paper hand-text ${styles.familyNote}`}>
          <span className={styles.familyNoteTapeRight} aria-hidden />
          <p>착하고 멋있는 아들 {invitation.couple.groom.substring(1)}아!</p>
          <p>우리 아들로 태어나서 항상 고맙고 감사하다.</p>
          <p>언제나 기쁘게 행복하게, 서로 의지하면서 잘 살아라.</p>
          <p className={styles.familyNoteParagraph}>사랑한다 ~ ♡</p>
        </div>
        <div className={styles.familyPhotoSmall}>
          <Image
            src={invitation.gallery[3]}
            alt=""
            width={500}
            height={620}
            className={styles.familyPhotoSmallImg}
          />
          <span className={styles.familyPhotoSmallTape} aria-hidden />
        </div>
      </div>

      <div className={styles.familyGrid}>
        <FamilyBlock
          label={`${invitation.couple.groomParents}의 아들`}
          name={invitation.couple.groom}
          role="신랑"
        />
        <FamilyBlock
          label={`${invitation.couple.brideParents}의 딸`}
          name={invitation.couple.bride}
          role="신부"
        />
      </div>
    </section>
  );
}

function SaveTheDate() {
  const calendarWeeks = [
    [null, null, null, null, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31],
  ];
  return (
    <section className={styles.calendarSection}>
      <div
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
      </div>

      <div className={`paper-texture ${styles.calendarCard}`}>
        <span className={styles.calendarTape} aria-hidden />
        <p className={`serif-title ${styles.calendarTitle}`}>
          2026.10.04. SUN
        </p>
        <p className={`serif-title ${styles.calendarTime}`}>
          17:00
        </p>
        <div className={styles.calendarGrid}>
          {["SUN", "M", "T", "W", "T", "F", "SAT"].map((day, index) => (
            <span
              key={`${day}-${index}`}
              className={
                index === 0
                  ? styles.daySunday
                  : index === 6
                    ? styles.daySaturday
                    : undefined
              }
            >
              {day}
            </span>
          ))}
          {calendarWeeks.flatMap((week, weekIndex) =>
            week.map((day, dayIndex) =>
              day === null ? (
                <span
                  key={`empty-${weekIndex}-${dayIndex}`}
                  className={styles.calendarEmpty}
                  aria-hidden="true"
                />
              ) : (
                <CalendarDay key={day} day={day} dayIndex={dayIndex} />
              ),
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function CalendarDay({
  day,
  dayIndex,
}: Readonly<{ day: number; dayIndex: number }>) {
  const isWeddingDay = day === 4;
  const isSubstituteHoliday = day === 5;
  const isSunday = dayIndex === 0;
  const isSaturday = dayIndex === 6;

  const dayClassName = [
    styles.calendarDay,
    isWeddingDay ? styles.calendarDayWedding : undefined,
    !isWeddingDay && (isSubstituteHoliday || isSunday) ? styles.daySunday : undefined,
    !isWeddingDay && !isSubstituteHoliday && !isSunday && isSaturday ? styles.daySaturday : undefined,
  ].filter(Boolean).join(" ");

  return (
    <span className={dayClassName}>
      {day}
      {isSubstituteHoliday ? (
        <span className={styles.calendarDayHolidayLabel}>
          대체공휴일
        </span>
      ) : null}
    </span>
  );
}

function PinkGallery() {
  return (
    <section className={`pink-collage ${styles.pinkSection}`}>
      <div className={styles.pinkInner}>
        <div className={styles.pinkPhotoCard}>
          <Image
            src={invitation.gallery[4]}
            alt=""
            width={760}
            height={900}
            className={styles.pinkPhotoImg}
          />
          <p className={`hand-text ${styles.pinkCaption}`}>
            내 인생에 가장 큰 선물은
            <br />
            너와 함께라면 어떤 길도
            <br />
            행복한 여정이 될 거야.
          </p>
        </div>

        <Gallery images={invitation.gallery} />
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className={styles.locationSection}>
      <a
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
        <span className="section-badge__text section-badge__text--wide">
          오시는 길
        </span>
        <span className="section-badge__arrow">
          ›
        </span>
      </a>

      <div className={`paper-texture ${styles.locationCard}`}>
        <span className={styles.locationTape} />
        <div className={styles.locationHeader}>
          <div>
            <p className={styles.locationLabel}>
              Location
            </p>
            <p className={styles.locationHallName}>{invitation.event.hall}</p>
          </div>
          <p className={`serif-title ${styles.locationNumber}`}>01</p>
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
            <p className={styles.locationAddressLabel}>
              Address
            </p>
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
          <span className={styles.locationDividerText}>
            Guide
          </span>
          <span className={styles.locationDividerLine} />
        </div>
        <div className={styles.locationTransport}>
          {invitation.transport.map((item) => (
            <div
              key={item.title}
              className={styles.locationTransportItem}
            >
              <p className={styles.locationTransportTitle}>{item.title}</p>
              <p className={styles.locationTransportDesc}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccountSection() {
  return (
    <section className={styles.accountSection}>
      <div className="section-badge">
        <span className="section-badge__icon section-badge__icon--heart">
          ♡
        </span>
        <span className="section-badge__divider" />
        <span className="section-badge__text">마음 전하실 곳</span>
        <span className="section-badge__arrow">›</span>
      </div>
      <div className={`paper-texture ${styles.accountCard}`}>
        <span className={styles.accountTapeLeft} />
        <span className={styles.accountTapeRight} />
        <div className={styles.accountHeader}>
          <p className={styles.accountLabel}>
            Account
          </p>
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
      <footer className={styles.shareFooter}>
        © wedding invitation
      </footer>
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

function formatHeroDateKor(year: number, monthZeroIndexed: number, day: number) {
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
