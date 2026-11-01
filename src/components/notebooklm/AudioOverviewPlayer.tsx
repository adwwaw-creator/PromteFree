import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Copy,
  Check,
  Radio,
  Clock,
  Mic,
} from 'lucide-react';
import { AudioOverviewData, AudioTranscriptTurn } from '../../types/notebooklm';

interface AudioOverviewPlayerProps {
  data: AudioOverviewData | null;
  onGenerateNew: () => void;
  isGenerating?: boolean;
  lang?: 'ar' | 'en' | 'fr';
}

export const AudioOverviewPlayer: React.FC<AudioOverviewPlayerProps> = ({
  data,
  onGenerateNew,
  isGenerating = false,
  lang = 'ar',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const totalDuration = data?.durationSeconds || 120;

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Find active turn based on currentTime
  useEffect(() => {
    if (!data || !data.turns) return;
    const currentTurn = data.turns.find(
      (t) => currentTime >= t.startSeconds && currentTime <= t.endSeconds
    );
    if (currentTurn) {
      setActiveTurnId(currentTurn.id);
    }
  }, [currentTime, data]);

  // Speech synthesis for current turn
  const speakCurrentTurn = (turn: AudioTranscriptTurn) => {
    if (!isSpeechSupported) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(turn.text);
    utterance.rate = playbackRate;

    // Distinguish hosts with pitch
    if (turn.speaker === 'host1') {
      utterance.pitch = 0.95;
    } else {
      utterance.pitch = 1.25;
    }

    if (lang === 'ar') {
      utterance.lang = 'ar-SA';
    } else if (lang === 'fr') {
      utterance.lang = 'fr-FR';
    } else {
      utterance.lang = 'en-US';
    }

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (isSpeechSupported) window.speechSynthesis.cancel();
    } else {
      setIsPlaying(true);
      // Play speech of current turn
      if (data && data.turns) {
        const turn = data.turns.find((t) => currentTime >= t.startSeconds && currentTime <= t.endSeconds) || data.turns[0];
        if (turn) speakCurrentTurn(turn);
      }

      // Interval ticker
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            clearInterval(timerRef.current!);
            setIsPlaying(false);
            if (isSpeechSupported) window.speechSynthesis.cancel();
            return 0;
          }
          const next = prev + 1 * playbackRate;

          // Check if entered new turn
          if (data && data.turns) {
            const nextTurn = data.turns.find(
              (t) => next >= t.startSeconds && next <= t.endSeconds
            );
            if (nextTurn && nextTurn.id !== activeTurnId) {
              speakCurrentTurn(nextTurn);
            }
          }
          return next;
        });
      }, 1000);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (data && data.turns) {
      const turn = data.turns.find((t) => val >= t.startSeconds && val <= t.endSeconds);
      if (turn && isPlaying) {
        speakCurrentTurn(turn);
      }
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (isPlaying && data && data.turns && data.turns[0]) {
      speakCurrentTurn(data.turns[0]);
    }
  };

  const handleJumpToTurn = (turn: AudioTranscriptTurn) => {
    setCurrentTime(turn.startSeconds);
    if (isPlaying) {
      speakCurrentTurn(turn);
    }
  };

  const handleCycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIdx]);
  };

  const handleCopyTranscript = async () => {
    if (!data) return;
    const text = data.turns
      .map((t) => `${t.speakerName}: ${t.text}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2000);
    } catch {}
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (isSpeechSupported) window.speechSynthesis.cancel();
    };
  }, []);

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-lg">
          <Radio className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1.5">
          {lang === 'ar' ? 'النظرة الصوتية العامة (Audio Overview)' : 'Audio Overview'}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
          {lang === 'ar'
            ? 'حوّل وثائقك ومصادرك إلى مناقشة صوتية إذاعية حية (Deep Dive) بين مذيعين ذكيين يحللان أفكارك بعمق.'
            : 'Generate a lively, conversational podcast discussion between two AI hosts breaking down your sources.'}
        </p>

        <button
          onClick={onGenerateNew}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          <span>
            {isGenerating
              ? lang === 'ar' ? 'جارٍ توليد النقاش الصوتي...' : 'Generating Audio Overview...'
              : lang === 'ar' ? 'توليد النظرة الصوتية الآن' : 'Generate Audio Overview'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden text-slate-100" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Audio Player Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-br from-[#1a1f33] via-[#16181f] to-[#121316] border-b border-[#2d2f31] flex flex-col gap-3.5 shrink-0">
        
        {/* Title and Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio className="w-3 h-3 text-indigo-400" />
                <span>Deep Dive Podcast</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white truncate">
              {data.title}
            </h3>
          </div>

          <button
            onClick={onGenerateNew}
            disabled={isGenerating}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium flex items-center gap-1 shrink-0"
            title={lang === 'ar' ? 'إعادة توليد البودكاست' : 'Re-generate Podcast'}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'تجديد' : 'Regen'}</span>
          </button>
        </div>

        {/* Animated Waveform Bars */}
        <div className="h-8 flex items-center justify-center gap-1 px-2 bg-black/30 rounded-xl border border-white/5 overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => {
            const progress = (currentTime / totalDuration) * 32;
            const isPassed = i <= progress;
            const randomHeight = ((i * 7) % 18) + 8;
            return (
              <span
                key={i}
                style={{
                  height: isPlaying ? `${randomHeight}px` : '4px',
                  transition: 'height 0.2s ease-in-out',
                }}
                className={`w-1 rounded-full transition-all ${
                  isPassed
                    ? 'bg-gradient-to-t from-indigo-500 to-cyan-400'
                    : 'bg-slate-700/60'
                }`}
              />
            );
          })}
        </div>

        {/* Scrubbable Seek Bar */}
        <input
          type="range"
          min={0}
          max={totalDuration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
        />

        {/* Controls Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={lang === 'ar' ? 'من البداية' : 'Restart'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
            </button>

            {/* Playback Speed */}
            <button
              onClick={handleCycleSpeed}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-colors"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Speakers Pill */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>{data.hosts.host1}</span>
            </span>
            <span>&</span>
            <span className="flex items-center gap-1 text-pink-300">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span>{data.hosts.host2}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Transcript Header */}
      <div className="px-5 py-2.5 bg-[#131314] border-b border-[#2d2f31] flex items-center justify-between shrink-0">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'ar' ? 'النص الحواري المتزامن (Transcript)' : 'Synchronized Transcript'}</span>
        </span>

        <button
          onClick={handleCopyTranscript}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          {copiedTranscript ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'نسخ النص' : 'Copy'}</span>
            </>
          )}
        </button>
      </div>

      {/* Synchronized Live Transcript Feed */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-zinc-700">
        {data.turns.map((turn) => {
          const isActive = turn.id === activeTurnId;
          const isHost1 = turn.speaker === 'host1';

          return (
            <div
              key={turn.id}
              onClick={() => handleJumpToTurn(turn)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-xs sm:text-sm ${
                isActive
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/40'
                  : 'bg-[#18191a] border-[#2d2f31] hover:border-[#3c4043] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-semibold text-xs ${
                    isHost1 ? 'text-blue-400' : 'text-pink-400'
                  }`}
                >
                  {turn.speakerName}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatTime(turn.startSeconds)}
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans">
                {turn.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
