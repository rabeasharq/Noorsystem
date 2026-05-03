/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LessonPlan } from "../types";
import { Search, Calendar, GraduationCap, Trash2, Eye, FileText } from "lucide-react";
import { SUBJECTS, GRADES } from "../constants/data";
import { formatDateArabic } from "../lib/utils";

interface HistoryPanelProps {
  plans: LessonPlan[];
  onLoad: (plan: LessonPlan) => void;
  onDelete: (id: number) => void;
}

export function HistoryPanel({ plans, onLoad, onDelete }: HistoryPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = plans.filter(p => 
    p.meta.lessonTitle.includes(search) || 
    p.meta.subject.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative group max-w-xl mx-auto">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold transition-colors w-5 h-5" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث في خططك السابقة (بالعنوان أو المادة)..."
          className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pr-12 pl-6 text-white outline-none focus:border-gold transition-all font-naskh shadow-xl focus:shadow-gold/10"
        />
      </div>

      {plans.length === 0 ? (
        <div className="py-20 text-center opacity-40">
           <FileText className="w-16 h-16 mx-auto mb-4 opacity-10" />
           <p className="font-naskh">لا توجد خطط محفوظة حالياً. ابدأ بإنشاء خطتك الأولى.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((plan) => {
            const S = SUBJECTS[plan.meta.subjectKey];
            const G = GRADES[plan.meta.gradeNum];
            return (
              <div 
                key={plan.id}
                className="group p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-gold/30 hover:bg-gold/[0.02] transition-all flex justify-between items-center"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{S?.icon || "📖"}</span>
                    <h3 className="text-white font-bold font-naskh text-lg leading-none">{plan.meta.lessonTitle}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {plan.meta.grade}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {plan.meta.day} · {plan.meta.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onLoad(plan)}
                    className="p-3 bg-white/5 text-slate-300 hover:bg-gold hover:text-slate-950 rounded-xl transition-all"
                    title="عرض وتعديل"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => { if(window.confirm("حذف هذه الخطة نهائياً؟")) onDelete(plan.id); }}
                    className="p-3 bg-white/5 text-slate-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
