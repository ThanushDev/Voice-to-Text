import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, RotateCcw, Copy, Download, Languages, Sparkles } from 'lucide-react';
import './App.css';

const App = () => {
  const [lang, setLang] = useState('en-US');
  const [isCopied, setIsCopied] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <div className="error-msg">⚠️ Browser doesn't support speech recognition. Try Chrome.</div>;
  }

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: lang });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadTranscript = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `FCBS_Lecture_Note_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="main-wrapper">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-container"
      >
        <header className="header">
          <div className="badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>AI Powered Tool</span>
          </div>
          <h1>FCBS <span className="gradient-text">Transcribe</span></h1>
          <p>Convert your Management & Communication lectures to text effortlessly.</p>
        </header>

        <div className="toolbar">
          <div className="selector-group">
            <Languages size={18} className="icon-fade" />
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en-US">English (US)</option>
              <option value="si-LK">Sinhala (Sri Lanka)</option>
              <option value="ta-LK">Tamil (Sri Lanka)</option>
            </select>
          </div>

          <div className={`status ${listening ? 'active' : ''}`}>
            <span className="pulse-dot"></span>
            {listening ? "Recording..." : "Ready"}
          </div>
        </div>

        <div className="transcript-wrapper">
          <AnimatePresence mode="wait">
            <motion.div 
              key={transcript}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="content-area"
            >
              {transcript ? transcript : <span className="placeholder">Click 'Start' and start speaking...</span>}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="button-grid">
          {!listening ? (
            <motion.button 
              whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={startListening} className="btn-main"
            >
              <Mic size={20} /> Start Session
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={SpeechRecognition.stopListening} className="btn-danger"
            >
              <MicOff size={20} /> Stop Session
            </motion.button>
          )}

          <div className="utility-buttons">
            <button onClick={resetTranscript} className="btn-sub" title="Reset"><RotateCcw size={20} /></button>
            <button onClick={copyToClipboard} className="btn-sub" title="Copy">
              {isCopied ? <span style={{fontSize: '12px', color: '#10b981'}}>Done!</span> : <Copy size={20} />}
            </button>
            <button onClick={downloadTranscript} className="btn-sub" title="Download"><Download size={20} /></button>
          </div>
        </div>
      </motion.div>

      <footer className="footer">
        © 2026 Digi Solutions | Designed for FCBS Students
      </footer>
    </div>
  );
};

export default App;
