"use client";

import { useState, useRef, useEffect, Fragment } from "react";

// Ordered longest-first to avoid partial matches (e.g. "Palm Jebel Ali" before "Emaar")
const PROPERTY_NAMES = [
  "Palm Jebel Ali Villas by Nakheel",
  "Jumeirah Residences by Meraas",
  "Dolce Vita by Vincitore",
  "Maritime City Beyond",
  "SkyRise by Binghatti",
  "Element by Sobha",
  "Chelsea by Damac",
  "Cascade by Iman",
  "Danube Diamondz",
  "Danube Oceanz",
];

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")   // **bold** → bold
    .replace(/\*(.+?)\*/g, "$1")        // *italic* → italic
    .replace(/\_\_(.+?)\_\_/g, "$1")    // __bold__ → bold
    .replace(/\_(.+?)\_/g, "$1")        // _italic_ → italic
    .replace(/^#{1,6}\s+/gm, "")        // ## heading → heading
    .replace(/^[\-\*]\s+/gm, "")        // - list item → item (removes bullet)
    .replace(/^\d+\.\s+/gm, "");        // 1. list item → item (removes number)
}

function renderWithBoldNames(text: string): React.ReactNode[] {
  const clean = stripMarkdown(text);
  const pattern = new RegExp(`(${PROPERTY_NAMES.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = clean.split(pattern);
  return parts.map((part, i) =>
    PROPERTY_NAMES.includes(part) ? (
      <strong key={i} style={{ fontWeight: 700 }}>{part}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

const BRAND = {
  gold: "#C9A84C",
  goldLight: "#E8D590",
  dark: "#1A1A1A",
  darker: "#111111",
  darkCard: "#222222",
  darkBorder: "#333333",
  white: "#FFFFFF",
  gray: "#999999",
  grayLight: "#CCCCCC",
  greenOnline: "#4ADE80",
};

interface Message {
  role: "user" | "assistant";
  content: string;
  showForm?: boolean;
  showCalendly?: boolean;
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: BRAND.gold,
            opacity: 0.5,
            animation: `typing 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

function LeadForm({ onSubmit, onSkip }: { onSubmit: (data: { name: string; email: string; phone: string }) => void; onSkip: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Kérjük adja meg a nevét";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Érvényes email cím szükséges";
    if (!form.phone.trim()) e.phone = "Kérjük adja meg a telefonszámát";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${BRAND.darkCard}, ${BRAND.darker})`,
        border: `1px solid ${BRAND.gold}33`,
        borderRadius: 12,
        padding: 20,
        marginTop: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `${BRAND.gold}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          📋
        </div>
        <div>
          <div style={{ color: BRAND.gold, fontWeight: 600, fontSize: 14 }}>
            Ingyenes konzultáció
          </div>
          <div style={{ color: BRAND.gray, fontSize: 12 }}>
            Kérjük, adja meg adatait és felvesszük Önnel a kapcsolatot!
          </div>
        </div>
      </div>

      {(["name", "email", "phone"] as const).map((field) => (
        <div key={field} style={{ marginBottom: 10 }}>
          <input
            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
            placeholder={
              field === "name" ? "Teljes név" : field === "email" ? "Email cím" : "Telefonszám"
            }
            value={form[field]}
            onChange={(e) => {
              setForm({ ...form, [field]: e.target.value });
              if (errors[field]) setErrors({ ...errors, [field]: null });
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: BRAND.darker,
              border: `1px solid ${errors[field] ? "#ef4444" : BRAND.darkBorder}`,
              borderRadius: 8,
              color: BRAND.white,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              if (!errors[field]) e.target.style.borderColor = BRAND.gold;
            }}
            onBlur={(e) => {
              if (!errors[field]) e.target.style.borderColor = BRAND.darkBorder;
            }}
          />
          {errors[field] && (
            <div style={{ color: "#ef4444", fontSize: 11, marginTop: 3, paddingLeft: 4 }}>
              {errors[field]}
            </div>
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => validate() && onSubmit(form)}
          style={{
            flex: 1,
            padding: "10px 0",
            background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
            color: BRAND.darker,
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${BRAND.gold}44`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          Visszahívást kérek
        </button>
        <button
          onClick={onSkip}
          style={{
            padding: "10px 16px",
            background: "transparent",
            color: BRAND.gray,
            border: `1px solid ${BRAND.darkBorder}`,
            borderRadius: 8,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Később
        </button>
      </div>
    </div>
  );
}

function CalendlyEmbed() {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${BRAND.darkCard}, ${BRAND.darker})`,
        border: `1px solid ${BRAND.gold}33`,
        borderRadius: 12,
        padding: 20,
        marginTop: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `${BRAND.gold}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          📅
        </div>
        <div>
          <div style={{ color: BRAND.gold, fontWeight: 600, fontSize: 14 }}>
            Időpont foglalás
          </div>
          <div style={{ color: BRAND.gray, fontSize: 12 }}>
            Foglaljon ingyenes konzultációt Mátyással
          </div>
        </div>
      </div>
      <a
        href="https://calendly.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          padding: "12px 0",
          background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
          color: BRAND.darker,
          border: "none",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          textDecoration: "none",
          transition: "transform 0.15s",
        }}
      >
        Konzultáció foglalása →
      </a>
      <div style={{ color: BRAND.gray, fontSize: 11, textAlign: "center", marginTop: 8 }}>
        30 perces ingyenes videóhívás • Magyar nyelven
      </div>
    </div>
  );
}

function ChatMessage({
  msg,
  onFormSubmit,
  onFormSkip,
}: {
  msg: Message;
  onFormSubmit: (data: { name: string; email: string; phone: string }) => void;
  onFormSkip: () => void;
}) {
  const isUser = msg.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 6,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div style={{ maxWidth: "82%", display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            padding: "10px 16px",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            background: isUser
              ? `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`
              : BRAND.darkCard,
            color: isUser ? BRAND.darker : BRAND.white,
            fontSize: 14,
            lineHeight: 1.5,
            border: isUser ? "none" : `1px solid ${BRAND.darkBorder}`,
            whiteSpace: "pre-wrap",
          }}
        >
          {renderWithBoldNames(msg.content)}
        </div>
        {msg.showForm && <LeadForm onSubmit={onFormSubmit} onSkip={onFormSkip} />}
        {msg.showCalendly && <CalendlyEmbed />}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Üdvözlöm! 👋 A Dubaji Ingatlanos AI asszisztense vagyok. Segítek Önnek megismerni a dubaji ingatlanpiac lehetőségeit. Kérdezzen bátran az elérhető ingatlanokról, befektetési lehetőségekről, vagy akár a vásárlás menetéről!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [formShown, setFormShown] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [unread, setUnread] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgCountRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (chatOpen && inputRef.current) inputRef.current.focus();
  }, [chatOpen]);

  const handleFormSubmit = (data: { name: string; email: string; phone: string }) => {
    fetch("https://hook.eu1.make.com/gej9h54cmq4b9htfsqylut57rvd58fij", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, phone: data.phone }),
    }).catch(() => {});
    setFormSubmitted(true);
    setMessages((prev) => {
      const updated = prev.map((m) => (m.showForm ? { ...m, showForm: false } : m));
      return [
        ...updated,
        {
          role: "assistant" as const,
          content: `Köszönjük ${data.name}! 🎉 Az adatait rögzítettük. Mátyás hamarosan felveszi Önnel a kapcsolatot a megadott elérhetőségeken. Addig is, ha bármilyen kérdése van, szívesen segítek!`,
          showCalendly: true,
        },
      ];
    });
  };

  const handleFormSkip = () => {
    setFormShown(true);
    setMessages((prev) => prev.map((m) => (m.showForm ? { ...m, showForm: false } : m)));
  };

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || loading) return;

    setInput("");
    msgCountRef.current += 1;

    const userMsg: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const shouldShowForm = !formShown && !formSubmitted && msgCountRef.current >= 2;

    try {
      const history = [...messages.filter((m) => !m.showForm && !m.showCalendly), userMsg].map(
        ({ role, content }) => ({ role, content })
      );

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply =
        data.content ||
        "Elnézést, technikai hiba történt. Kérem próbálja újra, vagy írjon nekünk a +971 58 511 9008 számon WhatsApp-on!";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          showForm: shouldShowForm,
        },
      ]);

      if (shouldShowForm) setFormShown(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Elnézést, technikai hiba történt. Kérem próbálja újra, vagy írjon nekünk közvetlenül WhatsApp-on: +971 58 511 9008",
        },
      ]);
    }

    setLoading(false);
  };

  const quickActions = [
    "Milyen ingatlanok elérhetőek?",
    "Miért érdemes Dubajban befektetni?",
    "Mennyi az induló költség?",
    "Konzultációt szeretnék",
  ];

  if (!chatOpen) {
    return (
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
        <button
          onClick={() => {
            setChatOpen(true);
            setUnread(0);
          }}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`,
            border: "none",
            cursor: "pointer",
            boxShadow: `0 4px 24px ${BRAND.gold}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            animation: "pulse 2.5s ease-in-out infinite",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 32px ${BRAND.gold}77`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 24px ${BRAND.gold}55`;
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              fill={BRAND.darker}
              stroke={BRAND.darker}
              strokeWidth="1.5"
            />
          </svg>
        </button>
        {unread > 0 && (
          <div
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#ef4444",
              color: "white",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid white`,
            }}
          >
            {unread}
          </div>
        )}
        <style>{`
          @keyframes pulse {
            0%, 100% { box-shadow: 0 4px 24px ${BRAND.gold}55; }
            50% { box-shadow: 0 4px 32px ${BRAND.gold}88; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 400,
        maxWidth: "calc(100vw - 32px)",
        height: 600,
        maxHeight: "calc(100vh - 48px)",
        background: BRAND.darker,
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 16px 64px rgba(0,0,0,0.6), 0 0 0 1px ${BRAND.darkBorder}`,
        zIndex: 9999,
        animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          background: `linear-gradient(135deg, ${BRAND.dark}, ${BRAND.darker})`,
          borderBottom: `1px solid ${BRAND.darkBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${BRAND.gold}22, ${BRAND.gold}11)`,
              border: `1px solid ${BRAND.gold}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: BRAND.gold,
              letterSpacing: 0.5,
            }}
          >
            ADI
          </div>
          <div>
            <div style={{ color: BRAND.white, fontWeight: 600, fontSize: 14 }}>
              A Dubaji Ingatlanos
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: BRAND.greenOnline,
                  boxShadow: `0 0 6px ${BRAND.greenOnline}88`,
                }}
              />
              <span style={{ color: BRAND.gray, fontSize: 11 }}>Online • Válaszol perceken belül</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setChatOpen(false)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${BRAND.white}08`,
            border: `1px solid ${BRAND.darkBorder}`,
            color: BRAND.gray,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            lineHeight: "1",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = `${BRAND.white}15`)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = `${BRAND.white}08`)}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            msg={msg}
            onFormSubmit={handleFormSubmit}
            onFormSkip={handleFormSkip}
          />
        ))}
        {loading && (
          <div style={{ paddingLeft: 4 }}>
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      {messages.length <= 2 && !loading && (
        <div
          style={{
            padding: "0 16px 8px",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {quickActions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                padding: "6px 12px",
                background: `${BRAND.gold}11`,
                border: `1px solid ${BRAND.gold}33`,
                borderRadius: 20,
                color: BRAND.goldLight,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = `${BRAND.gold}22`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${BRAND.gold}55`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = `${BRAND.gold}11`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${BRAND.gold}33`;
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${BRAND.darkBorder}`,
          background: BRAND.dark,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: BRAND.darker,
            borderRadius: 12,
            border: `1px solid ${BRAND.darkBorder}`,
            padding: "4px 4px 4px 16px",
            transition: "border-color 0.2s",
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Írja ide kérdését..."
            disabled={loading}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: BRAND.white,
              fontSize: 14,
              padding: "8px 0",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background:
                input.trim() && !loading
                  ? `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldLight})`
                  : `${BRAND.white}08`,
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={input.trim() && !loading ? BRAND.darker : BRAND.gray}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 8,
            fontSize: 10,
            color: `${BRAND.gray}88`,
          }}
        >
          Powered by AI • A Dubaji Ingatlanos © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
