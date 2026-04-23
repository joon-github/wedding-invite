import { AccountAccordion } from "@/components/account-accordion";
import { CopyButton } from "@/components/copy-button";
import { Gallery } from "@/components/gallery";
import { Guestbook } from "@/components/guestbook";
import { KakaoMap } from "@/components/kakao-map";
import { ShareActions } from "@/components/share-actions";
import { invitation } from "@/lib/invitation";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-black text-white shadow-2xl shadow-black/30">
      <HeroSection />
      <PaperInvitation />
      <FamilyStory />
      <SaveTheDate />
      <PinkGallery />
      <LocationSection />
      <AccountSection />
      <Guestbook />
      <ShareSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="bg-black px-6 pb-12 pt-8 text-center">
      <div className="mx-auto w-full max-w-[430px]">
        <p className="script-title text-[80px] leading-none text-[var(--pink)] sm:text-[92px]">
          Save the Date
        </p>
        <p className="serif-title mt-4 text-[20px] font-black tracking-wide text-white">
          {romanize(invitation.couple.groom)}
          <span className="mx-4 text-[var(--pink)]">*</span>
          {romanize(invitation.couple.bride)}
        </p>
      </div>

      <div className="lace-frame mx-auto mt-12 grid aspect-square w-[88%] max-w-[370px] place-items-center p-8">
        <div className="relative aspect-square w-full overflow-hidden rounded-full">
          <Image
            src={invitation.heroImage}
            alt=""
            fill
            priority
            sizes="360px"
            className="object-cover grayscale-[15%] contrast-95"
          />
        </div>
      </div>

      <p className="serif-title mt-12 text-[28px] font-black uppercase leading-none text-[var(--pink)]">
        You&apos;re invited to our wedding
      </p>
      <div className="mt-10 space-y-2 text-[15px] font-semibold leading-7 text-white">
        <p>
          {invitation.event.dateText} {invitation.event.timeText}
        </p>
        <p>{invitation.event.hall}</p>
        <p className="text-white/75">{invitation.event.address}</p>
      </div>
    </section>
  );
}

function PaperInvitation() {
  return (
    <section className="bg-black px-6 py-10">
      <div className="paper-texture paper-border relative px-7 py-12 text-center text-black">
        <span className="absolute left-1/2 top-7 -translate-x-1/2 text-2xl">
          ♡
        </span>
        <p className="hand-text mt-6 text-[22px] font-bold">
          {invitation.message.headline}
        </p>
        <div className="hand-text mt-5 space-y-3 text-[18px] leading-8">
          {invitation.message.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="hand-text mt-9 text-[18px] leading-8">
          소중한 분들을 모시고 첫 시작을 함께하고자 합니다.
          <br />
          귀한 걸음 하시어 축복해주신다면
          <br />더 없는 기쁨으로 간직하겠습니다.
        </p>

        <div className="mt-10 grid grid-cols-[1fr_92px] gap-4 text-left">
          <div className="relative aspect-[4/3] overflow-hidden bg-white p-2 shadow-md -rotate-1">
            <Image
              src={invitation.gallery[0]}
              alt=""
              fill
              sizes="220px"
              className="object-cover p-2"
            />
          </div>
          <div className="relative mt-8 aspect-[3/4] overflow-hidden bg-zinc-300 p-1 shadow-md rotate-2">
            <Image
              src={invitation.gallery[1]}
              alt=""
              fill
              sizes="92px"
              className="object-cover grayscale"
            />
          </div>
        </div>

        <div className="mx-auto mt-8 w-32 rounded-[50%] border border-[var(--pink)] py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--pink)] w-[50%]">
          <p>{romanize(invitation.couple.groom)}</p>
          <p className="mt-1">October 4, 2026</p>
          <p className="mt-1">16:00 PM</p>
          <p className="mt-1">{romanize(invitation.couple.bride)}</p>
        </div>
      </div>
    </section>
  );
}

function FamilyStory() {
  return (
    <section className="bg-black px-6 pb-10 pt-6">
      <div className="relative pb-10">
        <div className="relative w-[72%] bg-white p-1 shadow-xl rotate-1">
          <Image
            src={invitation.gallery[2]}
            alt=""
            width={760}
            height={900}
            className="aspect-[4/5] object-cover"
          />
          <span className="absolute -left-4 top-16 h-12 w-8 bg-[var(--tape)]" />
        </div>
        <div className="notebook-paper hand-text relative ml-auto -mt-10 w-[88%] -rotate-3 px-6 py-8 text-[19px] leading-9 text-black shadow-lg">
          <p>착하고 멋있는 아들 {invitation.couple.groom}아!</p>
          <p>엄마 아빠 아들로 태어나서 항상 고맙고 감사하다.</p>
          <p>언제나 기쁘게 행복하게, 서로 의지하면서 잘 살아라.</p>
          <p className="mt-4">사랑한다 ~ ♡</p>
        </div>
        <div className="relative -mt-4 ml-auto w-[46%] rotate-6">
          <Image
            src={invitation.gallery[3]}
            alt=""
            width={500}
            height={620}
            className="aspect-[4/5] rounded-sm object-cover shadow-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
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
    <section className="relative bg-black px-6 py-14 text-center"
      style={{ color: textColor }}
    >
      <p className="serif-title text-[38px] font-black tracking-wide">
        2026.10.04. SUN
      </p>
      <p className="serif-title mt-2 text-[24px] font-black italic">
        16:00
      </p>
      <div className="mt-12 grid grid-cols-7 gap-x-1 gap-y-5 text-[19px] font-black">
        {["SUN", "M", "T", "W", "T", "F", "SAT"].map((day, index) => (
          <span
            key={`${day}-${index}`}
            className={
              index === 0
                ? "text-[#c72c4d]"
                : index === 6
                  ? "text-[#3854c5]"
                  : ""
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
                className="size-12"
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

  return (
    <span
      className={`relative mx-auto grid size-12 place-items-center rounded-full ${isWeddingDay
        ? "bg-[#292929] text-[var(--pink)]"
        : isSubstituteHoliday || isSunday
          ? "text-[#c72c4d]"
          : isSaturday
            ? "text-[#3854c5]"
            : ""
        }`}
    >
      {day}
      {isSubstituteHoliday ? (
        <span className="absolute -bottom-3 left-1/2 w-16 -translate-x-1/2 text-[9px] font-bold leading-none text-[#7b2034]">
          대체공휴일
        </span>
      ) : null}
    </span>
  );
}

function PinkGallery() {
  return (
    <section className="pink-collage px-8 py-12 text-black">
      <div className="mx-auto max-w-[340px] space-y-8">
        <div className="bg-white p-3 shadow-lg">
          <Image
            src={invitation.gallery[4]}
            alt=""
            width={760}
            height={900}
            className="aspect-square object-cover"
          />
          <p className="hand-text mt-5 text-center text-[20px] leading-8">
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
    <section className="bg-black px-6 py-14 text-white">
      <a
        href={invitation.event.kakaoMapUrl}
        target="_blank"
        rel="noreferrer"
        className="mx-auto mb-8 grid h-16 max-w-[320px] grid-cols-[56px_1px_1fr_38px] items-center rounded-full border border-[var(--pink)] bg-[#11110f] px-5 text-[var(--pink)] shadow-[0_0_18px_rgba(230,160,191,0.28)] transition hover:bg-[#171313] hover:shadow-[0_0_26px_rgba(230,160,191,0.42)]  w-[70%]"
        aria-label="카카오맵으로 오시는 길 열기"
      >
        <span className="grid place-items-center">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s7-7.1 7-13a7 7 0 0 0-14 0c0 5.9 7 13 7 13Z" />
            <circle cx="12" cy="9" r="2.4" />
          </svg>
        </span>
        <span className="h-9 w-px bg-white/18" />
        <span className="text-center text-[24px] font-light tracking-[0.08em] text-white">
          오시는 길
        </span>
        <span className="text-center text-[34px] font-light leading-none text-[var(--pink)]">
          ›
        </span>
      </a>

      <div className="paper-texture relative px-5 py-5 text-black shadow-2xl shadow-black/35">
        <span className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rotate-2 bg-[var(--tape)]/90" />
        <div className="mb-4 flex items-end justify-between border-b border-black/25 pb-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">
              Location
            </p>
            <p className="mt-1 text-2xl font-black">{invitation.event.hall}</p>
          </div>
          <p className="serif-title text-4xl font-black text-black/20">01</p>
        </div>
        <KakaoMap
          title={invitation.event.hall}
          address={invitation.event.address}
          lat={invitation.event.lat}
          lng={invitation.event.lng}
          naverUrl={invitation.event.mapUrl}
          kakaoUrl={invitation.event.kakaoMapUrl}
        />
        <div className="mt-5 space-y-4">
          <div className="border-l-4 border-black pl-3">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45">
              Address
            </p>
            <p className="mt-1 text-[15px] font-bold leading-6">
              {invitation.event.address}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <CopyButton
              value={invitation.event.address}
              label="복사"
              className="border-black/30 bg-white/40 text-xs font-bold"
            />
            <a
              href={invitation.event.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-3 text-xs font-medium text-white transition hover:bg-[var(--pink)] hover:text-black"
            >
              네이버
            </a>
            <a
              href={invitation.event.kakaoMapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#fee500] px-3 text-xs font-bold text-black transition hover:bg-[var(--pink)]"
            >
              카카오
            </a>
          </div>
        </div>
        <div className="my-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-black/25" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/45">
            Guide
          </span>
          <span className="h-px flex-1 bg-black/25" />
        </div>
        <div className="space-y-3">
          {invitation.transport.map((item) => (
            <div
              key={item.title}
              className="grid grid-cols-[72px_1fr] gap-3 border border-black/10 bg-white/30 p-3"
            >
              <p className="text-sm font-black">{item.title}</p>
              <p className="text-sm leading-6 text-black/65">
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
    <section className="bg-black px-6 py-12 text-white">
      <div className="mx-auto mb-8 grid h-16 max-w-[340px] grid-cols-[58px_1px_1fr_38px] items-center rounded-full border border-[var(--pink)] bg-[#11110f] px-5 text-[var(--pink)] shadow-[0_0_18px_rgba(230,160,191,0.28)]">
        <span className="grid place-items-center text-[34px] font-light leading-none">
          ♡
        </span>
        <span className="h-9 w-px bg-[var(--pink)]/60" />
        <span className="text-center text-[23px] font-light tracking-[0.04em] text-white">
          마음 전하실 곳
        </span>
        <span className="text-center text-[34px] font-light leading-none text-[var(--pink)]">
          ›
        </span>
      </div>
      <div className="paper-texture relative px-5 py-5 text-black shadow-2xl shadow-black/35">
        <span className="absolute -top-4 left-8 h-8 w-20 -rotate-6 bg-[var(--tape)]/90" />
        <span className="absolute -top-4 right-8 h-8 w-20 rotate-6 bg-[var(--tape)]/90" />
        <div className="mb-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-black/45">
            Account
          </p>
          <p className="mt-2 text-sm leading-6 text-black/65">
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
    <section className="bg-black px-6 pb-12 pt-4">
      <ShareActions
        title={`${invitation.couple.groom} · ${invitation.couple.bride} 결혼합니다`}
        text={`${invitation.event.dateText} ${invitation.event.timeText}, ${invitation.event.hall}`}
      />
      <footer className="pt-10 text-center text-xs text-white/55">
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
    <div className="border-y border-white/30 py-5 text-white">
      <p className="text-xs leading-5 text-white/70">{label}</p>
      <p className="mt-3 text-sm text-[var(--pink)]">{role}</p>
      <p className="mt-1 text-xl font-semibold">{name}</p>
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
