"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCcw,
  Brain,
  Clock,
  Image as ImageIcon,
  Hash,
  Flame
} from "lucide-react";
import { TREND_TOPICS } from "@/lib/topics";
import type { TrendTopic } from "@/lib/topics";
import {
  generatePost,
  type FormatOption,
  type ToneOption,
  type AudienceOption
} from "@/lib/generator";

type GeneratedPost = ReturnType<typeof generatePost> & {
  id: string;
  topicId: string;
  createdAt: number;
};

const TONES: ToneOption[] = [
  "High energy",
  "Analytical",
  "Storytelling",
  "Playful",
  "Visionary"
];

const FORMATS: FormatOption[] = ["Carousel", "Reel", "Single image"];

const AUDIENCES: AudienceOption[] = [
  "Startup founders",
  "Product managers",
  "Creators & marketers",
  "Investors",
  "Engineers"
];

const findTopic = (id: string): TrendTopic =>
  TREND_TOPICS.find((topic) => topic.id === id) ?? TREND_TOPICS[0];

export default function HomePage() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    TREND_TOPICS[0]?.id ?? ""
  );
  const [tone, setTone] = useState<ToneOption>(TONES[0]);
  const [format, setFormat] = useState<FormatOption>(FORMATS[0]);
  const [audience, setAudience] = useState<AudienceOption>(AUDIENCES[0]);
  const [includeStats, setIncludeStats] = useState(true);
  const [addHook, setAddHook] = useState(true);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedTopic = useMemo(
    () => findTopic(selectedTopicId),
    [selectedTopicId]
  );

  const handleGenerate = () => {
    if (!selectedTopic) return;
    const result = generatePost(selectedTopic, {
      tone,
      format,
      audience,
      includeStats,
      addHook
    });
    setGeneratedPosts((prev) => [
      {
        ...result,
        id: crypto.randomUUID(),
        topicId: selectedTopic.id,
        createdAt: Date.now()
      },
      ...prev
    ]);
  };

  const copyToClipboard = async (id: string, caption: string) => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const recentTopics = useMemo(() => {
    const unique = new Map<string, TrendTopic>();
    generatedPosts.forEach((post) => {
      if (!unique.has(post.topicId)) {
        const topic = findTopic(post.topicId);
        unique.set(post.topicId, topic);
      }
    });
    return Array.from(unique.values());
  }, [generatedPosts]);

  return (
    <>
      <div className="backdrop" />
      <div className="noise-overlay" />
      <main className="content-layer">
        <header className="glass" style={{ marginBottom: "2.25rem" }}>
          <span className="tag">
            <Sparkles size={16} />
            TrendSpark Studio
          </span>
          <h1 className="section-title">
            Drop viral-ready Instagram posts on emerging tech trends.
          </h1>
          <p className="section-subtitle">
            Pick a signal, set the tone, and spin up polished captions,
            moodboards, and timing recommendations engineered for growth-focused
            tech accounts.
          </p>
          <div className="cards-row" style={{ marginTop: "1.5rem" }}>
            <div className="stat-card">
              <strong>90s</strong>
              <span>to concept and ship your next carousel idea.</span>
            </div>
            <div className="stat-card">
              <strong>Auto</strong>
              <span>hooks, proof points, and CTA tailored to your audience.</span>
            </div>
            <div className="stat-card">
              <strong>Fresh</strong>
              <span>topics sourced from the bleeding edge every week.</span>
            </div>
          </div>
        </header>

        <section className="grid grid-2">
          <aside className="glass">
            <div className="pill-group" style={{ marginBottom: "1.35rem" }}>
              {TREND_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  className={`pill ${
                    selectedTopicId === topic.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  {topic.name}
                </button>
              ))}
            </div>
            <div className="topic-card" style={{ marginTop: "1rem" }}>
              <span className="badge">
                <Flame size={14} />
                Trending
              </span>
              <h4>{selectedTopic.name}</h4>
              <p>{selectedTopic.description}</p>
              <div className="topic-tags">
                <span>{selectedTopic.focus}</span>
                {selectedTopic.hashtags.slice(0, 2).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>Signals in motion</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                We surface fast-moving plays, proof points, and angles so your
                post reads like it comes straight from the strategy war room.
              </p>
              <ul
                style={{
                  marginTop: "1rem",
                  paddingLeft: "1.1rem",
                  display: "grid",
                  gap: "0.55rem",
                  color: "rgba(226, 232, 240, 0.8)",
                  lineHeight: 1.55
                }}
              >
                {selectedTopic.proofPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="glass">
            <div
              style={{
                display: "grid",
                gap: "1.2rem"
              }}
            >
              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontWeight: 600 }}>Tone palette</label>
                <div className="pill-group">
                  {TONES.map((option) => (
                    <button
                      key={option}
                      className={`pill ${tone === option ? "active" : ""}`}
                      onClick={() => setTone(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontWeight: 600 }}>Format</label>
                <div className="pill-group">
                  {FORMATS.map((option) => (
                    <button
                      key={option}
                      className={`pill ${format === option ? "active" : ""}`}
                      onClick={() => setFormat(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gap: "0.4rem" }}>
                <label style={{ fontWeight: 600 }}>Audience focus</label>
                <div className="pill-group">
                  {AUDIENCES.map((option) => (
                    <button
                      key={option}
                      className={`pill ${audience === option ? "active" : ""}`}
                      onClick={() => setAudience(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap"
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={includeStats}
                    onChange={(event) => setIncludeStats(event.target.checked)}
                    style={{ accentColor: "#ec4899", width: "18px", height: "18px" }}
                  />
                  Back it with proof points
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={addHook}
                    onChange={(event) => setAddHook(event.target.checked)}
                    style={{ accentColor: "#ec4899", width: "18px", height: "18px" }}
                  />
                  Include hook headline
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.8rem",
                  flexWrap: "wrap",
                  marginTop: "0.4rem"
                }}
              >
                <button className="button-primary" onClick={handleGenerate}>
                  <Sparkles size={18} />
                  Generate Instagram post
                </button>
                <button
                  className="button-secondary"
                  onClick={() => {
                    setTone(TONES[Math.floor(Math.random() * TONES.length)]);
                    setFormat(FORMATS[Math.floor(Math.random() * FORMATS.length)]);
                    setAudience(
                      AUDIENCES[Math.floor(Math.random() * AUDIENCES.length)]
                    );
                  }}
                >
                  <RefreshCcw size={16} />
                  Shake up vibe
                </button>
              </div>
            </div>
          </section>
        </section>

        <section className="glass" style={{ marginTop: "2.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "1.4rem"
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "1.6rem" }}>Post queue</h2>
              <p style={{ marginTop: "0.35rem", color: "var(--muted)" }}>
                Your freshly generated captions, ready to drop into Instagram or
                your scheduler.
              </p>
            </div>
            <span className="badge">
              <Brain size={14} />
              Auto-curated
            </span>
          </div>

          {generatedPosts.length === 0 ? (
            <div
              style={{
                padding: "2.4rem 1.6rem",
                borderRadius: "16px",
                border: "1px dashed rgba(148, 163, 184, 0.25)",
                textAlign: "center",
                color: "rgba(226, 232, 240, 0.75)"
              }}
            >
              <p style={{ marginBottom: "0.6rem" }}>
                No posts yet — dial in your tone and tap generate to spark your first drop.
              </p>
              <p style={{ fontSize: "0.9rem", color: "rgba(148, 163, 184, 0.8)" }}>
                We’ll keep each caption with the creative direction and best posting time.
              </p>
            </div>
          ) : (
            <div className="grid" style={{ gap: "1.4rem" }}>
              {generatedPosts.map((post) => {
                const topic = findTopic(post.topicId);
                const isCopied = copiedId === post.id;
                return (
                  <article key={post.id} className="caption-output">
                    <header
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                        flexWrap: "wrap"
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <h3>{topic.name}</h3>
                        <span className="badge">{format}</span>
                      </div>
                      <button
                        className="button-secondary"
                        onClick={() => copyToClipboard(post.id, post.caption)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        {isCopied ? "Copied!" : "Copy caption"}
                      </button>
                    </header>
                    <pre
                      style={{
                        marginTop: "0.95rem",
                        whiteSpace: "pre-wrap",
                        fontFamily: "inherit",
                        fontSize: "1rem"
                      }}
                    >
                      {post.caption}
                    </pre>
                    <div
                      className="caption-meta"
                      style={{ marginTop: "1.2rem" }}
                    >
                      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center" }}>
                        <Clock size={16} />
                        <span>Best post time: {post.postingTime}</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center" }}>
                        <ImageIcon size={16} />
                        <span>Visual direction: {post.recommendedVisual}</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center" }}>
                        <Hash size={16} />
                        <span>
                          Moodboard keywords: {post.moodBoardKeywords.join(" · ")}
                        </span>
                      </div>
                      <div style={{ color: "rgba(148, 163, 184, 0.85)", fontSize: "0.85rem" }}>
                        Generated {new Date(post.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {recentTopics.length > 0 && (
          <section className="glass" style={{ marginTop: "2rem" }}>
            <h2 style={{ marginTop: 0 }}>Trending board</h2>
            <p style={{ color: "var(--muted)", marginTop: "0.35rem" }}>
              Quick glance at the plays you’ve created content for. Rotate through
              them to stay top of feed while the trend is hot.
            </p>
            <div className="topics-grid" style={{ marginTop: "1.2rem" }}>
              {recentTopics.map((topic) => (
                <div key={topic.id} className="topic-card">
                  <h4>{topic.name}</h4>
                  <p>{topic.focus}</p>
                  <div className="topic-tags">
                    {topic.hashtags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="footer">
          Built for social strategists who ride the cutting edge. Drop new topics
          into <code style={{ background: "rgba(15, 23, 42, 0.65)", padding: "0.2rem 0.4rem", borderRadius: "6px" }}>lib/topics.ts</code> to keep the feed buzzing.
        </footer>
      </main>
    </>
  );
}
