import React, {useEffect, useMemo, useRef, useState} from 'react';
import './NeedsPills.css';

export type PillKey = 'supplyType' | 'homeSize' | 'ev';
export type PillState = { value: string; status: 'assumed' | 'confirmed' };
export type NeedsModel = Record<PillKey, PillState>;

export interface NeedsPillsProps {
  initial: NeedsModel;
  onChange: (model: NeedsModel, confidence: number) => void;
  onSelect?: (pill: PillKey, value: string, wasFirstConfirm: boolean) => void;
  onHitHundred?: () => void;
}

type Option = { label: string; value: string; specificity: number; isUnknown?: boolean };

const OPTIONS: Record<PillKey, Option[]> = {
  supplyType: [
    { label: 'Unknown / skip', value: 'unknown', specificity: 0, isUnknown: true },
    { label: 'Electricity', value: 'electricity', specificity: 1 },
    { label: 'Electricity and gas', value: 'dual', specificity: 1 },
  ],
  homeSize: [
    { label: 'Unknown / skip', value: 'unknown', specificity: 0, isUnknown: true },
    { label: '1–2 bedrooms', value: '1-2', specificity: 2 },
    { label: '3–4 bedrooms', value: '3-4', specificity: 2 },
    { label: '5+ bedrooms', value: '5+', specificity: 2 },
  ],
  ev: [
    { label: 'Unknown / skip', value: 'unknown', specificity: 0, isUnknown: true },
    { label: 'Yes', value: 'yes', specificity: 1 },
    { label: 'No', value: 'no', specificity: 1 },
  ],
};

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function baselineFromModel(m: NeedsModel) { return Object.values(m).some(p => p.status === 'assumed') ? 65 : 75; }
function findOption(key: PillKey, value: string) { return OPTIONS[key].find(o => o.value === value) || OPTIONS[key][0]; }

export const NeedsPills: React.FC<NeedsPillsProps> = ({ initial, onChange, onSelect, onHitHundred }) => {
  const [model, setModel] = useState<NeedsModel>(initial);
  const [confidence, setConfidence] = useState<number>(() => baselineFromModel(initial));
  const [open, setOpen] = useState<Partial<Record<PillKey, boolean>>>({});
  const [highlight, setHighlight] = useState<Partial<Record<PillKey, number>>>({});
  const [pulse, setPulse] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const debounced = useRef<number | null>(null);

  const confirmedPillsCount = useMemo(() => Object.values(model).filter(p => p.status === 'confirmed').length, [model]);
  const allConfirmed = useMemo(() => confirmedPillsCount === 3, [confirmedPillsCount]);

  function nextConfirm(prev: number) { return clamp(allConfirmed ? prev + 10 : Math.min(prev + 10, 95), prev, 100); }
  function nextRefine(prev: number, from: Option | undefined, to: Option) {
    const delta = Math.max(0, Math.min(3, (to?.specificity ?? 0) - (from?.specificity ?? 0)));
    return clamp(allConfirmed ? prev + delta : Math.min(prev + delta, 95), prev, 100);
  }

  function announce(msg: string) { if (liveRegionRef.current) liveRegionRef.current.textContent = msg; }
  function closeAndFocus(key: PillKey) { setOpen(o => ({...o, [key]: false})); document.getElementById(`pill-${key}`)?.focus(); }

  function handleSelect(key: PillKey, opt: Option) {
    setModel(prev => {
      const curr = prev[key];
      const fromOpt = findOption(key, curr.value);
      const wasAssumed = curr.status === 'assumed';
      const nextStatus = opt.isUnknown ? 'assumed' : 'confirmed';
      const wasFirstConfirm = wasAssumed && nextStatus === 'confirmed';

      setConfidence(prevC => {
        let nextC = prevC;
        if (wasFirstConfirm) nextC = nextConfirm(prevC);
        else if (curr.status === 'confirmed' && nextStatus === 'confirmed') { nextC = nextRefine(prevC, fromOpt, opt); setPulse(true); setTimeout(()=>setPulse(false), 260); }
        announce(`${labelForKey(key)} updated. Confidence now ${Math.round(nextC)} percent.`);
        return nextC;
      });

      const nextModel: NeedsModel = { ...prev, [key]: { value: opt.value, status: nextStatus } };
      if (debounced.current) clearTimeout(debounced.current);
      debounced.current = window.setTimeout(() => onChange(nextModel, confidence), 150);
      onSelect?.(key, opt.value, wasFirstConfirm);
      return nextModel;
    });
    closeAndFocus(key);
  }

  // Raise to 100 when all confirmed (forward-only)
  useEffect(() => { if (allConfirmed) setConfidence(prev => Math.max(prev, 100)); }, [allConfirmed]);

  const percent = clamp(confidence, baselineFromModel(model), 100);
  const caption = (allConfirmed && Math.round(percent) >= 100)
    ? 'Nice work — you\u2019ve reached 100% confidence'
    : 'Confirm the pills to strengthen matches.';

  // One-time celebration when hitting 100
  const hitHundred = Math.round(percent) === 100;
  useEffect(() => {
    if (hitHundred && !hasCelebrated) {
      onHitHundred?.();
    }
  }, [hitHundred, hasCelebrated, onHitHundred]);

  const fillColorClass = confirmedPillsCount > 0 ? 'bg-emerald' : 'bg-amber';

  return (
    <div className="needs">
      <header className="needs-header">
        <div className="needs-title">Personal needs</div>
        <div className="needs-chip" aria-hidden>{Math.round(percent)}%</div>
      </header>
      <div className="pill-row">
        {(['supplyType','homeSize','ev'] as PillKey[]).map((key) => {
          const pill = model[key];
          const opt = findOption(key, pill.value);
          const items = OPTIONS[key];
          const lbId = `listbox-${key}`;
          return (
            <div key={key} className="pill-wrapper">
              <button
                type="button"
                id={`pill-${key}`}
                className={['pill', pill.status === 'assumed' ? 'assumed' : 'confirmed'].join(' ')}
                aria-haspopup="listbox" aria-expanded={!!open[key]} aria-controls={lbId} aria-pressed={pill.status==='confirmed'}
                onClick={() => setOpen(o => ({...o, [key]: !o[key]}))}
              >{opt?.label || 'Select'}</button>
              {open[key] && (
                <ul role="listbox" id={lbId} aria-labelledby={`pill-${key}`} tabIndex={-1} className="dropdown"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { e.preventDefault(); closeAndFocus(key); }
                    if (e.key === 'Enter') { e.preventDefault(); const idx = Math.max(1, (highlight[key] ?? 1)); handleSelect(key, items[idx]); }
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const delta = e.key==='ArrowDown'?1:-1; const max=items.length-1; setHighlight(h=>({ ...h, [key]: clamp((h[key]??1)+delta,1,max) })); }
                  }}>
                  {items.map((o, idx) => (
                    <li role="option" aria-selected={o.value===pill.value} tabIndex={0} key={o.value} className={`dropdown-item ${idx===(highlight[key]??-1)?'focused':''}`} onClick={()=>handleSelect(key,o)}>
                      {o.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className={['confidence', pulse ? 'pulse' : ''].join(' ')}>
        <div className="label">Confidence</div>
        <div className="bar" aria-label={`Confidence ${Math.round(percent)} percent`}>
          <div
            data-hit={hitHundred && !hasCelebrated}
            className={[
              'bar-fill','transition-fill',
              fillColorClass,
              hitHundred && !hasCelebrated ? 'animate-pulseOnce animate-glow' : ''
            ].join(' ')}
            style={{width: `${percent}%`}}
            onAnimationEnd={() => setHasCelebrated(true)}
          />
          <span className="percent" aria-hidden>{Math.round(percent)}%</span>
        </div>
        <div className="bar-caption" aria-live="polite" aria-atomic="true">{caption}</div>
      </div>

      <div ref={liveRegionRef} aria-live="polite" className="sr-only" />
    </div>
  );
};

function labelForKey(key: PillKey) { return key==='supplyType' ? 'Electricity type' : key==='homeSize' ? 'Bedrooms' : 'Electric vehicle'; }

export default NeedsPills;
