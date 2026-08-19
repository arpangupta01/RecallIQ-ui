"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";

export default function RecallIQDashboard() {
  const [activeSection, setActiveSection] = useState("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranscriptReady, setIsTranscriptReady] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedChatDate, setSelectedChatDate] = useState("today");
  const [processingQuote, setProcessingQuote] = useState(
    "Teaching the AI where the coffee machine is... ☕",
  );
  const [transcriptData, setTranscriptData] = useState([]);
  const processingQuotes = [
    "Teaching the AI where the coffee machine is... ☕",
    "Convincing the transcript to behave itself... 🤖",
    "Turning audio waves into actual words... 🎧",
    "Making sense of all those 'ummms'... 😄",
    "AI is listening very carefully... 👂",
    "Almost there... the neurons are warming up! 🧠",
  ];

  // const transcriptData = [
  //   {
  //     text: "नमस्कार स्वागत है आप सभी का मार्केटनामा",
  //     start: 2.159,
  //     duration: 7.121,
  //   },
  //   {
  //     text: "में। मैं हूं सुमित और हफ्ते का ये जो",
  //     start: 5.44,
  //     duration: 7.119,
  //   },
  //   {
  //     text: "कारोबारी सत्र था तीसरा कारोबारी सत्र",
  //     start: 9.28,
  //     duration: 5.6,
  //   },
  //   {
  //     text: "इसकी अगर बात तो एक ठीक-ठाक सा सेशन वो",
  //     start: 12.559,
  //     duration: 3.761,
  //   },
  //   {
  //     text: "थोड़ा ऑडियो का इशू आ रहा होगा अब ठीक हो",
  //     start: 14.88,
  //     duration: 4.08,
  //   },
  //   {
  //     text: "गया होगा। सो हफ्ते का तीसरा कारोबारी",
  //     start: 16.32,
  //     duration: 5.68,
  //   },
  //   {
  //     text: "सत्र और ठीक-ठाक सेशन था। आईटी थोड़ा बहुत",
  //     start: 18.96,
  //     duration: 6.319,
  //   },
  //   {
  //     text: "बाइंग साइड पे था और बैंक्स थोड़ा बहुत",
  //     start: 22.0,
  //     duration: 5.68,
  //   },
  //   {
  //     text: "प्रेशर साइड पे कामकाज कर रहे थे। एडवांस",
  //     start: 25.279,
  //     duration: 4.08,
  //   },
  //   {
  //     text: "डिक्लाइन में डिक्लाइन के फेवर में बाजार",
  //     start: 27.68,
  //     duration: 4.16,
  //   },
  //   {
  //     text: "था। एडवांसेस में कुछ खास एक्शन था नहीं।",
  //     start: 29.359,
  //     duration: 4.961,
  //   },
  //   {
  //     text: "बाकी छोटा-छोटा स्टॉक स्पेसिफिक स्टोरी",
  //     start: 31.84,
  //     duration: 4.16,
  //   },
  //   {
  //     text: "मार्केट में बनते हुए दिखाई पड़ रही है।",
  //     start: 34.32,
  //     duration: 4.72,
  //   },
  //   {
  //     text: "आज भी शुगर का दिन था। वही अगेन अब सब तरफ",
  //     start: 36.0,
  //     duration: 4.48,
  //   },
  //   {
  //     text: "सुनने को मिल रहा है। इनफैक्ट आज दोस्त का",
  //     start: 39.04,
  //     duration: 3.76,
  //   },
  // ];

  const languages = [
    "English",
    "Hindi",
    "Hinglish",
    "Bengali",
    "Tamil",
    "Telugu",
  ];
  const { user, loading, setUser, fetchUser, initialized } =
    useContext(AuthContext);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      const refreshToken = localStorage.getItem("refresh_token");
      console.log(refreshToken);

      if (refreshToken) {
        // Optionally, you can verify the refresh token with the server here
        const verifyRefreshToken = async () => {
          try {
            const response = await api.post("/auth/refresh", {
              refresh_token: refreshToken,
            });
            console.log(response?.data?.access_token);

            // localStorage.setItem("token", response?.data.data.access_token);
            // localStorage.setItem("refresh_token", response?.data.data.refresh_token);
          } catch (error) {
            console.error("Refresh token verification failed:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            router.push("/");
          }
        };
        verifyRefreshToken();
      }
    }
  }, []);
  const handleYoutubeUrlChange = async () => {
    setIsProcessing(true);
    setIsTranscriptReady(false);
    let quoteIndex = 0;
    const quoteInterval = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % processingQuotes.length;
      setProcessingQuote(processingQuotes[quoteIndex]);
    }, 2200);
    try {
      const response = await api.post("api/process_youtube_audio", {
        url: youtubeUrl,
        userId: user?.id || null,
      });
      console.log(response.data);
      const taskId = response?.data?.jobId;
      console.log("Task ID:", taskId);
      // setTranscriptData()
      setIsTranscriptReady(true);
      console.log(response?.data?.transcript?.snippets);

      setTranscriptData(response?.data?.transcript?.snippets);

      // const socket = new WebSocket(
      //   `ws://127.0.0.1:8000/ws/${response?.data?.jobId}`,
      // );
      // console.log("WebSocket connection established. ", { socket });
      // socket.onopen = () => {
      //   console.log("WebSocket connection established.");
      //   // You can send messages to the server here if needed
      // };
      // socket.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   console.log(data);
      // };

      // socket.onclose = () => {
      //   console.log("Disconnected");
      // };

      // socket.onerror = (error) => {
      //   console.error(error);
      // };
    } catch (e) {
      console.error("Video Processing failed:", e);
    } finally {
      clearInterval(quoteInterval);
      setIsProcessing(false);
    }
  };
  const chatDates = Array.from({ length: 11 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);

    return {
      value: date.toISOString().split("T")[0],
      label:
        index === 0
          ? "Today"
          : index === 1
            ? "Yesterday"
            : date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              }),
    };
  });

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
    <div className="min-h-screen bg-[#070B14] text-white flex">
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
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="border-b border-white/10 bg-white/[0.03] backdrop-blur-xl px-5 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <div className="p-5 sm:p-6 lg:p-10 space-y-8">
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
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] gap-6 lg:gap-8">
            {/* Upload Section */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] lg:rounded-[40px] p-5 sm:p-6 lg:p-8 backdrop-blur-xl min-w-0">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {activeSection === "youtube" && "YouTube Intelligence"}
                    {activeSection === "video" && "Upload Video"}
                    {activeSection === "audio" && "Audio Processing"}
                    {activeSection === "documents" && "Document AI"}
                  </h1>

                  <p className="text-gray-400 mt-2">
                    Process content into summaries and AI conversations.
                  </p>
                </div>
              </div>

              {activeSection === "youtube" && (
                <div className="space-y-6">
                  {/* YouTube URL */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-3">
                      Paste YouTube URL
                    </label>

                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 min-w-0 bg-black/30 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                      />

                      <button
                        onClick={handleYoutubeUrlChange}
                        disabled={isProcessing || !youtubeUrl.trim()}
                        className="w-full md:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isProcessing ? "Processing..." : "Analyze Video"}
                      </button>
                    </div>
                  </div>

                  {/* Transcript */}
                  {isTranscriptReady && (
                    <div className="mt-8 rounded-[32px] border border-white/10 bg-black/20 overflow-hidden">
                      {/* Transcript Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold">Transcript</h3>

                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-xs border border-green-500/20">
                              Ready
                            </span>
                          </div>

                          <p className="text-sm text-gray-500 mt-1">
                            Generated transcript from your video
                          </p>
                        </div>

                        {/* Language Dropdown */}
                        <div className="relative">
                          <select
                            value={selectedLanguage}
                            onChange={(e) =>
                              setSelectedLanguage(e.target.value)
                            }
                            className="appearance-none w-full sm:w-[150px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          >
                            {languages.map((language) => (
                              <option
                                key={language}
                                value={language}
                                className="bg-[#11151F]"
                              >
                                {language}
                              </option>
                            ))}
                          </select>

                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            ▼
                          </span>
                        </div>
                      </div>

                      {/* Transcript Content */}
                      <div className="max-h-[500px] overflow-y-auto hide-scrollbar p-4 sm:p-6 space-y-3">
                        {transcriptData?.map((segment, index) => (
                          <div
                            key={index}
                            className="group flex gap-4 rounded-2xl p-4 hover:bg-white/5 transition"
                          >
                            {/* Timestamp */}
                            <div className="flex-shrink-0 pt-1">
                              <span className="inline-flex px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
                                {segment.start.toFixed(2)}s
                              </span>
                            </div>

                            {/* Transcript */}
                            <div className="min-w-0 flex-1">
                              <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                                {segment.text}
                              </p>

                              <p className="text-xs text-gray-500 mt-2">
                                Duration: {segment.duration.toFixed(2)}s
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
            <div className="space-y-8 scroll-auto">
              {/* AI Summary */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] lg:rounded-[40px] p-5 sm:p-6 lg:p-8 backdrop-blur-xl min-w-0">
                {/* Fixed header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">AI Summary</h2>

                  <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-300 text-sm border border-green-500/20">
                    Ready
                  </span>
                </div>

                {/* ONLY CONTENT SCROLLS */}
                <div className="h-[400px] overflow-y-auto hide-scrollbar pr-1">
                  <div className="space-y-5 text-gray-300 leading-relaxed break-words">
                    <p>
                      The discussion focused on scaling AI meeting assistants
                      using Faster Whisper, ChromaDB and semantic retrieval
                      pipelines.
                    </p>

                    <div className="bg-black/30 border border-white/10 rounded-3xl p-5">
                      <h3 className="font-semibold text-lg mb-3">
                        Key Insights
                      </h3>

                      <ul className="space-y-3 text-sm text-gray-300">
                        <li>• Use vector databases for semantic retrieval</li>
                        <li>• Avoid duplicate transcription processing</li>
                        <li>• Implement reusable embeddings per source</li>
                        <li>• Use background queues for scalability</li>
                      </ul>
                    </div>

                    <div className="bg-black/30 border border-white/10 rounded-3xl p-5">
                      <h3 className="font-semibold text-lg mb-3">
                        Performance
                      </h3>

                      <ul className="space-y-3 text-sm text-gray-300">
                        <li>• Faster Whisper for transcription</li>
                        <li>• ChromaDB for semantic retrieval</li>
                        <li>• Cached embeddings for repeated queries</li>
                        <li>• Async processing for long videos</li>
                      </ul>
                    </div>

                    <div className="bg-black/30 border border-white/10 rounded-3xl p-5">
                      <h3 className="font-semibold text-lg mb-3">
                        Action Items
                      </h3>

                      <ul className="space-y-3 text-sm text-gray-300">
                        <li>• Implement background processing</li>
                        <li>• Store transcript segments</li>
                        <li>• Generate reusable embeddings</li>
                        <li>• Enable semantic chat over content</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chatbot */}
              {/* AI Chatbot */}
              <div className="bg-white/5 border border-white/10 rounded-[32px] lg:rounded-[40px] p-5 sm:p-6 lg:p-8 backdrop-blur-xl min-w-0">
                {/* Header - fixed */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">AI Chatbot</h2>

                    <div className="flex items-center gap-2 text-sm text-green-300">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Online
                    </div>
                  </div>

                  {/* Chat Date */}
                  <div className="relative">
                    <select
                      value={selectedChatDate}
                      onChange={(e) => setSelectedChatDate(e.target.value)}
                      className="appearance-none w-full sm:w-[145px] bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {chatDates.map((date) => (
                        <option
                          key={date.value}
                          value={date.value}
                          className="bg-[#11151F]"
                        >
                          {date.label}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* ONLY CHAT MESSAGES SCROLL */}
                <div className="h-[280px] overflow-y-auto hide-scrollbar pr-1 sm:pr-2">
                  <div className="space-y-4">
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

                    <div className="bg-black/30 rounded-3xl p-5 border border-white/5">
                      <p className="text-sm text-gray-400 mb-2">User</p>

                      <p>How can we improve the transcription pipeline?</p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-5 border border-blue-500/20">
                      <p className="text-sm text-blue-300 mb-2">RecallIQ</p>

                      <p className="text-sm text-gray-200 leading-relaxed">
                        Use asynchronous processing, cache completed transcripts
                        and reuse embeddings for repeated queries.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input - fixed */}
                <div className="flex gap-2 sm:gap-3 mt-6">
                  <input
                    type="text"
                    placeholder="Ask anything about your content..."
                    className="min-w-0 flex-1 bg-black/30 border border-white/10 rounded-2xl px-4 sm:px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                  />

                  <button className="flex-shrink-0 px-5 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-[1.02] transition">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#02040A]/80 backdrop-blur-md" />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-[36px] border border-white/10 bg-[#11151F]/95 shadow-2xl shadow-blue-500/10 p-8 text-center">
            {/* Glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              {/* Animated Loader */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin [mask-image:linear-gradient(transparent,black)]" />

                <div className="absolute inset-2 rounded-full bg-[#11151F] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3">Processing your video</h2>

              <p className="text-gray-400 leading-relaxed mb-6">
                Please wait while RecallIQ extracts the audio, generates the
                transcript and prepares your AI knowledge.
              </p>

              {/* Funny quote */}
              <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-5 py-4">
                <p className="text-sm text-gray-300 italic">
                  "{processingQuote}"
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-7">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
