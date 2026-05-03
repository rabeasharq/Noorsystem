/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { LessonPlan } from "../types";
import { Printer, Download, ChevronRight, Share2, Sparkles, BookOpen, Clock, Target, Ghost } from "lucide-react";
import { cn } from "../lib/utils";

interface PreviewPanelProps {
  plan: LessonPlan;
  onBack: () => void;
  onSave: () => void;
  saved: boolean;
}

export function PreviewPanel({ plan, onBack, onSave, saved }: PreviewPanelProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Top Actions Cabinet */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4 no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-naskh"
        >
          <ChevronRight className="w-5 h-5" />
          رجوع للتعديل
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={onSave}
            disabled={saved}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all font-naskh",
              saved 
                ? "bg-slate-800 text-slate-500 cursor-default" 
                : "bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-slate-950"
            )}
          >
            {saved ? "تم الحفظ محلياً" : "حفظ الخطة"}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-slate-950 rounded-xl font-bold hover:bg-sky-400 transition-all font-naskh"
          >
            <Printer className="w-5 h-5" />
            طباعة / تصدير PDF
          </button>
        </div>
      </div>

      {/* The Actual Document */}
      <div 
        ref={printRef}
        className="bg-white text-slate-950 shadow-2xl rounded-[2rem] p-10 md:p-16 min-h-[1100px] print:shadow-none print:p-0 print:rounded-none relative overflow-hidden font-naskh"
      >
        {/* Background Accent for Screen */}
        <div className="absolute top-0 right-0 w-full h-2 bg-gold no-print"></div>

        {/* Header: Official Yemeni Style */}
        <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-8">
           <div className="text-center space-y-1">
              <div className="font-bold text-lg">الجمهورية اليمنية</div>
              <div className="text-sm">وزارة التربية والتعليم</div>
              <div className="text-sm">مكتب التربية والتعليم بمحافظة ................</div>
              <div className="text-sm">مدرسة: <span className="underline decoration-dotted">{plan.form.schoolName || "................"}</span></div>
           </div>
           
           <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center mx-auto grayscale opacity-50">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Emblem_of_Yemen.svg/1200px-Emblem_of_Yemen.svg.png" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="font-bold text-xl tracking-widest text-slate-800">خطة تحضير درس</div>
           </div>

           <div className="text-right space-y-1 text-sm">
              <div>اليوم: <span className="font-bold">{plan.meta.day}</span></div>
              <div>التاريخ: <span className="font-bold">{plan.meta.date}</span></div>
              <div>الحصة: <span className="font-bold">{plan.meta.period}</span></div>
              <div>الأسبوع: <span className="font-bold">{plan.meta.week}</span></div>
           </div>
        </div>

        {/* Lesson Info Grid */}
        <div className="grid grid-cols-2 gap-y-6 mb-12 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
           <InfoItem label="المادة" value={plan.meta.subject} icon={<BookOpen className="w-4 h-4 text-gold"/>} />
           <InfoItem label="الصف" value={plan.meta.grade} icon={<Sparkles className="w-4 h-4 text-sky-500"/>} />
           <InfoItem label="عنوان الدرس" value={plan.meta.lessonTitle} isFull />
           <InfoItem label="المعلم" value={plan.form.teacherName} />
           <InfoItem label="نوع الدرس" value={plan.meta.lessonTypeLabel} />
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
           {/* Objectives */}
           <section>
              <h3 className="section-title">🎯 أهداف التعلم (نواتج التعلم)</h3>
              <ul className="list-disc pr-6 space-y-2 text-slate-700">
                {plan.objectives.map((obj, i) => (
                  <li key={i}><span className="font-bold text-slate-900">{obj}</span></li>
                ))}
              </ul>
           </section>

           {/* Pedagogy & Alpha Strategy */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-sky-50 p-5 rounded-2xl border border-sky-100">
                 <h3 className="text-sky-800 font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    استراتيجية جيل ألفا المعتمدة
                 </h3>
                 <div className="text-sky-900 font-bold mb-1">{plan.alphaStrategy}</div>
                 <p className="text-sky-700 text-sm leading-relaxed">{plan.alphaDesc}</p>
              </section>

              <section className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                 <h3 className="text-amber-800 font-bold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    نوع التمهيد المختار
                 </h3>
                 <div className="text-amber-900 font-bold mb-1">{plan.introLabel}</div>
                 <p className="text-amber-700 text-sm leading-relaxed">{plan.introDesc}</p>
              </section>
           </div>

           {/* Procedures Grid */}
           <section>
              <h3 className="section-title">⚡ خطوات سير الحصة (المنهجية التطبيقية)</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                 <table className="w-full text-right border-collapse">
                    <thead>
                       <tr className="bg-slate-100 text-slate-600 text-sm uppercase">
                          <th className="p-4 border-b border-slate-200 w-32">المرحلة</th>
                          <th className="p-4 border-b border-slate-200 w-24">الزمن</th>
                          <th className="p-4 border-b border-slate-200">الأنشطة والإجراءات</th>
                       </tr>
                    </thead>
                    <tbody>
                       {plan.stages.map((stage, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                             <td className="p-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/20">{stage.name}</td>
                             <td className="p-4 border-b border-slate-100 text-center"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{stage.t} د</span></td>
                             <td className="p-4 border-b border-slate-100">
                                <ul className="space-y-1">
                                   {stage.acts.map((act, j) => (
                                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                                         <span className="text-gold mt-1">•</span>
                                         {act}
                                      </li>
                                   ))}
                                </ul>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </section>

           {/* Anticipated Errors & Remedies */}
           <section className="bg-rose-50 p-6 rounded-3xl border-2 border-dashed border-rose-200">
              <h3 className="text-rose-800 font-bold mb-4 flex items-center gap-2">
                 <Ghost className="w-5 h-5" />
                 محطة الملاحظة وتصحيح المسار (الأخطاء المتوقعة)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {plan.expectedErrors.map((err, i) => (
                    <div key={i} className="bg-white/60 p-3 rounded-xl border border-rose-100">
                       <div className="text-rose-600 font-bold mb-1 text-sm">الخطأ: {err}</div>
                       <div className="text-slate-500 text-[11px]">المعالجة: {plan.errorRemedies[i]}</div>
                    </div>
                 ))}
              </div>
           </section>

           {/* Homework & References */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                 <h3 className="section-title">🏠 التكاليف المنزلية</h3>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 italic">
                    {plan.homework}
                 </div>
              </section>
              <section>
                 <h3 className="section-title">📚 المراجع والمصادر</h3>
                 <ul className="text-xs text-slate-500 space-y-1 pr-4 list-decimal">
                    {plan.references.map((ref, i) => <li key={i}>{ref}</li>)}
                 </ul>
              </section>
           </div>
        </div>

        {/* Footer Signatures */}
        <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-400 italic">
           <div className="text-center w-40">توقيع المعلم</div>
           <div className="text-center w-40">توقيع الموجه</div>
           <div className="text-center w-40">ختم المدرسة</div>
        </div>

        {/* Tech Watermark (no-print) */}
        <div className="mt-20 text-center text-[10px] text-slate-400 no-print">
           تم التوليد ذكياً بواسطة منظومة نور الإصدار 1.1 · لغة الضاد تجمعنا
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-break { page-break-after: always; }
          @page { size: A4; margin: 20mm; }
        }
        .section-title {
          font-weight: 800;
          font-size: 1.125rem;
          color: #1e293b;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}

function InfoItem({ label, value, icon, isFull }: any) {
  return (
    <div className={cn("flex flex-col gap-1", isFull && "col-span-2")}>
       <div className="text-slate-400 text-xs font-bold flex items-center gap-1">
          {icon}
          {label}
       </div>
       <div className={cn("text-slate-800 font-bold", isFull ? "text-xl underline underline-offset-8 decoration-gold" : "text-md")}>
          {value || "................"}
       </div>
    </div>
  );
}
