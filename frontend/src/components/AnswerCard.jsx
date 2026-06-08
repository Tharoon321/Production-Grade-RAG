import React from "react";
import { motion } from "framer-motion";

export default function AnswerCard({
  answer,
  citations = [],
}) {
  if (!answer) return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      whileHover={{
        scale: 1.01,
      }}
      className="glass answer-card"
    >
      <div className="answer-header">
        🤖 AI Assistant
      </div>

      <div className="answer-content">
        {answer}
      </div>

      {citations.length > 0 && (
        <div className="citations-section">
          <h3>📚 Sources</h3>

          <div className="citation-list">
            {citations.map(
              (citation, index) => (
                <span
                  key={index}
                  className="citation-chip"
                >
                  {citation}
                </span>
              )
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}