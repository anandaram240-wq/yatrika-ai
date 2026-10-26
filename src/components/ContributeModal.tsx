import React, { useState } from 'react';
import { REGIONS } from '../data/regions';
import { CommunityContribution, RegionId } from '../types';
import { X, PlusCircle, CheckCircle } from 'lucide-react';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContribution: (contribution: CommunityContribution) => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  onAddContribution,
}) => {
  const [wordKannada, setWordKannada] = useState('');
  const [wordTransliteration, setWordTransliteration] = useState('');
  const [meaning, setMeaning] = useState('');
  const [regionId, setRegionId] = useState<RegionId>('uttara-karnataka');
  const [district, setDistrict] = useState('');
  const [usageExample, setUsageExample] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordKannada.trim() || !meaning.trim()) return;

    const newEntry: CommunityContribution = {
      id: `contrib-${Date.now()}`,
      wordKannada: wordKannada.trim(),
      wordTransliteration: wordTransliteration.trim() || wordKannada.trim(),
      meaning: meaning.trim(),
      regionId,
      district: district.trim() || 'Karnataka',
      usageExample: usageExample.trim(),
      contributorName: contributorName.trim() || 'Anonymous Kannadiga',
      timestamp: 'Just now',
      upvotes: 1,
    };

    onAddContribution(newEntry);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      // Reset form
      setWordKannada('');
      setWordTransliteration('');
      setMeaning('');
      setDistrict('');
      setUsageExample('');
      setContributorName('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-stone-900">ಧನ್ಯವಾದಗಳು!</h3>
            <p className="text-stone-600 text-sm">
              Your regional word has been added to the Community Dialect Vault!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-red-100 text-red-700">
                <PlusCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-black text-stone-900">Document a Regional Word</h3>
                <p className="text-xs text-stone-500">Contribute regional vocabulary from your hometown</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Word in Kannada (ಕನ್ನಡ) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ಹೌದ್ಲಾ, ಬೋಳ್ಯಾ, ಮಾರ್ರೆ"
                    value={wordKannada}
                    onChange={(e) => setWordKannada(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-kannada"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Transliteration (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haudla, Boliya"
                    value={wordTransliteration}
                    onChange={(e) => setWordTransliteration(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Meaning & Emotional Context *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Is that so?! Expressing friendly surprise"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Regional Zone *
                  </label>
                  <select
                    value={regionId}
                    onChange={(e) => setRegionId(e.target.value as RegionId)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name.split(' (')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Hometown / District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dharwad, Kundapura, Mandya"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Sample Sentence (Usage Example)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ಹೌದ್ಲಾ! ನಾನ್ ಮೊದಲೇ ಹೇಳಿಲ್ವಾ?"
                  value={usageExample}
                  onChange={(e) => setUsageExample(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-kannada"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Name / Handle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Rao / Mysore Kannadiga"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-linear-to-r from-red-600 to-amber-600 text-white font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer text-sm"
                >
                  Publish to Community Vault
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
