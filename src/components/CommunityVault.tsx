import React, { useState } from 'react';
import { CommunityContribution } from '../types';
import { REGIONS } from '../data/regions';
import { speechService } from '../utils/speech';
import { MapPin, PlusCircle, ThumbsUp, Volume2, Download, Check, User } from 'lucide-react';

interface CommunityVaultProps {
  contributions: CommunityContribution[];
  onOpenContributeModal: () => void;
  onUpvoteContribution: (id: string) => void;
}

export const CommunityVault: React.FC<CommunityVaultProps> = ({
  contributions,
  onOpenContributeModal,
  onUpvoteContribution,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePlayAudio = (item: CommunityContribution) => {
    setPlayingId(item.id);
    speechService.speak({
      kannadaText: item.usageExample || item.wordKannada,
      transliteration: item.wordTransliteration,
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(contributions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'namma_kannada_community_dialect_archive.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5 text-purple-700" />
              <span>Crowdsourced Dialect Archive</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900">
              Community Dialect Vault
            </h2>
            <p className="text-stone-600 mt-1 max-w-2xl text-sm sm:text-base">
              Documented by passionate Kannadigas from across towns and villages. Add words from your native place to preserve our oral culture!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-stone-500" />}
              <span>Export Archive (JSON)</span>
            </button>

            <button
              onClick={onOpenContributeModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-amber-600 text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Contribute New Word</span>
            </button>
          </div>
        </div>

        {/* Contributions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((item) => {
            const region = REGIONS.find((r) => r.id === item.regionId);
            const isPlaying = playingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 hover:border-purple-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-2xs font-extrabold uppercase tracking-wide bg-purple-50 text-purple-800 border border-purple-200">
                      {region?.name.split(' (')[0] || 'Karnataka'}
                    </span>

                    <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {item.district}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className="font-kannada font-black text-2xl text-stone-900">
                      {item.wordKannada}
                    </h3>
                    <span className="text-sm font-bold text-red-700">
                      /{item.wordTransliteration}/
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-stone-700 font-medium">
                    {item.meaning}
                  </p>

                  {item.usageExample && (
                    <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-800">
                      <span className="font-bold text-stone-500 block mb-0.5">Usage in sentence:</span>
                      <span className="font-kannada text-sm block">"{item.usageExample}"</span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-2xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Submitted by: <strong className="text-stone-700">{item.contributorName}</strong>
                    </span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onUpvoteContribution(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:text-purple-700 hover:bg-purple-50 border border-stone-200 transition-all cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-purple-600" />
                    <span>Helpful ({item.upvotes})</span>
                  </button>

                  <button
                    onClick={() => handlePlayAudio(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 text-stone-950 animate-pulse'
                        : 'bg-stone-50 hover:bg-amber-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isPlaying ? 'Playing...' : 'Audio'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
