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
          backgroundColor: "#f9f7f4",
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
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={`script-title ${styles.heroTitle}`}>
          Save the Date
        </p>
        <p className={`serif-title ${styles.heroSubtitle}`}>
          <span className={styles.heroName}>{romanize(invitation.couple.groom)}</span>
          <span className={styles.heroAsterisk} aria-hidden>
            *
          </span>
          <span className={styles.heroName}>{romanize(invitation.couple.bride)}</span>
        </p>
      </div>

      <div className={`lace-frame ${styles.heroFrame}`}>
        <div className={styles.heroImageWrap}>
          <Image
            src={invitation.heroImage}
            alt=""
            fill
            priority
            sizes="360px"
            className={styles.heroImage}
          />
        </div>
      </div>

      <p className={`serif-title ${styles.heroInviteText}`}>
        You&apos;re invited to our wedding
      </p>
      <div className={styles.heroDetails}>
        <p>
          {invitation.event.dateText} {invitation.event.timeText}
        </p>
        <p>{invitation.event.hall}</p>
        <p className={styles.heroAddress}>{invitation.event.address}</p>
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
  const textColor = "#acacac";

  return (
    <section className={styles.calendarSection} style={{ color: textColor }}>
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
        className={styles.locationBadge}
        aria-label="카카오맵으로 오시는 길 열기"
      >
        <span className={styles.locationBadgeIcon}>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={styles.locationBadgeIconSvg}
          >
            <path d="M12 22s7-7.1 7-13a7 7 0 0 0-14 0c0 5.9 7 13 7 13Z" />
            <circle cx="12" cy="9" r="2.4" />
          </svg>
        </span>
        <span className={styles.locationBadgeDivider} />
        <span className={styles.locationBadgeText}>
          오시는 길
        </span>
        <span className={styles.locationBadgeArrow}>
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
      <div className={styles.accountBadge}>
        <span className={styles.accountBadgeHeart}>
          ♡
        </span>
        <span className={styles.accountBadgeDivider} />
        <span className={styles.accountBadgeText}>
          마음 전하실 곳
        </span>
        <span className={styles.accountBadgeArrow}>
          ›
        </span>
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

function romanize(value: string) {
  const names: Record<string, string> = {
    편범준: "Pyeon Beom Jun",
    유정아: "Yu Jeong Ah",
    이장현: "Lee Jang Hyeon",
    노은아: "Noh Eun Ah",
  };

  return names[value] ?? value;
}
