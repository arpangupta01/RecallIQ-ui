"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
export default function RecallIQHomepage() {
  const [showLogin, setShowLogin] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupStep, setSignupStep] = useState("signup");

  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const twoFactorRef = useRef(null);
  const email2FARef = useRef(null);
  const phone2FARef = useRef(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/Dashboard");
    }
    else {
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
            console.log("token ");
            
            localStorage.setItem("token", response?.data?.access_token);
            router.push("/Dashboard");
            // localStorage.setItem("refresh_token", response?.data.data.refresh_token);
          }
          catch (error) {
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
  const UserLogin = async (e) => {
    e.preventDefault();
    try {
      const LoginData = {
        email: email || emailRef?.current?.value,
        password: password || passwordRef?.current?.value,
      };
      console.log(LoginData);
      const response = await api.post("/auth/login", LoginData);

      console.log(response.data);
      localStorage.setItem("token", response?.data.data.access_token);
      localStorage.setItem("refresh_token", response?.data.data.refresh_token);
      router.push("/Dashboard");

    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const handleSubmit = async (e) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    e.preventDefault();
    try {
      const formData = {
        first_name: firstname || firstNameRef?.current?.value,
        last_name: lastname || lastNameRef?.current?.value,
        email: email || emailRef?.current?.value,
        password: password || passwordRef?.current?.value,
        two_factor_enabled: twoFactorRef?.current?.checked || false,
        email_verified: email2FARef?.current?.checked || false,
        phone_verified: phone2FARef?.current?.checked || false,
      };
      console.log(formData);

      const response = await api.post("/auth/register", formData);
      console.log(response);
      setSignupStep("onboarding");
      setShowSignup(false);
    } catch (err) {
      console.log(err);
    }

    // console.log(formData);
  };
  return (
    <>
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        {/* Navbar */}
        <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
                R
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">RecallIQ</h1>
                <p className="text-xs text-gray-400">AI Knowledge Workspace</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
              <a href="#features" className="hover:text-white transition">
                Features
              </a>
              <a href="#workflow" className="hover:text-white transition">
                Workflow
              </a>
              <a href="#pricing" className="hover:text-white transition">
                Pricing
              </a>
              <a href="#faq" className="hover:text-white transition">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogin(true)}
                className="hidden md:block px-5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowSignup(true);
                  setSignupStep("signup");
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition font-medium shadow-lg shadow-blue-500/30"
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Meetings & Document Intelligence
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Chat with
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                meetings, videos & documents
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-400 max-w-2xl leading-relaxed">
              Upload YouTube videos, PDFs, audio recordings, or documents.
              RecallIQ transcribes, summarizes, and builds an AI-powered
              knowledge assistant instantly.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setShowSignup(true);
                  setSignupStep("signup");
                }}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-semibold hover:scale-105 transition shadow-xl shadow-blue-500/20"
              >
                Start Free
              </button>

              <button className="px-7 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-lg">
                Watch Demo
              </button>
            </div>

            {/* Input Preview */}
            <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-2xl shadow-black/30">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                  YouTube
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                  PDF
                </span>
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm">
                  Audio
                </span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                  Video
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Paste YouTube URL or upload files..."
                  className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-500"
                />

                <button className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-medium hover:scale-105 transition">
                  Analyze
                </button>
              </div>
            </div>
          </div>

          {/* AI Chat Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />

            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">AI Workspace</h3>
                  <p className="text-sm text-gray-400">Semantic Search + RAG</p>
                </div>

                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                  <p className="text-sm text-gray-400 mb-2">User</p>
                  <p>Summarize the meeting and extract action items.</p>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-500/20">
                  <p className="text-sm text-blue-300 mb-2">RecallIQ</p>
                  <ul className="space-y-2 text-gray-200 text-sm leading-relaxed">
                    <li>• API integration deadline moved to Friday</li>
                    <li>• Frontend team will finalize dashboard UI</li>
                    <li>• Action Item: Deploy staging server</li>
                    <li>• Action Item: Review authentication flow</li>
                  </ul>
                </div>

                <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                  <p className="text-sm text-gray-400 mb-2">User</p>
                  <p>What did they discuss about vector databases?</p>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-500/20">
                  <p className="text-sm text-blue-300 mb-2">RecallIQ</p>
                  <p className="text-sm leading-relaxed text-gray-200">
                    The team compared ChromaDB and Qdrant. ChromaDB was selected
                    for MVP development while Qdrant was recommended for
                    production scalability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="relative z-10 max-w-7xl mx-auto px-6 py-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything in one AI workspace
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
              Built for meetings, videos, documents, and intelligent knowledge
              retrieval.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "YouTube Intelligence",
                desc: "Paste any YouTube URL and instantly chat with the content.",
              },
              {
                title: "Document AI",
                desc: "Upload PDFs, DOCX, and notes for summaries and Q&A.",
              },
              {
                title: "Semantic Search",
                desc: "Powered by vector embeddings and Retrieval-Augmented Generation.",
              },
              {
                title: "Meeting Assistant",
                desc: "Generate action items, summaries, and insights automatically.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-5" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section
          id="workflow"
          className="relative z-10 py-24 border-t border-white/10 bg-white/[0.02]"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">How it works</h2>
              <p className="mt-4 text-gray-400 text-lg">
                From upload to AI-powered answers in seconds.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                "Upload Video or Document",
                "AI Transcription & Processing",
                "Embeddings + Vector Search",
                "Chat with Your Content",
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="relative bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold mb-5">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{step}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 rounded-[40px] p-12 text-center backdrop-blur-xl">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Build your AI-powered knowledge workspace
            </h2>

            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
              Upload meetings, videos, and documents. Let RecallIQ turn them
              into searchable intelligence.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-semibold hover:scale-105 transition">
                Start Free
              </button>

              <button className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-lg">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Signup Modal */}
        {showSignup && (
          <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6 overflow-y-auto hide-scrollbar">
            <div className="relative w-full max-w-lg bg-[#111827]/95 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 animate-in fade-in zoom-in duration-300 overflow-hidden max-h-[95vh] overflow-y-auto hide-scrollbar">
              <button
                onClick={() => {
                  setShowSignup(false);
                  setSignupStep("signup");
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>

              {/* SIGNUP STEP */}
              {signupStep === "signup" && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20 mb-5">
                      R
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight">
                      Create your account
                    </h2>

                    <p className="mt-2 text-gray-400">
                      Start building your AI-powered knowledge workspace.
                    </p>
                  </div>

                  <button className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-2xl py-4 font-medium hover:scale-[1.02] transition mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.3-6.2 6.7l6.2 5.2C39.9 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute w-full border-t border-white/10" />
                    <span className="relative px-4 bg-[#111827] text-sm text-gray-500">
                      OR SIGN UP WITH EMAIL
                    </span>
                  </div>

                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                      <label className="block text-sm text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      // onClick={() => {}
                      onClick={handleSubmit}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition shadow-lg shadow-blue-500/20"
                    >
                      Create Free Account
                    </button>
                  </form>

                  <p className="mt-8 text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                      }}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      Login
                    </button>
                  </p>
                </>
              )}

              {/* ONBOARDING STEP */}
              {/* {signupStep === "onboarding" && (
                <div>
                  <div className="text-center mb-8 md:mb-10">
                    <div className="w-20 h-20 mx-auto rounded-[28px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/20 mb-6">
                      ✨
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
                      Welcome to RecallIQ
                    </h2>

                    <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                      Upload meetings, videos, PDFs, and audio files. Chat with
                      your knowledge using AI.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      "YouTube Videos",
                      "Meeting Recordings",
                      "PDF Documents",
                      "Audio Files",
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-5 text-center hover:bg-white/10 transition cursor-pointer min-h-[150px] flex flex-col items-center justify-center"
                      >
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-4" />
                        <p className="font-medium text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 mb-8">
                    <div className="border-2 border-dashed border-white/10 rounded-3xl p-6 md:p-10 text-center hover:border-blue-500/50 transition cursor-pointer">
                      <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 mb-5" />
                      <h3 className="text-xl font-semibold mb-3">
                        Upload your first content
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Drag & drop files or paste a YouTube URL to begin.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowSignup(false);
                      window.location.href = "/dashboard";
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition shadow-lg shadow-blue-500/20"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              )} */}
            </div>
          </div>
        )}

        {/* Footer */}
        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 overflow-y-auto hide-scrollbar">
            <div className="relative w-full max-w-md bg-[#111827]/95 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 animate-in fade-in zoom-in duration-300">
              {/* Close */}
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20 mb-5">
                  R
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                  Welcome Back
                </h2>

                <p className="mt-2 text-gray-400">
                  Login to continue using RecallIQ
                </p>
              </div>

              {/* Google Login */}
              <button className="w-full flex items-center justify-center gap-3 bg-white text-black rounded-2xl py-4 font-medium hover:scale-[1.02] transition mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.3-6.2 6.7l6.2 5.2C39.9 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-full border-t border-white/10" />
                <span className="relative px-4 bg-[#111827] text-sm text-gray-500">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>

              {/* Email Form */}
              <form className="space-y-5" onSubmit={UserLogin}>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400">
                    <input type="checkbox" className="rounded" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotStep("email");
                    }}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition shadow-lg shadow-blue-500/20"
                >
                  Login
                </button>
              </form>

              <p className="mt-8 text-center text-gray-400 text-sm">
                Don’t have an account?{" "}
                <button className="text-blue-400 hover:text-blue-300 transition">
                  Create account
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 overflow-y-auto hide-scrollbar">
            <div className="relative w-full max-w-md bg-[#111827]/95 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 animate-in fade-in zoom-in duration-300 overflow-hidden">
              {/* Close */}
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotStep("email");
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20 mb-5">
                  R
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                  Reset Password
                </h2>

                <p className="mt-2 text-gray-400">
                  Secure OTP verification for your account
                </p>
              </div>

              {/* STEP 1 - EMAIL */}
              {forgotStep === "email" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                    />
                  </div>

                  <button
                    onClick={() => setForgotStep("otp")}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition shadow-lg shadow-blue-500/20"
                  >
                    Send OTP
                  </button>
                </div>
              )}

              {/* STEP 2 - OTP */}
              {forgotStep === "otp" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-4">
                      OTP sent to your email
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-3 text-center">
                      Enter 6-digit OTP
                    </label>

                    <div className="grid grid-cols-6 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <input
                          key={item}
                          type="text"
                          maxLength={1}
                          className="w-full aspect-square bg-black/30 border border-white/10 rounded-2xl text-center text-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setForgotStep("newPassword")}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition shadow-lg shadow-blue-500/20"
                  >
                    Verify OTP
                  </button>

                  <button className="w-full text-gray-400 hover:text-white transition text-sm">
                    Resend OTP
                  </button>
                </div>
              )}

              {/* STEP 3 - NEW PASSWORD */}
              {forgotStep === "newPassword" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setIsUpdatingPassword(true);

                      setTimeout(() => {
                        setIsUpdatingPassword(false);
                        setPasswordUpdated(true);

                        setTimeout(() => {
                          setPasswordUpdated(false);
                          setShowForgotPassword(false);
                          setShowLogin(true);
                          setForgotStep("email");
                        }, 2000);
                      }, 2500);
                    }}
                    disabled={isUpdatingPassword}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-lg hover:scale-[1.02] transition shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isUpdatingPassword ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating Password...
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </button>

                  {passwordUpdated && (
                    <div className="text-center p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-300">
                      Password updated successfully. Redirecting to login...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="relative z-10 border-t border-white/10 py-10 text-center text-gray-500 text-sm">
          © 2026 RecallIQ. Built with AI-powered semantic search and RAG.
        </footer>
      </div>
    </>
  );
}
