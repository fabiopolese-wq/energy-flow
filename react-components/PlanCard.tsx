import React, { useId, useState } from 'react';
import Sparkline from './PlanCardExpanded.sparkline';

interface Props {
  defaultOpen?: boolean;
}

const PlanCard: React.FC<Props> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const detailsId = useId();

  return (
    <div className="rounded-2xl border border-[#6E40FF] p-6 bg-white">
      <div className="grid items-start gap-6 grid-cols-1 lg:grid-cols-[1fr_280px]">
        {/* HEADER LEFT */}
        <header className="min-w-0 w-full lg:col-start-1 lg:col-end-2">
          <div className="flex items-center gap-3">
            <div className="text-rose-500 font-extrabold text-2xl leading-none lowercase">e.on</div>
            <h5 className="text-[18px] font-semibold text-[#111827]">EON Next Gust 12 m</h5>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-[#111827]">
            <span className="text-[14px]">12 month contract</span>
            <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-medium bg-[#111827] text-white">Fixed</span>
          </div>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#111827] border border-[#E5E7EB] bg-[#F1F3F5] hover:bg-white rounded-md px-3 py-2"
            aria-expanded={isOpen}
            aria-controls={detailsId}
            onClick={() => setIsOpen(v => !v)}
          >
            View more details <span>{isOpen ? '▴' : '▾'}</span>
          </button>
        </header>

        {/* HEADER RIGHT (price panel — shown once) */}
        <aside className="w-full lg:w-[280px] lg:col-start-2 lg:col-end-3 lg:justify-self-end">
          <div className="text-[12px] text-[#6B7280]">Price</div>
          <div className="text-[24px] font-bold text-[#111827]">£40.94<span className="text-[12px] font-semibold text-[#6B7280] ml-1">/month</span></div>
          <div className="text-[14px] font-semibold text-[#111827] mt-1">£406.21 <span className="text-[#6B7280] font-normal">/year</span></div>
          <div className="mt-2">
            <Sparkline />
            <div className="text-[12px] text-[#E11D48] mt-1">Potential 20% inc. in Dec</div>
          </div>
        </aside>

        {/* DETAILS (single section that expands in place) */}
        <section
          id={detailsId}
          aria-hidden={!isOpen}
          className={`${isOpen ? 'lg:col-span-2 data-[open=true]:animate-expand' : 'hidden'} w-full`}
          data-open={isOpen}
        >
          {/* rates toggle block */}
          <div className="mt-2 w-full space-y-2">
            <div className="flex items-center justify-between text-[14px] w-full">
              <span className="text-[#111827]">Unit rate per kWH:</span>
              <span className="font-semibold text-[#111827]">22.530p</span>
            </div>
            <div className="flex items-center justify-between text-[14px] w-full">
              <span className="text-[#111827]">Standing charge per day:</span>
              <span className="font-semibold text-[#111827]">39.190p</span>
            </div>
          </div>

          {/* badges row */}
          <div className="mt-4 flex flex-wrap gap-2 w-full">
            <span className="inline-flex items-center gap-2 rounded-md bg-[#FDE68A] text-[#78350F] text-[12px] font-medium px-3 py-2">B‑Corp certified</span>
            <span className="inline-flex items-center gap-2 rounded-md bg-[#E0F2FE] text-[#0C4A6E] text-[12px] font-medium px-3 py-2">85.5% renewable</span>
          </div>

          <div className="mt-4 border-t border-[#E5E7EB]" />

          {/* compare providers grid */}
          <div className="mt-5 w-full">
            <h6 className="text-[14px] font-semibold text-[#111827]">Compare providers</h6>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
              <div className="min-w-0 w-full">
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="text-[#f97316] font-extrabold text-xl leading-none uppercase">edf</div>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-[#E5E7EB] px-2 py-0.5 text-[11px] text-[#6B7280]">current</span>
                </div>
                <div className="mt-1 text-[13px] font-semibold text-[#111827]">Standard Default Plan (assumed)</div>
                <div className="mt-3 space-y-2.5 w-full">
                  <div className="flex items-center justify-between w-full"><div className="text-[12px] text-[#6B7280]">Pricing type</div><div className="text-[13px] font-semibold text-[#111827]">Variable (changes with cap)</div></div>
                  <div className="flex items-center justify-between w-full"><div className="text-[12px] text-[#6B7280]">Contract length</div><div className="text-[13px] font-semibold text-[#111827]">Open-ended</div></div>
                </div>
              </div>
              <div className="min-w-0 w-full">
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="text-rose-500 font-extrabold text-xl leading-none lowercase">e.on</div>
                  </div>
                </div>
                <div className="mt-1 text-[13px] font-semibold text-[#111827]">EON Next Gust 12 m</div>
                <div className="mt-3 space-y-2.5 w-full">
                  <div className="flex items-center justify-between w-full"><div className="text-[12px] text-[#6B7280]">Pricing type</div><div className="text-[13px] font-semibold text-[#111827]">Fixed (locked for 12 months)</div></div>
                  <div className="flex items-center justify-between w-full"><div className="text-[12px] text-[#6B7280]">Contract length</div><div className="text-[13px] font-semibold text-[#111827]">12 months</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* short bio + footer */}
          <div className="mt-5 bg-[#F8FAFF] border border-[#E5E7EB] rounded-xl p-4 w-full">
            <div className="flex items-start gap-3 w-full">
              <span className="text-[#6E40FF]">✦</span>
              <p className="text-[13px] leading-5 text-[#111827] m-0">
                E.ON is one of Europe’s leading energy companies and in the UK it operates through E.ON Next with a strong focus on renewable electricity. All of its UK residential customers receive 100% renewable‑backed power, sourced through a mix of its own generation assets—such as biomass plants in Lockerbie and Sheffield—alongside power purchase agreements with UK wind and solar.
                <a className="ml-2 text-[12px] underline hover:no-underline text-[#111827]" href="#">Read more</a>
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 w-full">
              <button className="px-3 py-2 text-[12px] font-medium rounded-[18px] border border-transparent hover:border-[#6E40FF]">What’s my impact with renewables?</button>
              <button className="px-3 py-2 text-[12px] font-medium rounded-[18px] border border-transparent hover:border-[#6E40FF]">Why 100% renewable?</button>
            </div>
          </div>

          {/* footer CTAs inside details */}
          <div className="mt-6 flex items-center justify-between w-full">
            <button className="min-w-[180px] h-[44px] rounded-[16px] bg-[#6E40FF] text-white text-[14px] font-semibold px-4">Choose plan</button>
            <button className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#6E40FF] focus:ring-offset-2 rounded-md px-2 py-1" onClick={() => setIsOpen(false)}>
              Close Plan <span>▴</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlanCard;
