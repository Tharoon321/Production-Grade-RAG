import React from "react";

export default function SourceCard({ citations = [] }) {
  if (citations.length === 0) {
    return (
      <div
        className="glass"
        style={{
          marginTop: "20px",
          padding: "24px",
          borderRadius: "20px",
          background:
            "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          border:
            "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h3
          style={{
            color: "white",
            marginBottom: "10px",
          }}
        >
          📚 Sources
        </h3>

        <p
          style={{
            color: "#cbd5e1",
          }}
        >
          No citations available.
        </p>
      </div>
    );
  }

  return (
    <div
      className="glass"
      style={{
        marginTop: "20px",
        padding: "24px",
        borderRadius: "20px",
        background:
          "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        border:
          "1px solid rgba(255,255,255,0.1)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      <h3
        style={{
          color: "white",
          marginBottom: "20px",
          fontSize: "22px",
        }}
      >
        📚 Sources Used
      </h3>

      {citations.map((source, index) => (
        <div
          key={source}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px",
            marginBottom: "12px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))",
            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background:
                "linear-gradient(135deg,#8b5cf6,#06b6d4)",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {index + 1}
          </div>

          <div
            style={{
              color: "white",
              fontSize: "15px",
              wordBreak: "break-word",
            }}
          >
            📄 {source}
          </div>
        </div>
      ))}
    </div>
  );
}