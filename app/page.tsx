"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  async function sendMessage() {
    if (!message.trim() && !image) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResponse(data.error || "Something went wrong.");
        return;
      }

      setResponse(data.response || "No response received.");
    } catch (error) {
      console.error(error);
      setResponse("Unable to connect to the chatbot.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎓</div>

          <h1 className="text-4xl font-bold">
            StudyMate AI
          </h1>

          <p className="text-slate-400 mt-2">
            Multimodal RAG Learning Assistant
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="min-h-[300px] mb-6">
            {!response && !loading && (
              <div className="text-center text-slate-500 pt-24">
                <p className="text-lg">
                  Ask me anything about your studies.
                </p>

                <p className="text-sm mt-2">
                  You can also upload an image.
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center text-slate-400 pt-24">
                Thinking...
              </div>
            )}

            {response && (
              <div className="bg-slate-800 rounded-xl p-5">
                <div className="text-sm text-slate-400 mb-2">
                  StudyMate AI
                </div>

                <p className="whitespace-pre-wrap leading-7">
                  {response}
                </p>
              </div>
            )}
          </div>

          {image && (
            <div className="mb-4">
              <img
                src={image}
                alt="Uploaded study material"
                className="max-h-64 rounded-xl mx-auto"
              />
            </div>
          )}

          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />

            <label className="bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-xl cursor-pointer">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-6 py-3 rounded-xl font-semibold"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            Powered by Groq • Multimodal AI Learning Assistant
          </div>
        </div>
      </div>
    </main>
  );
}