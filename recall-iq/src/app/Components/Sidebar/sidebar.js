import React from "react";

const Sidebar = ({ setActive,activeSection }) => {
  //   const [activeSection, setActiveSection] = useState("youtube");
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
  return (
    <div className="p-6 space-y-4">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
        Workspace
      </p>

      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
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
  );
};

export default Sidebar;
