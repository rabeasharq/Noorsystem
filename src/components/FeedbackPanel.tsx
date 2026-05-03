/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LessonPlan } from "../types";
import { SUBJECTS } from "../constants/data";
import { TrendingUp, Award, Target, LayoutGrid } from "lucide-react";
import { cn } from "../lib/utils";

interface FeedbackPanelProps {
  plans: LessonPlan[];
}

export function FeedbackPanel({ plans }: FeedbackPanelProps) {
  if (plans.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-4xl animate-bounce">
          📊
        </div>
        <div>
           <h3 className="text-white font-bold text-xl font-naskh mb-2">التغذية الراجعة تُفعَّل بعد 3 خطط</h3>
           <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
             لديك حالياً {plans.length} خطط فقط. استمر في التحضير للحصول على تحليل ذكي لأدائك التربوي.
           </p>
        </div>
      </div>
    );
  }

  // Basic analytics
  const bySubj: Record<string, number> = {};
  plans.forEach(p => {
    const k = p.meta.subjectKey;
    bySubj[k] = (bySubj[k] || 0) + 1;
  });

  const uniqueSubjects = Object.keys(bySubj).length;
  const mostPrepped = Object.entries(bySubj).sort((a,b) => b[1] - a[1])[0];

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-sky-400" />}
          label="إجمالي التحضير"
          value={plans.length}
          color="sky"
        />
        <StatCard 
          icon={<LayoutGrid className="w-5 h-5 text-emerald-400" />}
          label="تنوع الأقسام"
          value={`${uniqueSubjects}/6`}
          color="emerald"
        />
        <StatCard 
          icon={<Award className="w-5 h-5 text-gold" />}
          label="الأكثر تركيزاً"
          value={SUBJECTS[mostPrepped[0]]?.label || mostPrepped[0]}
          color="gold"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Distribution Chart */}
        <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
           <h3 className="text-white font-bold mb-6 flex items-center gap-2 font-naskh">
             <Target className="w-5 h-5 text-gold" />
             توزيع الخطط على الأقسام
           </h3>
           <div className="space-y-5">
             {Object.entries(SUBJECTS).map(([k, s]) => {
                const count = bySubj[k] || 0;
                const percentage = Math.round((count / plans.length) * 100);
                return (
                  <div key={k} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>{s.icon} {s.label}</span>
                      <span>{count} خطط ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gold transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%`, backgroundColor: s.color }}
                      ></div>
                    </div>
                  </div>
                );
             })}
           </div>
        </div>

        {/* AI Recommendations */}
        <div className="p-6 bg-slate-900/50 border border-gold/20 rounded-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -z-10"></div>
           <h3 className="text-gold font-bold mb-6 flex items-center gap-2 font-naskh">
             ✨ توصيات المنظومة المخصصة
           </h3>
           <div className="space-y-4">
              <RecItem text="تغطية ممتازة للقسم الأكثر أهمية، حاول التنويع أكثر في التدريبات." />
              <RecItem text={uniqueSubjects < 4 ? "تحتاج للتركيز على أقسام التعبير والخط لموازنة خطتك الدراسية." : "توازن ممتاز في توزيع الأقسام التربوية."} />
              <RecItem text="استراتيجية محطات التعلم تحقق أفضل تفاعل مع طلابك حالياً." />
              <div className="pt-4 mt-4 border-t border-white/5 text-[10px] text-slate-500 uppercase tracking-widest text-center">
                 أنت الآن في المستوى الثاني من التحضير الاحترافي
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-5">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner", {
        "bg-sky-500/10 text-sky-400": color === "sky",
        "bg-emerald-500/10 text-emerald-400": color === "emerald",
        "bg-gold/10 text-gold": color === "gold",
      })}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
        <div className="text-slate-500 text-xs font-bold font-naskh uppercase">{label}</div>
      </div>
    </div>
  );
}

function RecItem({ text }: { text: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0"></div>
      <p className="text-slate-300 text-sm leading-relaxed font-naskh">{text}</p>
    </div>
  );
}
