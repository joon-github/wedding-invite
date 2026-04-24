"use client";

import JSZip from "jszip";
import { useCallback, useEffect, useState } from "react";
import styles from "./admin.module.scss";

type Photo = { url: string; uploadedAt: string; pathname: string };
type Message = { id: string; name: string; message: string; createdAt: string };
type QuizResult = { id: number; created_at: string; name: string; score: number; correct: boolean };
type QuizQuestion = { id: number; question: string; image: string | null; options: string[]; answer: number; sort_order: number };

function downloadUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

type SiteSettings = Record<string, boolean>;

const SETTING_LABELS: Record<string, string> = {
  show_guestbook: "방명록",
  show_photo_upload: "포토부스",
  show_quiz: "커플 퀴즈",
};

const ADMIN_TABS = [
  { id: "photos", label: "사진" },
  { id: "guestbook", label: "방명록" },
  { id: "quiz", label: "퀴즈 응답" },
  { id: "quiz-manage", label: "문제" },
  { id: "settings", label: "설정" },
] as const;

type AdminTab = (typeof ADMIN_TABS)[number]["id"];

export function AdminPanel({ adminKey }: { adminKey: string }) {
  const [tab, setTab] = useState<AdminTab>("photos");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState("");
  const [quizSort, setQuizSort] = useState<"latest" | "score-desc" | "perfect">("latest");

  const apiUrl = useCallback((path: string) => `${path}?key=${adminKey}`, [adminKey]);

  useEffect(() => {
    fetch("/api/photos").then((r) => r.json()).then((d) => setPhotos(d.photos ?? []));
    fetch("/api/guestbook").then((r) => r.json()).then((d) => setMessages(d.messages ?? []));
    fetch(apiUrl("/api/quiz-results")).then((r) => r.json()).then((d) => setQuizResults(d.results ?? []));
    fetch(apiUrl("/api/quiz-manage")).then((r) => r.json()).then((d) => setQuestions(d.questions ?? []));
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettings(d.settings ?? {}));
  }, [apiUrl]);

  const toggleSetting = useCallback(async (key: string) => {
    const newValue = !settings[key];
    const label = SETTING_LABELS[key] ?? key;
    const action = newValue ? "활성화" : "비활성화";
    if (!confirm(`${label}을(를) ${action}할까요?`)) return;
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    await fetch(apiUrl("/api/settings"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: newValue }),
    });
  }, [settings, apiUrl]);

  // ── Photo actions ──
  const deletePhoto = useCallback(async (url: string) => {
    if (!confirm("이 사진을 삭제할까요?")) return;
    setDeleting(url);
    await fetch(apiUrl("/api/photos"), { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    setPhotos((prev) => prev.filter((p) => p.url !== url));
    setDeleting(null);
  }, [apiUrl]);

  const downloadSingle = useCallback((photo: Photo) => {
    const name = photo.pathname.split("/").pop() ?? "photo.jpg";
    downloadUrl(photo.url, name);
  }, []);

  const downloadAll = useCallback(async () => {
    if (photos.length === 0 || zipping) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("wedding-photos")!;
      for (let i = 0; i < photos.length; i++) {
        setZipProgress(`${i + 1} / ${photos.length}`);
        const res = await fetch(photos[i].url);
        const blob = await res.blob();
        const ext = photos[i].pathname.split(".").pop() ?? "jpg";
        folder.file(`photo-${String(i + 1).padStart(3, "0")}.${ext}`, blob);
      }
      setZipProgress("압축 중...");
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      downloadUrl(url, "wedding-photos.zip");
      URL.revokeObjectURL(url);
    } catch { alert("다운로드 오류"); }
    finally { setZipping(false); setZipProgress(""); }
  }, [photos, zipping]);

  // ── Message actions ──
  const deleteMessage = useCallback(async (id: string) => {
    if (!confirm("이 메시지를 삭제할까요?")) return;
    setDeleting(id);
    await fetch(apiUrl("/api/guestbook"), { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setDeleting(null);
  }, [apiUrl]);

  // ── Quiz manage actions ──
  const saveQuestion = useCallback(async (q: QuizQuestion) => {
    await fetch(apiUrl("/api/quiz-manage"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q),
    });
    setQuestions((prev) => prev.map((x) => (x.id === q.id ? q : x)));
  }, [apiUrl]);

  const deleteQuestion = useCallback(async (id: number) => {
    if (!confirm("이 문제를 삭제할까요?")) return;
    await fetch(apiUrl("/api/quiz-manage"), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, [apiUrl]);

  const addQuestion = useCallback(async () => {
    const res = await fetch(apiUrl("/api/quiz-manage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "새 문제", options: ["보기1", "보기2", "보기3", "보기4"], answer: 0 }),
    });
    const data = await res.json();
    if (data.question) setQuestions((prev) => [...prev, data.question]);
  }, [apiUrl]);

  const perfectCount = quizResults.filter((r) => r.correct).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>관리자</h1>
        <span className={styles.badge}>Admin</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}><p className={styles.statNumber}>{photos.length}</p><p className={styles.statLabel}>Photos</p></div>
        <div className={styles.stat}><p className={styles.statNumber}>{messages.length}</p><p className={styles.statLabel}>Messages</p></div>
        <div className={styles.stat}><p className={styles.statNumber}>{perfectCount}</p><p className={styles.statLabel}>만점자</p></div>
      </div>

      <div className={styles.tabs}>
        {ADMIN_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`${styles.tab} ${tab === id ? styles.tabActive : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Photos ── */}
      {tab === "photos" ? (
        <>
          {photos.length > 0 ? (
            <button type="button" className={styles.downloadAllButton} disabled={zipping} onClick={downloadAll}>
              {zipping ? `다운로드 중 (${zipProgress})` : `전체 다운로드 (${photos.length}장)`}
            </button>
          ) : null}
          <div className={styles.photoGrid}>
            {photos.length === 0 ? <p className={styles.empty}>업로드된 사진이 없습니다</p> : null}
            {photos.map((photo) => (
              <div key={photo.url} className={styles.photoCard}>
                <img src={photo.url} alt="" className={styles.photoImage} loading="lazy" />
                <div className={styles.photoOverlay}>
                  <button type="button" className={styles.photoActionButton} onClick={() => downloadSingle(photo)} aria-label="다운로드">↓</button>
                  <button type="button" className={`${styles.photoActionButton} ${styles.photoActionDelete}`} disabled={deleting === photo.url} onClick={() => deletePhoto(photo.url)} aria-label="삭제">✕</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {/* ── Guestbook ── */}
      {tab === "guestbook" ? (
        <div className={styles.messageList}>
          {messages.length === 0 ? <p className={styles.empty}>방명록이 비어있습니다</p> : null}
          {messages.map((msg) => (
            <div key={msg.id} className={styles.messageCard}>
              <div className={styles.messageContent}>
                <p><span className={styles.messageName}>{msg.name}</span><span className={styles.messageDate}>{new Date(msg.createdAt).toLocaleDateString("ko-KR")}</span></p>
                <p className={styles.messageBody}>{msg.message}</p>
              </div>
              <button type="button" className={styles.messageDelete} disabled={deleting === msg.id} onClick={() => deleteMessage(msg.id)} aria-label="삭제">✕</button>
            </div>
          ))}
        </div>
      ) : null}

      {/* ── Quiz results ── */}
      {tab === "quiz" ? (
        <div className={styles.messageList}>
          <select
            className={styles.sortSelect}
            value={quizSort}
            onChange={(e) => setQuizSort(e.target.value as typeof quizSort)}
          >
            <option value="latest">최신순</option>
            <option value="score-desc">고득점순</option>
            <option value="perfect">만점자만</option>
          </select>
          {quizResults.length === 0 ? <p className={styles.empty}>아직 퀴즈 응답이 없습니다</p> : null}
          {[...quizResults]
            .filter((r) => quizSort !== "perfect" || r.correct)
            .sort((a, b) => {
              if (quizSort === "score-desc") return b.score - a.score || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })
            .map((r) => (
            <div key={r.id} className={styles.messageCard}>
              <div className={styles.messageContent}>
                <p><span className={styles.messageName}>{r.correct ? "🏆 " : ""}{r.name}</span><span className={styles.messageDate}>{new Date(r.created_at).toLocaleDateString("ko-KR")}</span></p>
                <p className={styles.messageBody}>점수: {r.score}/{questions.length} {r.correct ? " · 만점! 선물 대상" : ""}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* ── Quiz manage ── */}
      {tab === "quiz-manage" ? (
        <div className={styles.quizManage}>
          {questions.map((q, idx) => (
            <QuestionEditor key={q.id} question={q} index={idx} onSave={saveQuestion} onDelete={deleteQuestion} />
          ))}
          <button type="button" className={styles.addQuestionButton} onClick={addQuestion}>
            + 문제 추가
          </button>
        </div>
      ) : null}

      {/* ── Settings ── */}
      {tab === "settings" ? (
        <div className={styles.settingsList}>
          {Object.entries(SETTING_LABELS).map(([key, label]) => (
            <div key={key} className={styles.settingItem}>
              <span className={styles.settingLabel}>{label}</span>
              <button
                type="button"
                className={`${styles.settingToggle} ${settings[key] !== false ? styles.settingToggleOn : ""}`}
                onClick={() => toggleSetting(key)}
              >
                <span className={styles.settingToggleKnob} />
              </button>
            </div>
          ))}
          <p className={styles.settingHint}>
            OFF로 설정하면 메인 페이지에서 해당 섹션이 숨겨집니다.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function QuestionEditor({
  question: initial,
  index,
  onSave,
  onDelete,
}: {
  question: QuizQuestion;
  index: number;
  onSave: (q: QuizQuestion) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [q, setQ] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(patch: Partial<QuizQuestion>) {
    setQ((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  }

  function updateOption(i: number, value: string) {
    const options = [...q.options];
    options[i] = value;
    update({ options });
  }

  async function handleSave() {
    setSaving(true);
    await onSave(q);
    setDirty(false);
    setSaving(false);
  }

  return (
    <div className={styles.questionEditor}>
      <div className={styles.questionEditorHeader}>
        <span className={styles.questionEditorNumber}>Q{index + 1}</span>
        <button type="button" className={styles.questionEditorDelete} onClick={() => onDelete(q.id)}>삭제</button>
      </div>
      <input
        className={styles.questionEditorInput}
        value={q.question}
        onChange={(e) => update({ question: e.target.value })}
        placeholder="문제를 입력하세요"
      />
      <input
        className={styles.questionEditorInputSmall}
        value={q.image ?? ""}
        onChange={(e) => update({ image: e.target.value || null })}
        placeholder="이미지 경로 (선택, 예: /image/xxx.jpeg)"
      />
      <div className={styles.questionEditorOptions}>
        {q.options.map((opt, i) => (
          <div key={i} className={styles.questionEditorOption}>
            <button
              type="button"
              className={`${styles.questionEditorRadio} ${q.answer === i ? styles.questionEditorRadioActive : ""}`}
              onClick={() => update({ answer: i })}
              title="정답으로 설정"
            >
              {q.answer === i ? "✓" : String.fromCharCode(65 + i)}
            </button>
            <input
              className={styles.questionEditorOptionInput}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
            />
          </div>
        ))}
      </div>
      {dirty ? (
        <button type="button" className={styles.questionEditorSave} onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </button>
      ) : null}
    </div>
  );
}
