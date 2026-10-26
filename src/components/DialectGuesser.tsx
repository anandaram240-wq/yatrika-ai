import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { REGIONS } from '../data/regions';
import { RegionId } from '../types';
import { speechService } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Award, Volume2, CheckCircle, XCircle, ArrowRight, RotateCcw, Sparkles, BookOpen } from 'lucide-react';

export const DialectGuesser: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<RegionId | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    speechService.speak({
      kannadaText: currentQ.phraseKannada,
      transliteration: currentQ.transliteration,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleSelectOption = (option: RegionId) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctRegionId;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    let title = 'Karnataka Explorer';
    let message = 'Good effort! Exploring these documented phrases deepens appreciation for Kannada diversity.';

    if (percentage >= 80) {
      title = '👑 Kannada Bhasha Premi!';
      message = 'Outstanding! You demonstrated an excellent understanding of regional Kannada vocabulary!';
    } else if (percentage >= 50) {
      title = '🌟 Chalo Kannada Vidyarthi';
      message = 'Great score! You recognize regional expressions across several Karnataka zones.';
    }

    return (
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 text-center bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-12">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-amber-700 mb-6 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Quiz Completed
          </span>

          <h2 className="text-3xl font-black text-stone-900 mt-3">{title}</h2>
          <p className="text-stone-600 mt-2 font-medium">{message}</p>

          {/* Score Stats */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-8">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-3xl font-black text-red-700">{score} / {QUIZ_QUESTIONS.length}</div>
              <div className="text-xs text-stone-500 font-semibold mt-1">Correct Answers</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="text-3xl font-black text-amber-600">{percentage}%</div>
              <div className="text-xs text-stone-500 font-semibold mt-1">Lexical Accuracy</div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-2 mx-auto px-6 py-3.5 rounded-2xl bg-linear-to-r from-red-600 to-amber-600 text-white font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Regional Knowledge Quiz</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-indigo-700" />
            <span>Regional Language & Phrase Knowledge Quiz</span>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900">
            Match the Phrase to its Documented Region
          </h2>
          <p className="text-stone-600 mt-1 text-sm sm:text-base">
            Test your knowledge of regional idioms, vocabulary, and cultural contexts documented across Karnataka.
          </p>
          <p className="text-3xs text-stone-400 mt-1 italic">
            Notice: Audio is synthetic text-to-speech for phrase guide purposes. This quiz tests lexical and grammatical knowledge.
          </p>
        </div>

        {/* Progress & Streak Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-500">
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="hidden sm:flex w-32 h-2 rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-stone-700">
              Score: <strong className="text-stone-900">{score}</strong>
            </span>
            {streak > 1 && (
              <span className="text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                🔥 Streak: {streak}
              </span>
            )}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-bold text-stone-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Audio Snippet Box */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <div className="font-kannada font-black text-xl sm:text-2xl text-stone-900">
                "{currentQ.phraseKannada}"
              </div>
              <div className="text-sm font-bold text-red-700">
                /{currentQ.transliteration}/
              </div>
              <div className="text-xs text-stone-600 italic">
                Meaning: "{currentQ.englishMeaning}"
              </div>
            </div>

            <button
              onClick={handlePlayAudio}
              className={`p-3.5 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                isPlayingAudio
                  ? 'bg-amber-500 text-stone-950 animate-pulse'
                  : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-300'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>{isPlayingAudio ? 'Speaking...' : 'Play Synthetic Audio'}</span>
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((regionId) => {
              const region = REGIONS.find((r) => r.id === regionId);
              if (!region) return null;

              const isSelected = selectedOption === regionId;
              const isCorrect = isAnswered && regionId === currentQ.correctRegionId;
              const isWrong = isAnswered && isSelected && !isCorrect;

              let buttonClass = 'bg-stone-50 border-stone-200 hover:border-amber-400 hover:bg-stone-100/70 text-stone-800';

              if (isCorrect) {
                buttonClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 font-bold';
              } else if (isWrong) {
                buttonClass = 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-400 font-bold';
              }

              return (
                <button
                  key={regionId}
                  onClick={() => handleSelectOption(regionId)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${buttonClass}`}
                >
                  <div>
                    <span className="block font-bold text-sm">
                      {region.name.split(' (')[0]}
                    </span>
                    <span className="font-kannada text-xs text-stone-500 mt-0.5">
                      {region.kannadaName.split(' (')[0]}
                    </span>
                  </div>

                  {isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isWrong && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Card */}
          {isAnswered && (
            <div className="pt-4 border-t border-stone-100 space-y-4 animate-in fade-in duration-300">
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                  selectedOption === currentQ.correctRegionId
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-red-50/70 border-red-200 text-red-900'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {selectedOption === currentQ.correctRegionId ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Correct! Documented in: {REGIONS.find(r => r.id === currentQ.correctRegionId)?.name.split(' (')[0]}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Documented Region: {REGIONS.find(r => r.id === currentQ.correctRegionId)?.name.split(' (')[0]}</span>
                    </>
                  )}
                </div>
                <p>{currentQ.explanation}</p>
                
                {/* Source Citation */}
                <div className="mt-2 pt-2 border-t border-stone-200/50 flex items-center gap-1 text-2xs text-stone-600 font-mono">
                  <BookOpen className="w-3 h-3 text-stone-500" />
                  <span>Source: {currentQ.source.title} ({currentQ.source.authorOrInstitution})</span>
                </div>
              </div>

              {/* Cultural Trivia Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Cultural Context & Background:</strong>
                  {currentQ.culturalTrivia}
                </div>
              </div>

              {/* Next Question CTA */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold hover:bg-stone-800 active:scale-95 transition-all text-sm cursor-pointer shadow-md"
                >
                  <span>{currentIndex + 1 === QUIZ_QUESTIONS.length ? 'View Results' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
