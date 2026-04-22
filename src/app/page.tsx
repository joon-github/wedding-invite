import { AccountAccordion } from "@/components/account-accordion";
import { CopyButton } from "@/components/copy-button";
import { Gallery } from "@/components/gallery";
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

        <div className="mx-auto mt-8 w-32 rounded-[50%] border border-[var(--pink)] py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--pink)]">
          <p>{romanize(invitation.couple.groom)}</p>
          <p className="mt-1">May 02, 2026</p>
          <p className="mt-1">11:00 AM</p>
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
  const leadingEmptyDays = Array.from({ length: 4 }, (_, index) => `empty-${index}`);
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <section className="relative bg-black px-6 py-14 text-center text-[#242424]">
      <p className="serif-title text-[38px] font-black tracking-wide">
        2026.10.04. SUN
      </p>
      <p className="serif-title mt-2 text-[24px] font-black italic">
        16:00
      </p>
      <div className="mt-12 grid grid-cols-7 gap-x-1 gap-y-5 text-[19px] font-black">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, index) => (
          <span
            key={day}
            className={
              index === 0
                ? "text-[#8f253d]"
                : index === 6
                  ? "text-[#26345f]"
                  : ""
            }
          >
            {day}
          </span>
        ))}
        {leadingEmptyDays.map((key) => (
          <span key={key} aria-hidden="true" />
        ))}
        {days.map((day) => (
          <CalendarDay key={day} day={day} />
        ))}
      </div>
    </section>
  );
}

function CalendarDay({ day }: Readonly<{ day: number }>) {
  const isWeddingDay = day === 4;
  const isSubstituteHoliday = day === 5;
  const isSunday = [4, 11, 18, 25].includes(day);
  const isSaturday = [3, 10, 17, 24, 31].includes(day);

  return (
    <span
      className={`relative mx-auto grid size-12 place-items-center rounded-full ${
        isWeddingDay
          ? "bg-[#292929] text-[var(--pink)]"
          : isSubstituteHoliday || isSunday
            ? "text-[#8f253d]"
            : isSaturday
              ? "text-[#26345f]"
              : ""
      }`}
    >
      {day}
      {isSubstituteHoliday ? (
        <span className="absolute -bottom-3 left-1/2 w-16 -translate-x-1/2 text-[9px] font-bold leading-none text-[#8f253d]">
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
    <section className="bg-black px-6 py-12 text-white">
      <div className="relative mx-auto mb-8 w-64 rounded-[50%] bg-[var(--pink)] px-8 py-6 text-center text-[32px] font-black text-black">
        오시는 길
        <span className="absolute inset-3 rounded-[50%] border border-black/45" />
      </div>

      <div className="paper-texture px-5 py-5 text-black">
        <div className="grid aspect-[16/11] place-items-center border border-black/20 bg-[#e7e1d6] text-center">
          <div>
            <p className="text-lg font-black">{invitation.event.hall}</p>
            <p className="mt-2 text-sm">{invitation.event.address}</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <p className="text-[15px] font-bold">{invitation.event.address}</p>
          <p className="text-xl font-black">{invitation.event.hall}</p>
          <div className="grid grid-cols-2 gap-2">
            <CopyButton value={invitation.event.address} label="복사하기" />
            <a
              href={invitation.event.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-[var(--pink)] hover:text-black"
            >
              지도 열기
            </a>
          </div>
        </div>
        <hr className="my-6 border-black/30" />
        <div className="space-y-5">
          {invitation.transport.map((item) => (
            <div key={item.title}>
              <p className="font-black">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-black/70">
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
    <section className="bg-black px-6 py-10 text-white">
      <div className="relative mx-auto mb-8 w-72 rounded-[50%] bg-[var(--pink)] px-8 py-6 text-center text-[28px] font-black text-black">
        마음 전하실 곳
        <span className="absolute inset-3 rounded-[50%] border border-black/45" />
      </div>
      <div className="paper-texture px-5 py-4 text-black">
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
