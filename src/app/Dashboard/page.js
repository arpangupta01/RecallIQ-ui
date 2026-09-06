"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../Components/Sidebar/sidebar";
import axios from "axios";

export default function RecallIQDashboard() {
  const [activeSection, setActiveSection] = useState("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranscriptReady, setIsTranscriptReady] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedChatDate, setSelectedChatDate] = useState("today");
  const [taskname, setTaskname] = useState("");
  const [summary, setSummary] = useState([]);
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
  const [history, setHistory] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState("");
  const [chatResponse, setChatresponse] = useState([]);
  const [usermessage, setUserMessage] = useState("");
  const [aimessage, setAimessage] = useState("");

  const chat_llm = async (event) => {
    event?.preventDefault();

    if (!usermessage.trim()) return;

    setChatresponse((prev) => [
      ...prev,
      {
        usermessage: usermessage,
        aimessage: null,
      },
    ]);

    try {
      const response = await api.post("/chatbot", {
        user_id: user?.id,
        url_id: selectedUrlId || youtubeUrl,
        conversation: usermessage,
      });
      const message = response.data?.message;
      const assistantMessage = Array.isArray(message)
        ? message
            .filter((item) => item.type === "text")
            .map((item) => item.text)
            .join("\n")
        : message;

      // Add AI response to the latest message
      setChatresponse((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          aimessage: assistantMessage || "No response received.",
        };

        return updated;
      });
    } catch (error) {
      setChatresponse((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          aimessage: "Sorry, I couldn't get a response right now.",
        };
        return updated;
      });
    }

    setUserMessage("");
  };
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
      if (user == null || user.id == null) return;
      if (taskname == null || taskname == "") return;
      setSelectedUrlId(youtubeUrl);
      const response = await api.post("api/process_youtube_audio", {
        url: youtubeUrl,
        userId: user?.id || null,
        taskname: taskname,
      });
      response.data;
      const taskId = response?.data?.jobId;
      ("Task ID:", taskId);
      // setTranscriptData()
      setIsTranscriptReady(true);
      response?.data?.transcript?.segments;
      setSummary(response?.data?.summary);

      setTranscriptData(response?.data?.transcript?.segments);

      // const socket = new WebSocket(
      //   `ws://127.0.0.1:8000/ws/${response?.data?.jobId}`,
      // );
      // ("WebSocket connection established. ", { socket });
      // socket.onopen = () => {
      //   ("WebSocket connection established.");
      //   // You can send messages to the server here if needed
      // };
      // socket.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   (data);
      // };

      // socket.onclose = () => {
      //   ("Disconnected");
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

  const handleHistorySelect = (item) => {
    const sourceId = item.url_id ?? item.youtubeUrl ?? item.url ?? "";
    const transcript = item.transcript?.segments ?? item.transcript ?? [];
    const itemSummary = item.summary ?? [];

    setSelectedUrlId(sourceId);
    setTranscriptData(Array.isArray(transcript) ? transcript : []);
    setSummary(Array.isArray(itemSummary) ? itemSummary : [itemSummary]);
    setIsTranscriptReady(transcript.length > 0);
    setChatresponse([]);
  };

  useEffect(() => {
    try {
      const get_history = async () => {
        if (user?.id == null || user == null) {
          console.log("user not found");
          return;
        }
        const response = await api.get(`/get-history/${user.id}`);
        setHistory(response?.data?.data);
      };
      get_history();
    } catch (e) {
      ("Error is ", e);
    }
  }, [user]);
  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const timeAgo = (pastTime) => {
    const past = new Date(pastTime);
    const now = new Date();

    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }

    const minutes = Math.floor(diffInSeconds / 60);

    if (minutes < 60) {
      return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return hours === 1 ? "1 hr ago" : `${hours} hrs ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }

    const years = Math.floor(days / 365);

    return years === 1 ? "1 year ago" : `${years} years ago`;
  };

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
        <Sidebar
          setActive={setActiveSection}
          activeSection={activeSection}
        ></Sidebar>

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
            {history?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleHistorySelect(item)}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">
                    {item.taskname}
                  </span>
                </div>

                <h3 className="font-medium leading-relaxed">
                  {timeAgo(item.createdAt)}
                </h3>
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

          <div className="flex items-center gap-3">
            {user && (
              <>
                {/* Username */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-1 text-white text-sm font-medium text-center leading-5">
                  <span>
                    {user.first_name?.split(" ")[0]}
                    <br />
                    {user.last_name?.split(" ")[0] || ""}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl border border-red-500/20 
                   bg-red-500/10 text-red-400 
                   hover:bg-red-500/20 hover:text-red-300 
                   transition-all duration-200"
                >
                  Logout
                </button>
              </>
            )}
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
                  <div className=" flex flex-col gap-4">
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
                    </div>
                    <label className="block text-sm text-gray-300 mb-3">
                      Task name
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        value={taskname}
                        onChange={(e) => setTaskname(e.target.value)}
                        type="text"
                        placeholder="Python Summary ..."
                        className="flex-1 min-w-0 bg-black/30 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                      />
                      <button
                        onClick={handleYoutubeUrlChange}
                        disabled={
                          isProcessing || !taskname.trim() || !youtubeUrl.trim()
                        }
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
                                {segment.start}s
                              </span>
                            </div>

                            {/* Transcript */}
                            <div className="min-w-0 flex-1">
                              <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                                {segment.end}
                              </p>

                              <p className="text-xs text-gray-500 mt-2">
                                {segment.text}
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

            <div className="space-y-8 scroll-auto">
              {/* AI Summary */}
              {/* <div className="bg-white/5 border border-white/10 rounded-[32px] lg:rounded-[40px] p-5 sm:p-6 lg:p-8 backdrop-blur-xl min-w-0">
                
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">AI Summary</h2>

                  <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-300 text-sm border border-green-500/20">
                    Ready
                  </span>
                </div>

                
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
              </div>*/}
              <div className="bg-white/5 border border-white/10 rounded-[32px] lg:rounded-[40px] p-5 sm:p-6 lg:p-8 backdrop-blur-xl min-w-0">
                {/* Fixed Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">AI Summary</h2>

                  <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-300 text-sm border border-green-500/20">
                    Ready
                  </span>
                </div>

                {/* Only Content Scrolls */}
                <div className="h-[400px] overflow-y-auto hide-scrollbar pr-1">
                  <div className="space-y-6 text-gray-300 leading-relaxed break-words">
                    {summary.length === 0 && (
                      <p className="text-gray-500">No summary available yet.</p>
                    )}

                    {summary.map((summaryItem, summaryIndex) => (
                      <div
                        key={summaryItem.title || summaryIndex}
                        className="space-y-6"
                      >
                        {summaryItem.title && (
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                              Title
                            </h3>
                            <p className="text-gray-300">{summaryItem.title}</p>
                          </div>
                        )}

                        {summaryItem.overview && (
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                              Overview
                            </h3>
                            <p className="text-gray-300">
                              {summaryItem.overview}
                            </p>
                          </div>
                        )}

                        {summaryItem.sections?.map((section, sectionIndex) => (
                          <div
                            key={section.heading || sectionIndex}
                            className="bg-black/30 border border-white/10 rounded-3xl p-5"
                          >
                            <h3 className="font-semibold text-lg text-white mb-4">
                              {section.heading}
                            </h3>

                            {section.points?.length > 0 && (
                              <ul className="space-y-3 text-sm text-gray-300">
                                {section.points.map((point, pointIndex) => (
                                  <li
                                    key={pointIndex}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="text-blue-400 mt-1">
                                      •
                                    </span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {section.subsections?.map(
                              (subsection, subIndex) => (
                                <div
                                  key={subsection.heading || subIndex}
                                  className="mt-5 pt-4 border-t border-white/10"
                                >
                                  <h4 className="font-medium text-base text-gray-200 mb-3">
                                    {subsection.heading}
                                  </h4>

                                  <ul className="space-y-3 text-sm text-gray-400">
                                    {subsection.points?.map(
                                      (point, pointIndex) => (
                                        <li
                                          key={pointIndex}
                                          className="flex items-start gap-3"
                                        >
                                          <span className="text-purple-400 mt-1">
                                            •
                                          </span>
                                          <span>{point}</span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              ),
                            )}
                          </div>
                        ))}

                        {summaryItem.key_takeaways?.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-5">
                            <h3 className="font-semibold text-lg text-white mb-4">
                              Key Takeaways
                            </h3>

                            <ul className="space-y-3 text-sm text-gray-300">
                              {summaryItem.key_takeaways.map(
                                (takeaway, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-semibold">
                                      {index + 1}
                                    </span>
                                    <span className="pt-0.5">{takeaway}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
                    {chatResponse.map((value, index) => (
                      <div key={index}>
                        <div className="space-y-4">
                          <div className="bg-black/30 rounded-3xl p-5 border border-white/5">
                            <p className="text-sm text-gray-400 mb-2">
                              User
                            </p>

                            <p>{value.usermessage}</p>
                          </div>

                          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-5 border border-blue-500/20">
                            <p className="text-sm text-blue-300 mb-2">
                              RecallIQ
                            </p>

                            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                              {value.aimessage || "Thinking..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input - fixed */}
                <form onSubmit={chat_llm} className="flex gap-2 sm:gap-3 mt-6">
                  <input onChange={(e)=>setUserMessage(e.target.value)}
                    value={usermessage}
                    type="text"
                    placeholder="Ask anything about your content..."
                    className="min-w-0 flex-1 bg-black/30 border border-white/10 rounded-2xl px-4 sm:px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                  />

                  <button type="submit" className="flex-shrink-0 px-5 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-[1.02] transition">
                    Send
                  </button>
                </form>
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
