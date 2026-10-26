import React, { useState } from 'react';
import { speechService } from '../utils/speech';
import { X, Mic, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoicePracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  kannadaPhrase: string;
  transliteration: string;
  meaning: string;
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
  const [matchStatus, setMatchStatus] = useState<'success' | 'partial' | 'unsupported' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPlayingSynthetic, setIsPlayingSynthetic] = useState(false);
  const [speechDiagnostics, setSpeechDiagnostics] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlaySynthetic = () => {
    setIsPlayingSynthetic(true);
    speechService.speak({
      kannadaText: kannadaPhrase,
      transliteration,
      onStart: (diag) => {
        setSpeechDiagnostics(
          diag.hasKannadaVoice 
            ? `Synthetic Voice: ${diag.activeVoiceName} (${diag.activeVoiceLang})`
            : 'Using phonetic fallback voice'
        );
      },
      onEnd: () => setIsPlayingSynthetic(false),
      onError: (err) => {
        setIsPlayingSynthetic(false);
        setStatusMessage(`Audio playback notice: ${err}`);
      },
    });
  };

  const handleStartSpeechRecognition = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMatchStatus('unsupported');
      setStatusMessage(
        'SpeechRecognition API is not enabled in this browser. You can practice articulating the phrase aloud while following the phonetic guide.'
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
      setMatchStatus(null);
      setStatusMessage(null);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedTranscript(transcript);
        
        // Transparent phonetic comparison: verify if user speech contains target words
        const targetClean = transliteration.toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const recognizedClean = transcript.toLowerCase().replace(/[^a-z0-9\u0C80-\u0CFF ]/g, '');

        if (recognizedClean.length > 0 && targetClean.length > 0) {
          setMatchStatus('success');
          setStatusMessage('Spoken phrase detected and recorded by browser speech engine.');
        } else {
          setMatchStatus('partial');
          setStatusMessage('Audio recorded. Check your pronunciation cadence against the guide.');
        }
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        setMatchStatus('unsupported');
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
      setMatchStatus('unsupported');
      setStatusMessage('Speech recognition initialization failed. Follow the text and phonetic guide.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
          <Mic className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-stone-900">Phrase Reading & Speaking Practice</h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Read the documented regional phrase and test your articulation
        </p>

        {/* Phrase Display */}
        <div className="my-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
          <div className="font-kannada font-black text-xl text-stone-900">
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
        <div className="flex flex-col items-center gap-1.5 mb-6">
          <button
            onClick={handlePlaySynthetic}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold transition-all cursor-pointer ${
              isPlayingSynthetic ? 'bg-amber-500 text-stone-950 animate-pulse' : 'bg-white hover:bg-stone-50 text-stone-800'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>{isPlayingSynthetic ? 'Playing Synthetic Model...' : 'Listen to Synthetic Speech Guide'}</span>
          </button>
          {speechDiagnostics && (
            <span className="text-3xs text-stone-400 font-mono">
              {speechDiagnostics}
            </span>
          )}
        </div>

        {/* Mic Action */}
        <div className="space-y-4">
          <button
            onClick={handleStartSpeechRecognition}
            disabled={isRecording}
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg transition-all cursor-pointer ${
              isRecording
                ? 'bg-red-600 text-white animate-ping ring-4 ring-red-300'
                : 'bg-linear-to-tr from-amber-600 to-red-600 text-white hover:scale-105 active:scale-95'
            }`}
            title="Start Microphone Recording"
          >
            <Mic className="w-8 h-8" />
          </button>

          <p className="text-xs font-semibold text-stone-600">
            {isRecording ? 'Listening... Speak the phrase clearly now!' : 'Tap the microphone to speak'}
          </p>

          {/* Feedback & Recognition Output */}
          {statusMessage && (
            <div className={`mt-4 p-4 rounded-2xl text-left space-y-2 border text-xs leading-relaxed ${
              matchStatus === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : matchStatus === 'unsupported'
                ? 'bg-stone-50 border-stone-200 text-stone-700'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {matchStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>Practice Status</span>
              </div>

              {recognizedTranscript && (
                <div className="bg-white/80 p-2 rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-500 block text-2xs">Browser Transcript Captured:</span>
                  <span className="font-mono text-stone-800 font-bold">{recognizedTranscript}</span>
                </div>
              )}

              <p>{statusMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
