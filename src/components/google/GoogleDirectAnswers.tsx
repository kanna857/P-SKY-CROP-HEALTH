import React, { useState } from 'react';
import { DirectAnswer } from '@/lib/generalSearchEngine';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Volume2, 
  BookOpen, 
  Calculator as CalcIcon, 
  ArrowRightLeft, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleDirectAnswersProps {
  directAnswer: DirectAnswer;
  onSearchQuery?: (q: string) => void;
}

export const GoogleDirectAnswers: React.FC<GoogleDirectAnswersProps> = ({
  directAnswer,
  onSearchQuery
}) => {
  // Calculator Interactive State
  const [calcDisplay, setCalcDisplay] = useState<string>(
    directAnswer.type === 'calculator' ? String(directAnswer.data.result || '0') : '0'
  );
  const [calcHistory, setCalcHistory] = useState<string>(
    directAnswer.type === 'calculator' ? String(directAnswer.data.expression || '') : ''
  );
  const [copied, setCopied] = useState(false);

  const handleCalcButton = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      setCalcHistory('');
    } else if (val === '=') {
      try {
        const evalSafe = calcDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        // eslint-disable-next-line no-new-func
        const res = Function(`'use strict'; return (${evalSafe})`)();
        setCalcHistory(`${calcDisplay} =`);
        setCalcDisplay(String(Number(res.toFixed(6))));
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      if (calcDisplay === '0' || calcDisplay === 'Error') {
        setCalcDisplay(val);
      } else {
        setCalcDisplay(prev => prev + val);
      }
    }
  };

  const handleCopyCalc = () => {
    navigator.clipboard.writeText(calcDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Interactive Google Calculator
  if (directAnswer.type === 'calculator') {
    const keypad = [
      ['(', ')', '%', 'C'],
      ['7', '8', '9', '÷'],
      ['4', '5', '6', '×'],
      ['1', '2', '3', '-'],
      ['0', '.', '=', '+']
    ];

    return (
      <div className="w-full max-w-lg p-5 rounded-3xl bg-[#0c1422]/95 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-4 mb-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
            <CalcIcon className="w-4 h-4" />
            <span>Interactive Calculator</span>
          </div>
          <button 
            onClick={handleCopyCalc}
            className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Display */}
        <div className="bg-black/60 p-4 rounded-2xl border border-white/10 text-right space-y-1">
          <div className="text-xs text-gray-400 font-mono h-4 overflow-hidden truncate">
            {calcHistory || 'Ans = 0'}
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-wider overflow-x-auto">
            {calcDisplay}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          {keypad.flat().map((btn) => {
            const isOp = ['+', '-', '×', '÷', '=', 'C', '%', '(', ')'].includes(btn);
            const isEq = btn === '=';
            const isClear = btn === 'C';

            return (
              <button
                key={btn}
                onClick={() => handleCalcButton(btn)}
                className={`py-3 rounded-2xl text-sm font-mono font-bold transition-all active:scale-95 ${
                  isEq
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-black shadow-lg shadow-blue-500/20'
                    : isClear
                    ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                    : isOp
                    ? 'bg-white/10 text-emerald-300 hover:bg-white/15 border border-white/10'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {btn}
              </button>
            );
          })}
        </div>

        {directAnswer.data.note && (
          <p className="text-xs text-emerald-300 font-mono pt-1">
            🌱 {directAnswer.data.note}
          </p>
        )}
      </div>
    );
  }

  // 2. Google Weather Forecast Card
  if (directAnswer.type === 'weather') {
    const data = directAnswer.data;
    return (
      <div className="w-full max-w-xl p-5 rounded-3xl bg-gradient-to-r from-[#0c1828]/95 via-[#081220]/95 to-[#0c1828]/95 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {data.city} Weather
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Live meteorological telemetry
            </p>
          </div>
          <div className="p-2 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <CloudSun className="w-6 h-6" />
          </div>
        </div>

        {/* Current Metrics */}
        <div className="flex items-center gap-6 pt-1">
          <div className="text-5xl font-extrabold text-white font-display">
            {data.temperature}°<span className="text-2xl text-cyan-400">C</span>
          </div>
          <div className="space-y-1 text-xs text-gray-300 font-mono">
            <div className="font-bold text-white text-sm">{data.condition}</div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-cyan-300">
                <Droplets className="w-3.5 h-3.5" /> {data.humidity}% Humidity
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <Wind className="w-3.5 h-3.5 text-blue-400" /> {data.windKmh} km/h
              </span>
            </div>
          </div>
        </div>

        {/* Field Spray Window Advisory */}
        {data.sprayWindowStatus && (
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-emerald-400">🚜 Field Spray Advisory:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {data.sprayWindowStatus}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-sans">
              {data.sprayAdvisory}
            </p>
            {data.et0 && (
              <span className="text-[10px] text-gray-400 font-mono block">
                ET0 Evapotranspiration: {data.et0}
              </span>
            )}
          </div>
        )}

        {/* 5-Day Forecast Grid */}
        <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/10 text-center">
          {data.forecast?.map((f: any, idx: number) => (
            <div key={idx} className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[11px] text-gray-400 font-mono block">{f.day}</span>
              <CloudSun className="w-4 h-4 text-cyan-400 mx-auto" />
              <span className="text-xs font-bold text-white font-mono block">{f.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Google Dictionary Definition Card
  if (directAnswer.type === 'dictionary') {
    const data = directAnswer.data;
    return (
      <div className="w-full max-w-xl p-5 rounded-3xl bg-[#0c1422]/95 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-3 mb-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300 uppercase">Dictionary</span>
          </div>
          <span className="text-[11px] text-gray-400 font-mono italic">{data.partOfSpeech}</span>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-extrabold text-white font-display capitalize">
              {data.word}
            </h3>
            <span className="text-xs text-gray-400 font-mono">{data.phonetic}</span>
          </div>

          <p className="text-sm text-gray-200 pt-2 leading-relaxed font-sans">
            1. {data.definition}
          </p>

          {data.example && (
            <p className="text-xs text-gray-400 italic pt-1 pl-3 border-l-2 border-amber-500/40 mt-2">
              "{data.example}"
            </p>
          )}
        </div>

        {/* Synonyms */}
        {data.synonyms && data.synonyms.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
            <span className="text-[11px] text-gray-400 font-mono">Similar:</span>
            {data.synonyms.map((syn: string) => (
              <button
                key={syn}
                onClick={() => onSearchQuery?.(`define ${syn}`)}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border border-white/10 text-xs font-mono transition-colors"
              >
                {syn}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 4. Google Unit Converter Card
  if (directAnswer.type === 'unit_converter') {
    const data = directAnswer.data;
    return (
      <div className="w-full max-w-lg p-5 rounded-3xl bg-[#0c1422]/95 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 border-b border-white/10 pb-2">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Unit Converter</span>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10 flex-1 text-center">
            <div className="text-2xl font-extrabold text-white font-mono">{data.fromValue}</div>
            <div className="text-xs text-gray-400 font-mono uppercase mt-1">{data.fromUnit}</div>
          </div>

          <div className="text-gray-400 font-bold text-lg">=</div>

          <div className="bg-black/60 p-3.5 rounded-2xl border border-emerald-500/40 flex-1 text-center shadow-lg shadow-emerald-500/10">
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">{data.toValue}</div>
            <div className="text-xs text-emerald-300 font-mono uppercase mt-1">{data.toUnit}</div>
          </div>
        </div>

        <div className="text-[11px] text-gray-400 text-center font-mono pt-1">
          Formula: <span className="text-gray-200">{data.formula}</span>
        </div>
      </div>
    );
  }

  return null;
};
