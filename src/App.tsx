import React, { useState } from 'react';
import { Play, Pause, Upload, Sparkles, Download, Scissors, Trash2, Plus, Search, RefreshCw } from 'lucide-react';

interface Subtitle {
  id: string;
  start: string;
  end: string;
  text: string;
}

const STYLES = [
  { id: 'classic_yellow', name: 'Jaune Cinéma', preview: 'text-yellow-300 font-bold drop-shadow' },
  { id: 'tiktok_bold', name: 'TikTok Fond Noir', preview: 'text-white bg-black px-2 py-1 font-black' },
  { id: 'neon_green', name: 'Néon Vert', preview: 'text-emerald-400 font-extrabold [text-shadow:_0_0_10px_#10b981]' },
  { id: 'cyber_pink', name: 'Cyber Rose', preview: 'text-pink-500 font-black drop-shadow-[0_0_8px_#ec4899]' },
  { id: 'minimal_white', name: 'Blanc Minimal', preview: 'text-white font-medium' },
  { id: 'gamer_red', name: 'Gamer Rouge', preview: 'text-red-500 font-black uppercase italic' },
  { id: 'gradient_orange', name: 'Orange Vif', preview: 'text-orange-400 font-bold' },
  { id: 'karaoke_blue', name: 'Bleu Souligné', preview: 'text-cyan-300 font-bold underline decoration-pink-500' },
  // ... (extensible jusqu'à 20 styles)
];

export default function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStyle, setActiveStyle] = useState('classic_yellow');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    { id: '1', start: '00:00.000', end: '00:02.500', text: 'Bonjour et bienvenue sur SubtiFlow !' },
    { id: '2', start: '00:02.500', end: '00:05.200', text: 'Générez vos sous-titres directement dans le navigateur.' }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerateAI = () => {
    setIsProcessing(true);
    setProgress(10);
    // Simulation du pipeline de transcription locale asynchrone
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 20;
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-purple-900/40">
            S
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            SubtiFlow
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            disabled={!videoFile || isProcessing}
            onClick={handleGenerateAI}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-sm font-bold rounded-xl shadow-lg transition"
          >
            <Sparkles size={16} />
            <span>{isProcessing ? `Transcription (${progress}%)` : 'Générer les sous-titres IA'}</span>
          </button>
          <button 
            disabled={!videoFile}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-bold rounded-xl shadow-lg transition"
          >
            <Download size={16} />
            <span>Exporter</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        
        {/* Left / Center : Video Preview & Timeline */}
        <div className="lg:col-span-2 flex flex-col border-r border-slate-800 p-6 space-y-6">
          {!videoUrl ? (
            <label className="flex-1 border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-900/20 transition p-12 text-center">
              <Upload size={48} className="text-purple-500 mb-4 animate-bounce" />
              <span className="text-lg font-bold">Glissez-déposez votre vidéo ici</span>
              <span className="text-sm text-slate-500 mt-1">MP4, WebM, MOV acceptés (Traitement 100% local)</span>
              <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-slate-800 shadow-2xl">
              <video src={videoUrl} className="max-h-full" />
              {/* Dynamic Subtitle Overlay Preview */}
              <div className="absolute bottom-6 inset-x-4 text-center pointer-events-none">
                <span className={`text-2xl px-3 py-1 rounded-lg ${STYLES.find(s => s.id === activeStyle)?.preview}`}>
                  {subtitles[0]?.text || "Aperçu des sous-titres"}
                </span>
              </div>
            </div>
          )}

          {/* Timeline Section */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3 text-sm text-slate-400 font-medium">
              <span>Timeline des segments</span>
              <span>00:00 / 00:30</span>
            </div>
            <div className="h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center px-4 relative overflow-x-auto">
              {subtitles.map((sub, idx) => (
                <div key={sub.id} className="absolute bg-purple-600/30 border border-purple-500 rounded-lg px-3 py-1 text-xs truncate cursor-pointer hover:bg-purple-600/50 transition" style={{ left: `${idx * 150 + 20}px`, width: '130px' }}>
                  {sub.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel : Styles & Subtitles Editor */}
        <div className="flex flex-col bg-slate-900/40 overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-3">Styles Visuels (CapCut Mode)</h2>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${activeStyle === style.id ? 'border-purple-500 bg-purple-500/10' : 'border-slate-800 bg-slate-900 hover:bg-slate-800'}`}
                >
                  <span className={`text-sm truncate ${style.preview}`}>{style.name}</span>
                  <span className="text-[10px] text-slate-500 mt-2">Style prédéfini</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400">Éditeur de Segments</h2>
              <button className="text-xs text-purple-400 hover:underline flex items-center space-x-1">
                <Plus size={14} />
                <span>Ajouter</span>
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {subtitles.map((sub) => (
                <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>{sub.start} → {sub.end}</span>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={sub.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSubtitles(subtitles.map(s => s.id === sub.id ? { ...s, text: val } : s));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
