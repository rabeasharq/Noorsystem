/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { LessonPlan } from "../types";
import { Printer, FileEdit, Download, CheckCircle2, ChevronRight, BookText } from "lucide-react";
import { cn } from "../lib/utils";
import { REVIEW_WEEKS } from "../constants/data";

interface PreviewPanelProps {
  plan: LessonPlan;
  onBack: () => void;
  onSave: () => void;
  saved: boolean;
}

export function PreviewPanel({ plan, onBack, onSave, saved }: PreviewPanelProps) {
  const m = plan.meta;
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="font-naskh">
      {/* Top Action Bar */}
      <div className="no-print sticky top-0 z-50 flex items-center justify-between p-4 bg-slate-900/90 backdrop-blur-md border-b border-white/10 mb-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">{m.lessonTitle}</h1>
            <p className="text-slate-500 text-xs mt-1">{m.subject} · {m.grade}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!saved ? (
             <button 
               onClick={onSave}
               className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
             >
               <CheckCircle2 className="w-4 h-4" />
               حفظ الخطة
             </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold border border-emerald-500/30">
               <CheckCircle2 className="w-4 h-4" />
               محفوظة
            </div>
          )}
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            <Printer className="w-4 h-4" />
            طباعة / PDF
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div 
        ref={printRef}
        className="max-w-[210mm] mx-auto bg-white text-slate-950 shadow-2xl rounded-sm overflow-hidden mb-20 print:shadow-none print:m-0"
      >
        {/* Header Section */}
        <div className="p-8 bg-[#1b3f7a] text-white print:bg-[#1b3f7a]">
           <div className="flex justify-between items-start mb-8">
             <div className="text-right">
                <div className="text-[10px] opacity-70 mb-1">الجمهورية اليمنية · وزارة التربية والتعليم</div>
                <h2 className="text-2xl font-bold border-b-2 border-gold pb-1 inline-block mb-3">خطة تحضير درس اللغة العربية</h2>
                <div className="text-lg opacity-90">{m.subject} {m.subType ? `(${m.subType})` : ""}</div>
             </div>
             <div className="text-left opacity-80 text-[11px] leading-relaxed">
                <div>المعلم: <b>{m.teacherName || "—"}</b></div>
                <div>المدرسة: <b>{m.schoolName || "—"}</b></div>
                <div>الموجه: <b>{m.supervisorName || "—"}</b></div>
             </div>
           </div>

           {/* Meta Grid */}
           <div className="grid grid-cols-3 gap-y-4 gap-x-8 border-t border-white/10 pt-6">
              <MetaField label="الصف الدراسي" value={m.grade} />
              <MetaField label="عنوان الدرس" value={m.lessonTitle} />
              <MetaField label="اليوم والتاريخ" value={`${m.day} · ${m.date}`} />
              <MetaField label="الحصة والمدة" value={`${m.periodNum} (${m.duration} د.)`} />
              <MetaField label="نوع التمهيد" value={m.introTypeLabel} />
              <MetaField label="الأسبوع" value={`${m.week} / 14`} />
           </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Objectives */}
          <Section title="الأهداف التعليمية السلوكية" color="#1b3f7a">
             <div className="grid grid-cols-2 gap-4">
                {plan.objectives.map((o, i) => (
                  <div key={i} className="p-3 bg-slate-50 border-r-4 border-[#1b3f7a] text-xs leading-relaxed">
                    <span className="font-bold ml-1 text-[#1b3f7a]">{i+1}.</span> {o}
                  </div>
                ))}
             </div>
          </Section>

          {/* Strategy & Intro */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-[#1b3f7a] border-b pb-1 text-sm flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1b3f7a]/10 rounded-full flex items-center justify-center text-xs">⚡</span>
                استراتيجية جيل ألفا
              </h4>
              <div className="text-xs bg-amber-50 p-4 border border-amber-100 rounded-lg">
                <div className="font-bold text-amber-800 mb-1">{plan.alphaStrategy}</div>
                <p className="text-slate-600 leading-relaxed italic">{plan.alphaDesc}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-[#a855f7] border-b pb-1 text-sm flex items-center gap-2">
                <span className="w-6 h-6 bg-[#a855f7]/10 rounded-full flex items-center justify-center text-xs">🌅</span>
                التمهيد والتهيئة
              </h4>
              <div className="text-xs bg-purple-50 p-4 border border-purple-100 rounded-lg">
                <div className="font-bold text-purple-800 mb-1">{plan.introLabel}</div>
                <p className="text-slate-600 leading-relaxed">{plan.introEx}</p>
              </div>
            </div>
          </div>

          {/* Stages Table */}
          <Section title="خطوات سير الدرس والأنشطة" color="#1b3f7a">
             <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="bg-[#1b3f7a] text-white">
                    <th className="p-3 text-right">المرحلة</th>
                    <th className="p-3 text-center w-16">الزمن</th>
                    <th className="p-3 text-right">الأنشطة والإجراءات</th>
                    <th className="p-3 text-center w-24">دور المعلم</th>
                    <th className="p-3 text-center w-24">دور الطالب</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.stages.map((st, i) => (
                    <tr key={i} className="border-b even:bg-slate-50">
                      <td className="p-3 font-bold text-[#1b3f7a]">{i+1}. {st.name}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 bg-slate-200 rounded-full font-bold">{st.t}′</span>
                      </td>
                      <td className="p-3 space-y-1">
                        {st.acts.map((a, j) => <div key={j}>• {a}</div>)}
                      </td>
                      <td className="p-3 text-center opacity-70">
                         {["التوجيه","الشرح","الإرشاد","الخلاصة"][i] || "—"}
                      </td>
                      <td className="p-3 text-center opacity-70">
                         {["المشاركة","الاستيعاب","التطبيق","التقييم"][i] || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </Section>

          {/* Errors & Assessments */}
          <div className="grid grid-cols-2 gap-8">
            <Section title="الأخطاء المتوقعة وعلاجها" color="#e11d48">
              <div className="space-y-3">
                {plan.expectedErrors.map((e, i) => (
                  <div key={i} className="text-[11px] leading-relaxed">
                    <div className="font-bold text-rose-600 mb-0.5">⚠️ {e}</div>
                    <div className="opacity-70">← {plan.errorRemedies[i]}</div>
                  </div>
                ))}
              </div>
            </Section>
            <div className="space-y-8">
               <Section title="أساليب التقييم" color="#0d9488">
                 <div className="flex flex-wrap gap-2">
                    {plan.assessments.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[10px] text-teal-700">✓ {a}</span>
                    ))}
                 </div>
               </Section>
               <Section title="الواجب المنزلي" color="#2563eb">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed font-bold">
                    {plan.homework}
                  </div>
               </Section>
            </div>
          </div>

          {/* Cognitive Note */}
          <div className="p-6 bg-slate-100 rounded-2xl border-l-[6px] border-slate-300">
             <h5 className="font-bold text-slate-800 text-xs mb-2">💡 ملاحظة تربوية هامة:</h5>
             <p className="text-[11px] text-slate-600 leading-relaxed italic">{m.cogNote}</p>
          </div>

          {/* Footer Signatures */}
          <div className="pt-10 grid grid-cols-3 gap-12 text-center text-[10px] opacity-60">
             <Signature title="توقيع المعلم" />
             <Signature title="توقيع مدير المدرسة" />
             <Signature title="توقيع الموجه التربوي" />
          </div>
        </div>

        <div className="bg-slate-50 p-4 text-center text-[9px] opacity-40 border-t">
           تم إنشاء هذه الخطة عبر منظومة نور — الإصدار {m.week} · صنعاء، اليمن
        </div>
      </div>
    </div>
  );
}

function MetaField({ label, value }: any) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] opacity-60 uppercase font-bold tracking-wider">{label}</div>
      <div className="text-sm font-bold truncate">{value}</div>
    </div>
  );
}

function Section({ title, color, children }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold flex items-center gap-3" style={{ color }}>
         <span className="h-0.5 flex-1 bg-current opacity-20"></span>
         {title}
         <span className="h-0.5 flex-1 bg-current opacity-20"></span>
      </h3>
      {children}
    </div>
  );
}

function Signature({ title }: any) {
  return (
    <div className="space-y-12">
      <div className="font-bold">{title}</div>
      <div className="border-t border-slate-300 pt-2">التاريخ: ____ / ____ / ________</div>
    </div>
  );
}
