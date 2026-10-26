// src/components/DpiExporterModal.tsx
import React, { useState } from 'react';
import { generatePadaKanajaExport, generateCLDFWordlistExport } from '../utils/dialectometryEngine';
import { ATLAS_DATASET } from '../data/dataset';
import { Download, FileJson, Check, X, Shield, Globe2 } from 'lucide-react';

interface DpiExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DpiExporterModal: React.FC<DpiExporterModalProps> = ({ isOpen, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'padakanaja' | 'cldf'>('padakanaja');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const padaKanajaData = generatePadaKanajaExport(ATLAS_DATASET.entries);
  const cldfData = generateCLDFWordlistExport(ATLAS_DATASET.entries);

  const activeJson = activeFormat === 'padakanaja' ? padaKanajaData : cldfData;
  const jsonString = JSON.stringify(activeJson, null, 2);

  const handleDownload = () => {
    const filename =
      activeFormat === 'padakanaja'
        ? 'padakanaja_ingest_v4_karnataka_dpi.json'
        : 'cldf_wordlist_nucl1305_glottolog.json';

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Tier-2 Deep Research • Advancement 8
              </span>
              <span className="text-xs text-stone-400 font-mono">DPI Standardized Exporter</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              Karnataka DPI & Glottolog CLDF Linguistic Exporter
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Exports verified linguistic records directly formatted for Government of Karnataka PadaKanaja ingestion and global CLDF Glottolog research.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="px-6 pt-4 border-b border-stone-800 flex gap-3">
          <button
            onClick={() => setActiveFormat('padakanaja')}
            className={`pb-3 px-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeFormat === 'padakanaja'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            GoK PadaKanaja Schema (v4.1)
          </button>
          <button
            onClick={() => setActiveFormat('cldf')}
            className={`pb-3 px-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeFormat === 'cldf'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileJson className="w-4 h-4" />
            Glottolog CLDF (nucl1305 Wordlist)
          </button>
        </div>

        {/* JSON Preview Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-stone-400 font-mono">
              {activeFormat === 'padakanaja'
                ? 'Format: padakanaja_ingest_v4.json • 13 Entries'
                : 'Format: cldf_wordlist_nucl1305.json • Glottolog Nuclear Kannadoid'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors flex items-center gap-1.5 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileJson className="w-3.5 h-3.5" />}
                {copied ? 'Copied JSON' : 'Copy JSON'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1.5 text-xs shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON
              </button>
            </div>
          </div>

          <pre className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-stone-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[45vh]">
            <code>{jsonString}</code>
          </pre>
        </div>

        {/* Footer Notice */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Composite Open Data: CC BY 4.0 Metadata • ODbL v1.0 Alar Ingestion • Public Domain Kittel (1894)</span>
          </div>
          <span className="font-mono text-stone-500">GoK Directorate of e-Governance & CLDF Compatible</span>
        </div>
      </div>
    </div>
  );
};
