import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import SearchBar from "../components/SearchBar";
import UploadDocs from "../components/UploadDocs";

import "../styles.css";

export default function Home() {

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  const handleAsk = async (
    question
  ) => {

    setLoading(true);

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    try {

      const response =
        await fetch(
          "http://127.0.0.1:8000/ask",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              question,
              top_k: 5,
            }),
          }
        );

      const data =
        await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer,
          citations:
            data.citations || [],
        },
      ]);

    } catch (error) {

      console.error(error);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not find relevant information in the uploaded documents.",
        },
      ]);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="app">

      <div className="dashboard">

        {/* LEFT SIDEBAR */}

        <div
          className="glass sidebar"
        >

          <h2>
            📄 Documents
          </h2>

          <p
            style={{
              color:"#cbd5e1",
              marginTop:"10px",
              marginBottom:"20px",
            }}
          >
            Upload files to build
            your knowledge base.
          </p>

          <UploadDocs
            apiUrl="http://127.0.0.1:8000"
          />

        </div>

        {/* CHAT AREA */}

        <div
          className="glass chat-panel"
        >

          <div
            style={{
              marginBottom:"20px",
            }}
          >

            <h1
              style={{
                fontSize:"3rem",
                fontWeight:"800",
                background:
                  "linear-gradient(90deg,#8b5cf6,#06b6d4)",

                WebkitBackgroundClip:
                  "text",

                WebkitTextFillColor:
                  "transparent",
              }}
            >
              🤖 Ask My Docs
            </h1>

          </div>

          <div
            className="chat-content"
          >

            {
              messages.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={index}
                    style={{
                      display:"flex",

                      justifyContent:
                        msg.role ===
                        "user"
                          ? "flex-end"
                          : "flex-start",

                      marginBottom:
                        "20px",
                    }}
                  >

                    <div
                      className="glass"
                      style={{
                        maxWidth:"75%",

                        padding:"18px",

                        borderRadius:
                          "20px",

                        background:
                          msg.role ===
                          "user"
                            ? "linear-gradient(135deg,#8b5cf6,#06b6d4)"
                            : "rgba(255,255,255,0.08)",
                      }}
                    >

                      <div
                        style={{
                          fontWeight:
                            "bold",

                          marginBottom:
                            "8px",
                        }}
                      >
                        {
                          msg.role ===
                          "user"
                            ? "🧑 You"
                            : "🤖 AI"
                        }
                      </div>

                      <div>
                        {
                          msg.content
                        }
                      </div>

                      {
                        msg.citations &&
                        msg.citations
                          .length >
                          0 && (

                          <div
                            style={{
                              marginTop:
                                "15px",

                              display:
                                "flex",

                              gap:"8px",

                              flexWrap:
                                "wrap",
                            }}
                          >

                            {
                              msg.citations.map(
                                (
                                  citation,
                                  i
                                ) => (
                                  <span
                                    key={
                                      i
                                    }
                                    className="citation-chip"
                                  >
                                    {
                                      citation
                                    }
                                  </span>
                                )
                              )
                            }

                          </div>
                        )
                      }

                    </div>

                  </div>
                )
              )
            }

            {
              loading && (

                <div
                  className="glass"
                  style={{
                    padding:"20px",
                    width:"250px",
                  }}
                >
                  🧠 Searching
                  documents...
                </div>

              )
            }

            <div
              ref={bottomRef}
            />

          </div>

          <SearchBar
            onAsk={handleAsk}
          />

        </div>

      </div>

    </div>

  );
}