
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SearchBar({
  onAsk,
  loading = false,
}) {
  const [question, setQuestion] =
    useState("");

  const handleAsk = () => {
    if (
      !question.trim() ||
      loading
    ) {
      return;
    }

    onAsk(question);
    setQuestion("");
  };

  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="glass"
        style={{
          display: "flex",
          gap: "12px",
          padding: "12px",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Ask anything about your documents..."
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              handleAsk();
            }
          }}
          disabled={loading}
          style={{
            flex: 1,
            padding: "18px",
            borderRadius: "16px",
            border:
              "1px solid rgba(255,255,255,0.15)",

            fontSize: "16px",

            outline: "none",

            background:
              "rgba(255,255,255,0.08)",

            color: "white",
          }}
        />

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={handleAsk}
          disabled={loading}
          style={{
            background:
              "linear-gradient(135deg,#8b5cf6,#06b6d4)",

            border: "none",

            color: "white",

            padding:
              "18px 28px",

            borderRadius:
              "16px",

            cursor:
              loading
                ? "not-allowed"
                : "pointer",

            fontSize: "16px",

            fontWeight: "600",

            opacity:
              loading
                ? 0.6
                : 1,
          }}
        >
          {loading
            ? "🧠 Thinking..."
            : "🚀 Ask AI"}
        </motion.button>
      </motion.div>
    </div>
  );
}
