/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CurriculumItem } from "../types";
import { Sparkles, Book, ChevronLeft, Target, Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";

interface CurriculumSelectorProps {
  grade: string;
  items: CurriculumItem[];
  onSelect: (item: CurriculumItem) => void;
  insight: any;
}

export function CurriculumSelector({ grade, items, onSelect, insight }: CurriculumSelectorProps) {
  const filtered = items.filter(i => i.grade === grade);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {insight && (
        <div className="p-5 bg-gold/10 border border-gold/30 rounded-2xl flex gap-4 items-start relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-2xl group-hover:bg-gold/10 transition-colors"></div>
           <Lightbulb className="w-6 h-6 text-gold shrink-0 mt-1" />
           <div className="space-y-1 relative z-10">
              <h4 className="text-gold font-bold text-sm font-naskh">رؤية "نور" الذكية لهذا الصف:</h4>
              <p className="text-slate-300 text-xs leading-relaxed font-naskh">{insight.recommendation}</p>
           </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-white font-bold flex items-center gap-2 font-naskh">
          <Book className="w-5 h-5 text-sky-400" />
          اختر الدرس من الكتاب المدرسي (فهرس أوفلاين)
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500 text-sm italic">
               لا توجد دروس مفهرسة لهذا الصف حالياً.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 hover:border-sky-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center text-xs font-bold">
                    {item.unit.split(" ")[1]}
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm font-naskh">{item.title}</div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{item.subject}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-1">
                      {item.objectives.length > 0 && <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold">أهداف جاهرة</span>}
                   </div>
                   <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
