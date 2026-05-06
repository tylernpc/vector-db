"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [docContent, setDocContent] = useState("");
  const [docSource, setDocSource] = useState("");
  const [docSaving, setDocSaving] = useState(false);
  const [docStatus, setDocStatus] = useState(null);

  async function handleDocSave(e) {
    e.preventDefault();
    if (!docContent.trim()) {
      return;
    }

    setDocSaving(true);
    setDocStatus(null);

    try {
      const metadata = docSource.trim() ? { source: docSource.trim() } : {};
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: docContent, metadata }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setDocStatus({ ok: true, message: `Saved — document ID: ${data.id}` });
      setDocContent("");
      setDocSource("");
    } catch (err) {
      setDocStatus({ ok: false, message: err.message });
    } finally {
      setDocSaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/summarization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 gap-4">
        <h1 className="text-5xl font-bold tracking-tight">Summarization API</h1>
        <p className="text-lg max-w-xl opacity-70">
          A lightweight endpoint powered by GPT-4o-mini. Send any text and get a
          concise, intelligent response back in milliseconds.
        </p>
        <a
          href="#demo"
          className="mt-4 px-6 py-3 rounded-lg bg-foreground text-background font-semibold hover:opacity-80 transition-opacity"
        >
          Try it live
        </a>
      </section>

      {/* API Reference */}
      <section className="px-6 py-16 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-6">API Reference</h2>
        <div className="rounded-xl border border-current/10 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-current/10">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">
              POST
            </span>
            <code className="font-mono text-sm">/api/summarization</code>
          </div>

          <div className="px-5 py-4 grid gap-6 text-sm">
            <div>
              <p className="font-semibold mb-2 opacity-60 uppercase text-xs tracking-wide">
                Request body
              </p>
              <pre className="rounded-lg bg-current/5 p-4 overflow-x-auto font-mono">{`{
  "message": "string"   // required — the text to process
}`}</pre>
            </div>

            <div>
              <p className="font-semibold mb-2 opacity-60 uppercase text-xs tracking-wide">
                Response
              </p>
              <pre className="rounded-lg bg-current/5 p-4 overflow-x-auto font-mono">{`// 200 OK
{ "result": "string" }

// 400 Bad Request
{ "error": "message is required" }

// 500 Internal Server Error
{ "error": "string" }`}</pre>
            </div>

            <div>
              <p className="font-semibold mb-2 opacity-60 uppercase text-xs tracking-wide">
                Example (curl)
              </p>
              <pre className="rounded-lg bg-current/5 p-4 overflow-x-auto font-mono">{`curl -X POST /api/summarization \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Summarize the history of the internet."}'`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="px-6 py-16 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-6">Live Demo</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message or paste text to summarize..."
            rows={5}
            className="w-full rounded-xl border border-current/20 bg-current/5 px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-current/30"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="self-start px-6 py-3 rounded-lg bg-foreground text-background font-semibold disabled:opacity-40 hover:opacity-80 transition-opacity"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 rounded-xl border border-current/10 bg-current/5 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-50 mb-3">
              Response
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </p>
          </div>
        )}
      </section>

      {/* Save Document */}
      <section className="px-6 py-16 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-2">Save Document</h2>
        <p className="text-sm opacity-60 mb-6">
          Embeds text via OpenAI and stores it in the vector database.
        </p>
        <form onSubmit={handleDocSave} className="flex flex-col gap-4">
          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            placeholder="Paste or type the content to embed..."
            rows={6}
            className="w-full rounded-xl border border-current/20 bg-current/5 px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-current/30"
          />
          <input
            type="text"
            value={docSource}
            onChange={(e) => setDocSource(e.target.value)}
            placeholder="Source label (optional) — e.g. docs/intro.md"
            className="w-full rounded-xl border border-current/20 bg-current/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-current/30"
          />
          <button
            type="submit"
            disabled={docSaving || !docContent.trim()}
            className="self-start px-6 py-3 rounded-lg bg-foreground text-background font-semibold disabled:opacity-40 hover:opacity-80 transition-opacity"
          >
            {docSaving ? "Embedding..." : "Save to DB"}
          </button>
        </form>

        {docStatus && (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
              docStatus.ok
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {docStatus.message}
          </div>
        )}
      </section>

      <footer className="mt-auto px-6 py-8 text-center text-xs opacity-40">
        Summarization API &mdash; powered by GPT-4o-mini
      </footer>
    </main>
  );
}
