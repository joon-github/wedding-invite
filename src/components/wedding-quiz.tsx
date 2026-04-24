"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import styles from "./wedding-quiz.module.scss";

type ClientQuestion = {
  id: number;
  question: string;
  image: string | null;
  options: string[];
};

type Phase = "intro" | "loading" | "playing" | "result";
type Result = { score: number; total: number; perfect: boolean; passphrase: string | null };

export function WeddingQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("name");
    if (param) setName(param);
  }, []);
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startQuiz = useCallback(async () => {
    setPhase("loading");
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      const qs: ClientQuestion[] = data.questions ?? [];
      if (qs.length === 0) {
        setPhase("intro");
        return;
      }
      setCurrent(0);
      setRevealed(false);
      setCorrectAnswer(null);
      setAnswers(qs.map(() => null));
      setQuestions(qs);
      setPhase("playing");
    } catch {
      setPhase("intro");
    }
  }, []);

  const q = questions[current] ?? null;

  const selectOption = useCallback(
    async (optionIndex: number) => {
      if (revealed || q === null) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[current] = optionIndex;
        return next;
      });

      try {
        const res = await fetch(`/api/quiz/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: q.id, selected: optionIndex }),
        });
        const data = await res.json();
        setCorrectAnswer(data.answer);
      } catch {
        setCorrectAnswer(optionIndex);
      }
      setRevealed(true);
    },
    [current, revealed, q],
  );

  const goNext = useCallback(async () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setRevealed(false);
      setCorrectAnswer(null);
    } else {
      setSubmitting(true);
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, answers }),
        });
        const data = await res.json();
        setResult(data);
        setPhase("result");
      } catch {
        setPhase("result");
        setResult({ score: 0, total: questions.length, perfect: false, passphrase: null });
      }
      setSubmitting(false);
    }
  }, [current, questions.length, name, answers]);

  const retry = useCallback(() => {
    setPhase("intro");
    setCurrent(0);
    setAnswers([]);
    setRevealed(false);
    setCorrectAnswer(null);
    setResult(null);
    setQuestions([]);
  }, []);

  return (
    <section className={styles.section}>
      <div className="section-badge">
        <span className="section-badge__icon">❓</span>
        <span className="section-badge__divider" />
        <span className="section-badge__text">커플 퀴즈</span>
        <span className="section-badge__arrow">›</span>
      </div>

      <div className={`paper-texture ${styles.card}`}>
        <span className={styles.tapeLeft} />
        <span className={styles.tapeRight} />

        {phase === "intro" || phase === "loading" ? (
          <div className={styles.intro}>
            <p className={styles.introEmoji}>💝</p>
            <p className={styles.introTitle}>범준 & 정아 퀴즈</p>
            <p className={styles.introDesc}>
              두 사람에 대해 얼마나 알고 계신가요?
            </p>
            <div className={styles.introPrize}>
              <span className={styles.introPrizeStrong}>모두 맞히신 분</span>께는
              결혼식 당일{" "}
              <span className={styles.introPrizeStrong}>특별한 선물</span>이
              준비되어 있습니다 🎁
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              maxLength={20}
              className={styles.nameInput}
            />
            <button
              type="button"
              className={styles.startButton}
              disabled={!name.trim() || phase === "loading"}
              onClick={startQuiz}
            >
              {phase === "loading" ? "불러오는 중..." : "퀴즈 시작"}
            </button>
          </div>
        ) : null}

        {phase === "playing" && q !== null ? (
          <>
            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((current + (revealed ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {current + 1} / {questions.length}
              </span>
            </div>

            <div key={current} className={styles.questionCard}>
              {q.image ? (
                <Image
                  src={q.image}
                  alt=""
                  width={600}
                  height={375}
                  className={styles.questionImage}
                />
              ) : null}
              <p className={styles.questionText}>
                Q{current + 1}. {q.question}
              </p>
              <div className={styles.options}>
                {q.options.map((option, i) => {
                  const selected = answers[current] === i;
                  const isCorrect = revealed && correctAnswer === i;
                  const isWrong = revealed && selected && correctAnswer !== i;

                  let optionClass = styles.option;
                  let markerClass = styles.optionMarker;

                  if (revealed) {
                    optionClass += ` ${styles.optionLocked}`;
                    if (isCorrect) {
                      optionClass += ` ${styles.optionCorrect}`;
                      markerClass += ` ${styles.optionMarkerCorrect}`;
                    } else if (isWrong) {
                      optionClass += ` ${styles.optionWrong}`;
                      markerClass += ` ${styles.optionMarkerWrong}`;
                    }
                  } else if (selected) {
                    optionClass += ` ${styles.optionSelected}`;
                    markerClass += ` ${styles.optionMarkerSelected}`;
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      className={optionClass}
                      onClick={() => selectOption(i)}
                    >
                      <span className={markerClass}>
                        {isCorrect ? "✓" : isWrong ? "✕" : String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {revealed ? (
                <>
                  <div
                    className={`${styles.feedback} ${
                      answers[current] === correctAnswer
                        ? styles.feedbackCorrect
                        : styles.feedbackWrong
                    }`}
                  >
                    {answers[current] === correctAnswer ? "정답입니다! 🎉" : "아쉽지만 틀렸어요 😢"}
                  </div>
                  <button
                    type="button"
                    className={styles.nextButton}
                    onClick={goNext}
                    disabled={submitting}
                  >
                    {submitting
                      ? "제출 중..."
                      : current < questions.length - 1
                        ? "다음 문제"
                        : "결과 보기"}
                  </button>
                </>
              ) : null}
            </div>
          </>
        ) : null}

        {phase === "result" && result ? (
          <div className={styles.result}>
            <p className={styles.resultEmoji}>
              {result.perfect ? "🏆" : result.score >= 3 ? "👏" : "😅"}
            </p>
            <p className={styles.resultScore}>
              {result.score} / {result.total}
            </p>
            <p className={styles.resultLabel}>{name}님의 점수</p>
            <p className={styles.resultMessage}>
              {result.perfect
                ? "완벽합니다! 두 사람을 정말 잘 알고 계시네요!"
                : result.score >= 3
                  ? "거의 다 맞혔어요! 대단합니다!"
                  : "다음에 다시 도전해보세요!"}
            </p>

            {result.perfect && result.passphrase ? (
              <div className={styles.secret}>
                <p className={styles.secretLabel}>Secret Passphrase</p>
                <p className={styles.secretPassphrase}>
                  &quot;{result.passphrase}&quot;
                </p>
                <p className={styles.secretHint}>
                  이 문구를 꼭 기억해주세요!
                  <br />
                  결혼식 당일{" "}
                  <span className={styles.secretHintStrong}>이 암구호를 말씀하시면</span>
                  <br />
                  특별한 선물이 증정됩니다 🎁
                </p>
              </div>
            ) : null}

            {!result.perfect ? (
              <button type="button" className={styles.retryButton} onClick={retry}>
                다시 도전하기
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
