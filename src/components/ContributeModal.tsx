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
  const [attributionPreference, setAttributionPreference] = useState<'real-name' | 'pseudonym' | 'anonymous'>('real-name');
  const [licenseConsent, setLicenseConsent] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!wordKannada.trim() || !meaning.trim()) {
      setValidationError('Please provide both the Kannada word and its English meaning.');
      return;
    }

    if (!licenseConsent) {
      setValidationError('You must consent to the open-source attribution license (CC-BY 4.0) to draft this entry.');
      return;
    }

    const newEntry: CommunityContribution = {
      id: `contrib-${Date.now()}`,
      wordKannada: wordKannada.trim(),
      wordTransliteration: wordTransliteration.trim() || wordKannada.trim(),
      meaning: meaning.trim(),
      regionId,
      district: district.trim() || 'Karnataka',
      usageExample: usageExample.trim(),
      contributorName: contributorName.trim() || 'Anonymous Contributor',
      attributionPreference,
      licenseConsent: true,
      timestamp: 'Just now',
      status: 'contributor-submitted',
      localNotes: 'Drafted on current client device via Community Vault form.',
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
      setLicenseConsent(false);
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
            <h3 className="text-2xl font-black text-stone-900">ಧನ್ಯವಾದಗಳು! Entry Saved</h3>
            <p className="text-stone-600 text-sm">
              Your contribution draft is stored in your local browser vault and ready for JSON research export!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <PlusCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-black text-stone-900">Document a Regional Expression</h3>
                <p className="text-xs text-stone-500">Draft a hometown vocabulary record stored locally on this device</p>
              </div>
            </div>

            {validationError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
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
                    Phonetic Transliteration *
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
                  Meaning & Conversational Context *
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
                    Regional Exploration Zone *
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
                    Hometown / Taluk
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Byndoor, Sirsi, Channapatna"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Sample Sentence (Authentic Usage)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ಹೌದ್ಲಾ! ನಾನ್ ಮೊದಲೇ ಹೇಳಿಲ್ವಾ?"
                  value={usageExample}
                  onChange={(e) => setUsageExample(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-kannada"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Name or Handle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vinayaka K / Kundapura"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Attribution Preference
                  </label>
                  <select
                    value={attributionPreference}
                    onChange={(e) => setAttributionPreference(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="real-name">Use Real Name</option>
                    <option value="pseudonym">Use Pseudonym</option>
                    <option value="anonymous">Keep Anonymous</option>
                  </select>
                </div>
              </div>

              {/* Licensing & Consent Checkbox */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={licenseConsent}
                    onChange={(e) => setLicenseConsent(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="leading-tight">
                    I confirm this phrase represents genuine documented regional usage. I consent to sharing this data under the <strong>Creative Commons Attribution 4.0 (CC-BY 4.0)</strong> license for open linguistic research.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-linear-to-r from-red-600 to-amber-600 text-white font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer text-sm"
                >
                  Save to Local Device Vault
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
