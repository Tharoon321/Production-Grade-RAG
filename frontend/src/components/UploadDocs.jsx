
import React, { useState } from "react";

function UploadDocs({ apiUrl }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);

    try {
      const documents = await Promise.all(
        Array.from(files).map(async (file) => {
          const text = await file.text();

          return {
            id: file.name,
            text,
            metadata: {
              source: file.name,
            },
          };
        })
      );

      const response = await fetch(
        `${apiUrl}/ingest`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            documents,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Upload failed"
        );
      }

      alert(
        "🎉 Documents uploaded successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "❌ Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    handleUpload(
      e.dataTransfer.files
    );
  };

  return (
    <div
      style={{
        marginTop: "30px",
      }}
    >
      <div
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={handleDrop}
        style={{
          border:
            "2px dashed rgba(255,255,255,0.2)",

          borderRadius: "20px",

          padding: "40px",

          textAlign: "center",

          background:
            "rgba(255,255,255,0.05)",

          backdropFilter:
            "blur(20px)",

          color: "white",

          transition:
            "all 0.3s ease",
        }}
      >
        <div
          style={{
            fontSize: "50px",
          }}
        >
          📄
        </div>

        <h2>
          Upload Documents
        </h2>

        <p
          style={{
            marginTop: "10px",
            color: "#cbd5e1",
          }}
        >
          Drag & drop files here
          or click below
        </p>

        <input
          type="file"
          multiple
          onChange={(e) =>
            handleUpload(
              e.target.files
            )
          }
          style={{
            marginTop: "20px",
            color: "white",
          }}
        />

        {uploading && (
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
              }}
            >
              🧠 Processing
              documents...
            </div>

            <div
              style={{
                marginTop: "10px",
                color: "#06b6d4",
              }}
            >
              Chunking →
              Embedding →
              Indexing
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadDocs;
