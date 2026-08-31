"use client";
import { useState } from "react";
export default function RecallIQDashboard() {
  const [activeSection, setActiveSection] = useState("youtube");

  const sidebarItems = [
    {
      id: "youtube",
      title: "YouTube URL",
      subtitle: "Analyze videos instantly",
    },
    {
      id: "video",
      title: "Upload Video",
      subtitle: "MP4, MKV, MOV",
    },
    {
      id: "audio",
      title: "Audio Files",
      subtitle: "MP3, WAV recordings",
    },
    {
      id: "documents",
      title: "Documents",
      subtitle: "PDF, DOCX, TXT",
    },
  ];

  const historyItems = [
    {
      title: "AI System Design Meeting",
      type: "YouTube",
      time: "2 hours ago",
    },
    {
      title: "Quarterly Planning Recording",
      type: "Audio",
      time: "Yesterday",
    },
    {
      title: "Research Paper Summary",
      type: "PDF",
      time: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[320px] hidden lg:flex flex-col border-r border-white/10 bg-white/[0.03] backdrop-blur-xl">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
              R
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">RecallIQ</h1>
              <p className="text-sm text-gray-400">AI Knowledge Workspace</p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-5">
            <h3 className="font-semibold text-lg leading-relaxed">
              “Turn every meeting, video & document into searchable
              intelligence.”
            </h3>
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
            Workspace
          </p>

          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left rounded-3xl p-5 transition-all duration-300 border ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600" />

                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{item.subtitle}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Recent History
            </p>

            <button className="text-sm text-blue-400 hover:text-blue-300 transition">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {historyItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">
                    {item.type}
                  </span>

                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>

                <h3 className="font-medium leading-relaxed">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 text-sm text-gray-500">
          Powered by AI semantic retrieval & RAG.
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back 👋
            </h1>
            <p className="text-gray-400 mt-1">
              Upload, summarize and chat with your knowledge.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
              Upgrade Plan
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600" />
          </div>
        </header>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-6 lg:p-10 space-y-8">
          {/* Hero Card */}
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 lg:p-12">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6">
                ✨ AI-Powered Knowledge Workspace
              </div>

              <h2 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
                Search, summarize & chat with your content.
              </h2>

              <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-2xl">
                Upload YouTube videos, meetings, PDFs, audio recordings and
                documents. RecallIQ transforms them into intelligent searchable
                conversations.
              </p>
            </div>
          </div>

          {/* Dynamic Sections */}
          <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-8">
            {/* Upload Section */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {activeSection === "youtube" && "YouTube Intelligence"}
                    {activeSection === "video" && "Upload Video"}
                    {activeSection === "audio" && "Audio Processing"}
                    {activeSection === "documents" && "Document AI"}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Process content into summaries and AI conversations.
                  </p>
                </div>
              </div>

              {activeSection === "youtube" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-3">
                      Paste YouTube URL
                    </label>

                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                      />

                      <button className="px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-[1.02] transition">
                        Analyze Video
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(activeSection === "video" ||
                activeSection === "audio" ||
                activeSection === "documents") && (
                <div className="border-2 border-dashed border-white/10 rounded-[32px] p-12 text-center hover:border-blue-500/40 transition cursor-pointer">
                  <div className="w-20 h-20 mx-auto rounded-[28px] bg-gradient-to-br from-blue-500 to-purple-600 mb-6" />

                  <h3 className="text-2xl font-semibold mb-4">
                    Drag & drop files here
                  </h3>

                  <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                    Upload videos, audio recordings or documents to generate AI
                    summaries and interactive chat experiences.
                  </p>

                  <button className="mt-8 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    Browse Files
                  </button>
                </div>
              )}
            </div>

            {/* AI Output */}
            <div className="space-y-8">
              {/* Summary */}
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">AI Summary</h2>

                  <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-300 text-sm border border-green-500/20">
                    Ready
                  </span>
                </div>

                <div className="space-y-5 text-gray-300 leading-relaxed">
                  <p>
                    The discussion focused on scaling AI meeting assistants
                    using Faster Whisper, ChromaDB and semantic retrieval
                    pipelines.
                  </p>

                  <div className="bg-black/30 border border-white/10 rounded-3xl p-5">
                    <h3 className="font-semibold text-lg mb-3">Key Insights</h3>

                    <ul className="space-y-3 text-sm text-gray-300">
                      <li>• Use vector databases for semantic retrieval</li>
                      <li>• Avoid duplicate transcription processing</li>
                      <li>• Implement reusable embeddings per source</li>
                      <li>• Use background queues for scalability</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chatbot */}
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">AI Chatbot</h2>

                  <div className="flex items-center gap-2 text-sm text-green-300">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </div>
                </div>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
                  <div className="bg-black/30 rounded-3xl p-5 border border-white/5">
                    <p className="text-sm text-gray-400 mb-2">User</p>
                    <p>What are the main action items discussed?</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-5 border border-blue-500/20">
                    <p className="text-sm text-blue-300 mb-2">RecallIQ</p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      The meeting emphasized scalable RAG pipelines, reusable
                      embeddings and asynchronous transcription workflows.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Ask anything about your content..."
                    className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                  />

                  <button className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-[1.02] transition">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
