import React, { useState } from 'react';
import { speechService } from '../utils/speech';
import { X, Mic, Volume2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface VoicePracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  kannadaPhrase: string;
  transliteration: string;
  meaning: string;
}

function computeLevenshteinSimilarity(s1: string, s2: string): { similarity: number; distance: number } {
  const clean1 = s1.trim().replace(/\s+/g, '');
  const clean2 = s2.trim().replace(/\s+/g, '');
  if (!clean1 || !clean2) return { similarity: 0, distance: Math.max(clean1.length, clean2.length) };
  if (clean1 === clean2) return { similarity: 1.0, distance: 0 };
  
  const m = clean1.length;
  const n = clean2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = clean1[i - 1] === clean2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  
  const distance = dp[m][n];
  const maxLen = Math.max(m, n);
  const similarity = Math.max(0, 1 - distance / maxLen);
  return { similarity, distance };
}

export const VoicePracticeModal: React.FC<VoicePracticeModalProps> = ({
  isOpen,
  onClose,
  kannadaPhrase,
  transliteration,
  meaning,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedTranscript, setRecognizedTranscript] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [charDistance, setCharDistance] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPlayingSynthetic, setIsPlayingSynthetic] = useState(false);
  const [audioErrorNotice, setAudioErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlaySynthetic = () => {
    setIsPlayingSynthetic(true);
    setAudioErrorNotice(null);
    const success = speechService.speak({
      kannadaText: kannadaPhrase,
      transliteration,
      onEnd: () => setIsPlayingSynthetic(false),
      onError: (err) => {
        setIsPlayingSynthetic(false);
        setAudioErrorNotice(err);
      },
    });
    if (!success && !audioErrorNotice) {
      setIsPlayingSynthetic(false);
    }
  };

  const handleStartSpeechRecognition = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage(
        'SpeechRecognition API is not enabled in this browser. Practice reciting aloud following the transliteration guide.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'kn-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);
      setRecognizedTranscript(null);
      setSimilarityScore(null);
      setCharDistance(null);
      setStatusMessage(null);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedTranscript(transcript);
        
        // Deterministic character similarity
        const { similarity, distance } = computeLevenshteinSimilarity(transcript, kannadaPhrase);
        setSimilarityScore(Math.round(similarity * 100));
        setCharDistance(distance);

        if (similarity >= 0.8) {
          setStatusMessage('Exact or near-exact match detected by browser Standard Kannada ASR.');
        } else if (similarity >= 0.4) {
          setStatusMessage('Partial character alignment. Regional endings may have been normalized by the standard ASR engine.');
        } else {
          setStatusMessage('Low alignment detected. Check the phonetic transliteration guide and retry.');
        }
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        setStatusMessage(
          event.error === 'not-allowed'
            ? 'Microphone access was denied. Please allow microphone permissions to practice.'
            : `Speech recognition notice: ${event.error || 'No speech detected'}. Try speaking clearly into the microphone.`
        );
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsRecording(false);
      setStatusMessage('Speech recognition initialization failed. Follow the text and phonetic guide.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
          <Mic className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-stone-900">
          Spoken Recall Check (Standard kn-IN ASR Text-Match)
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Read the documented expression aloud to verify recognition against standard ASR
        </p>

        {/* Permanent ASR Normalization Warning */}
        <div className="my-3 p-3 rounded-2xl bg-stone-100 border border-stone-200 text-left text-3xs text-stone-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <span>
            <strong>ASR Dialect Limitation:</strong> Browser Speech-to-Text is trained on Standard Kannada (<code>kn-IN</code>) and may normalize or misrecognize regional dialect endings (such as <em>-ākattīri</em>, <em>-likkattīri</em>, or <em>-iddiri</em>).
          </span>
        </div>

        {/* Phrase Display */}
        <div className="my-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
          <div className="font-kannada font-black text-2xl text-stone-900 leading-loose" lang="kn">
            {kannadaPhrase}
          </div>
          <div className="text-sm font-bold text-red-700">
            /{transliteration}/
          </div>
          <div className="text-xs text-stone-600 italic">
            "{meaning}"
          </div>
        </div>

        {/* Listen Synthetic Reference */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <button
            onClick={handlePlaySynthetic}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold transition-all cursor-pointer ${
              isPlayingSynthetic ? 'bg-amber-500 text-stone-950 animate-pulse' : 'bg-white hover:bg-stone-50 text-stone-800'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isPlayingSynthetic 
                ? 'Playing Synthetic kn-IN...' 
                : 'Listen (Synthetic Standard kn-IN Script Readout — Not a Native Regional Recording)'}
            </span>
          </button>
          {audioErrorNotice && (
            <p className="text-3xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
              {audioErrorNotice}
            </p>
          )}
        </div>

        {/* Mic Action */}
        <div className="space-y-3">
          <button
            onClick={handleStartSpeechRecognition}
            disabled={isRecording}
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg transition-all cursor-pointer ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300'
                : 'bg-linear-to-tr from-amber-600 to-red-600 text-white hover:scale-105 active:scale-95'
            }`}
            title="Start Microphone Recording"
          >
            <Mic className="w-7 h-7" />
          </button>

          <p className="text-xs font-semibold text-stone-600">
            {isRecording ? 'Listening... Speak the phrase clearly into your microphone!' : 'Tap to start spoken recall check'}
          </p>

          {/* Feedback & Recognition Output */}
          {(recognizedTranscript !== null || statusMessage) && (
            <div className="mt-4 p-4 rounded-2xl text-left space-y-2 border text-xs bg-stone-50 border-stone-200 text-stone-800">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Deterministic ASR Character Comparison</span>
                </span>
                {similarityScore !== null && (
                  <span className={`px-2 py-0.5 rounded-md font-mono text-xs ${
                    similarityScore >= 80 ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-amber-100 text-amber-900'
                  }`}>
                    Match: {similarityScore}% (Edit Dist: {charDistance})
                  </span>
                )}
              </div>

              {recognizedTranscript && (
                <div className="bg-white p-2.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-semibold text-stone-500 block text-3xs uppercase">Target Script:</span>
                  <span className="font-kannada font-bold text-stone-900 block" lang="kn">{kannadaPhrase}</span>
                  <span className="font-semibold text-stone-500 block text-3xs uppercase pt-1">Captured ASR Transcript:</span>
                  <span className="font-kannada font-bold text-stone-900 block text-red-700" lang="kn">{recognizedTranscript}</span>
                </div>
              )}

              {statusMessage && <p className="text-stone-600">{statusMessage}</p>}

              <button
                onClick={handleStartSpeechRecognition}
                className="mt-2 flex items-center gap-1 text-2xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
