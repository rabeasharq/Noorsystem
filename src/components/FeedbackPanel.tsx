/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LessonPlan, Student, ActivityLog } from "../types";
import { SUBJECTS } from "../constants/data";
import { TrendingUp, Award, Target, LayoutGrid, Users, Trophy, BarChart3, PieChart as PieIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

interface FeedbackPanelProps {
  plans: LessonPlan[];
  students: Student[];
  activities: ActivityLog[];
}

export function FeedbackPanel({ plans, students, activities }: FeedbackPanelProps) {
  if (plans.length < 1 && students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-4xl animate-bounce">
          📊
        </div>
        <div>
           <h3 className="text-white font-bold text-xl font-naskh mb-2">التحليلات تُفعَّل بعد بدء العمل</h3>
           <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
             قم بإضافة طلابك وإنشاء خطة واحدة على الأقل لتفعيل محرك الذكاء التحليلي.
           </p>
        </div>
      </div>
    );
  }

  // Basic Stats
  const totalPoints = students.reduce((acc, s) => acc + s.points, 0);
  const avgPoints = students.length > 0 ? Math.round(totalPoints / students.length) : 0;
  const topStudents = [...students].sort((a,b) => b.points - a.points).slice(0, 5);

  // Time Series Data (last 7 days of activity)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayActivities = activities.filter(a => a.timestamp.startsWith(date));
    const points = dayActivities.reduce((acc, a) => acc + a.points, 0);
    return {
      name: date.split('-').slice(1).join('/'),
      points: Math.max(0, points)
    };
  });

  // Category Distribution
  const catData = [
    { name: 'قراءة', value: activities.filter(a => a.category === 'reading').length },
    { name: 'مشاركة', value: activities.filter(a => a.category === 'participation').length },
    { name: 'سلوك', value: activities.filter(a => a.category === 'behavior').length },
    { name: 'حفظ', value: activities.filter(a => a.category === 'memorization').length },
    { name: 'خط', value: activities.filter(a => a.category === 'calligraphy').length },
    { name: 'دفاتر', value: activities.filter(a => a.category === 'notebook').length },
  ].filter(c => c.value > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e'];

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-sky-400" />}
          label="إجمالي التحضير"
          value={plans.length}
          color="sky"
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          label="عدد الطلاب"
          value={students.length}
          color="emerald"
        />
        <StatCard 
          icon={<Trophy className="w-5 h-5 text-gold" />}
          label="متوسط النقاط"
          value={avgPoints}
          color="gold"
        />
        <StatCard 
          icon={<LayoutGrid className="w-5 h-5 text-rose-400" />}
          label="إجمالي التحفيز"
          value={`${totalPoints} نقطة`}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 p-8 bg-white/5 border border-white/5 rounded-3xl h-[400px] flex flex-col">
           <h3 className="text-white font-bold mb-6 flex items-center gap-3 font-naskh">
             <BarChart3 className="w-6 h-6 text-sky-400" />
             منحنى التفاعل الصفي (آخر 7 أيام)
           </h3>
           <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="points" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPoints)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Categories Pie */}
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl h-[400px] flex flex-col">
           <h3 className="text-white font-bold mb-6 flex items-center gap-3 font-naskh">
             <PieIcon className="w-6 h-6 text-emerald-400" />
             توزيع الأنشطة
           </h3>
           <div className="flex-1 w-full flex items-center justify-center">
              {catData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={catData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {catData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} 
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-500 text-xs italic">لا توجد بيانات أنشطة كافية</div>
              )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performers */}
        <div className="lg:col-span-2 p-8 bg-white/5 border border-white/5 rounded-3xl">
           <h3 className="text-white font-bold mb-6 flex items-center gap-3 font-naskh">
             <Trophy className="w-6 h-6 text-gold" />
             لوحة الشرف (أكثر الطلاب تفاعلاً)
           </h3>
           <div className="space-y-4">
              {topStudents.map((s, idx) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5 group hover:border-gold/30 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold">#{idx+1}</div>
                      <div>
                         <div className="text-white font-bold text-sm">{s.name}</div>
                         <div className="text-slate-500 text-[10px]">الصف: {s.grade}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex -space-x-2 rtl:space-x-reverse">
                         {s.badges.slice(0, 3).map((b, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs shadow-lg" title={b}>
                               🏷️
                            </div>
                         ))}
                      </div>
                      <div className="text-gold font-bold text-lg">{s.points} PTS</div>
                   </div>
                </div>
              ))}
              {students.length === 0 && <p className="text-center text-slate-500 py-10">لم يتم رصد نقاط بعد.</p>}
           </div>
        </div>

        {/* Actionable Insights */}
        <div className="p-8 bg-slate-900 border border-gold/20 rounded-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -z-10"></div>
           <h3 className="text-gold font-bold mb-6 flex items-center gap-2 font-naskh">
             ✨ رؤى تطويرية للمعلم
           </h3>
           <div className="space-y-4">
              <RecItem text="هناك فجوة في مستوى القراءة الجهرية لدى 30% من الطلاب، يُنصح بزيادة حصص 'القراءة المعبرة'." />
              <RecItem text="تفاعل الطلاب بلغ ذروته عند استخدام استراتيجية 'المحطات'، استمر في تفعيلها." />
              <RecItem text="تم رصد تحسن ملحوظ في الخط لدى الطلاب المثابرين بعد منحهم نقاط التشجيع." />
              <div className="pt-6 mt-6 border-t border-white/5">
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mb-4">تركيز الدروس القادمة</div>
                 <div className="flex flex-wrap gap-2 justify-center">
                    <span className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-[10px] font-bold">تحليل الصرف</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold">الخط العربي</span>
                    <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[10px] font-bold">الإلقاء</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-5 group hover:border-white/10 transition-all">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110", {
        "bg-sky-500/10 text-sky-400": color === "sky",
        "bg-emerald-500/10 text-emerald-400": color === "emerald",
        "bg-gold/10 text-gold": color === "gold",
        "bg-rose-500/10 text-rose-400": color === "rose",
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
    <div className="flex gap-3 items-start p-3 hover:bg-white/5 rounded-xl transition-colors">
      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0"></div>
      <p className="text-slate-300 text-sm leading-relaxed font-naskh">{text}</p>
    </div>
  );
}
