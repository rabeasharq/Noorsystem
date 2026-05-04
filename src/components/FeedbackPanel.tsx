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
    <div className="space-y-10 pb-32 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-bold text-white flex items-center gap-4 font-naskh">
             <BarChart3 className="w-10 h-10 text-gold" />
             مركز تحليل الأداء التعليمي
           </h2>
           <p className="text-slate-500 text-sm mt-2 font-naskh">رصد حي لتفاعل الطلاب وتطور مهاراتهم اللغوية باستخدام الذكاء التحليلي</p>
        </div>
        <div className="hidden md:flex flex-col items-end">
           <div className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] mb-1">تحديث المنظومة</div>
           <div className="text-xs text-emerald-500 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE_SYSTEM_SYNCED
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />}
          label="المشاريع المكتملة"
          subLabel="إجمالي الخطط"
          value={plans.length}
          color="sky"
        />
        <StatCard 
          icon={<Users className="w-6 h-6" />}
          label="القوة البشرية"
          subLabel="عدد الطلاب"
          value={students.length}
          color="emerald"
        />
        <StatCard 
          icon={<Trophy className="w-6 h-6" />}
          label="الكفاءة العامة"
          subLabel="متوسط النقاط"
          value={avgPoints}
          color="gold"
        />
        <StatCard 
          icon={<LayoutGrid className="w-6 h-6" />}
          label="رأس المال المعرفي"
          subLabel="إجمالي النقاط"
          value={totalPoints}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Trend Chart */}
        <div className="lg:col-span-2 glass-panel p-10 h-[450px] flex flex-col relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] -z-10 group-hover:bg-sky-500/10 transition-colors"></div>
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-white text-xl font-bold flex items-center gap-4 font-naskh">
                <BarChart3 className="w-6 h-6 text-sky-400" />
                نبض التفاعل الصفي
              </h3>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">آخر 7 أيام</div>
           </div>
           <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickMargin={10} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} 
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPoints)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Categories Pie */}
        <div className="glass-panel p-10 h-[450px] flex flex-col relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
           <h3 className="text-white text-xl font-bold mb-10 flex items-center gap-4 font-naskh">
             <PieIcon className="w-6 h-6 text-emerald-400" />
             توزيع الكفايات
           </h3>
           <div className="flex-1 w-full flex items-center justify-center">
              {catData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={catData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {catData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} 
                    />
                    <Legend verticalAlign="bottom" height={40} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-600 text-xs italic font-naskh">بيانات الأنشطة قيد المعالجة...</div>
              )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Top Performers */}
        <div className="lg:col-span-2 glass-panel p-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-white text-xl font-bold flex items-center gap-4 font-naskh">
                <Trophy className="w-6 h-6 text-gold" />
                نخبة جيل ألفا
              </h3>
              <button className="text-[10px] text-gold font-bold uppercase tracking-widest hover:underline transition-all">تصدير التقرير الكامل</button>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {topStudents.map((s, idx) => (
                <div key={s.id} className="glass-card p-5 group flex items-center justify-between hover:bg-white/[0.06] hover:scale-[1.01]">
                   <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-2xl border border-white/5 transition-transform group-hover:rotate-12">
                          👤
                        </div>
                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-gold text-slate-950 rounded-lg flex items-center justify-center text-xs font-black shadow-lg">
                          #{idx+1}
                        </div>
                      </div>
                      <div>
                         <div className="text-white font-bold text-lg font-naskh mb-0.5">{s.name}</div>
                         <div className="flex items-center gap-3">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">الصف {s.grade}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">{s.points} PTS</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-8">
                      <div className="hidden md:flex -space-x-3 rtl:space-x-reverse">
                         {s.badges.slice(0, 3).map((b, i) => (
                            <div key={i} className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-sm shadow-xl hover:-translate-y-1 transition-all cursor-help" title={b}>
                               ⭐️
                            </div>
                         ))}
                         {s.badges.length > 3 && (
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                               +{s.badges.length - 3}
                            </div>
                         )}
                      </div>
                      <div className="h-10 w-[1px] bg-white/10"></div>
                      <div className="text-right">
                         <div className="text-gold text-2xl font-black font-mono">
                            {Math.round((s.points / totalPoints) * 100 || 0)}%
                         </div>
                         <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">إمكانية القيادة</div>
                      </div>
                   </div>
                </div>
              ))}
              {students.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-slate-600 italic font-naskh">
                   لا توجد كفاءات مسجلة حالياً
                </div>
              )}
           </div>
        </div>

        {/* Actionable Insights */}
        <div className="p-1 glass-panel rounded-[32px] overflow-hidden group">
           <div className="bg-gradient-to-b from-gold/20 to-transparent p-10 h-full flex flex-col relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 blur-[50px] group-hover:opacity-40 transition-opacity"></div>
              
              <h3 className="text-gold font-bold text-xl mb-10 flex items-center gap-3 font-naskh">
                <Target className="w-6 h-6" />
                رؤى الذكاء التحليلي
              </h3>
              
              <div className="space-y-6 flex-1">
                 <RecItem text="تم رصد نمو بنسبة 15% في تفاعل الطلاب عند دمج السرد القصصي في دروس النحو." />
                 <RecItem text="هناك استقرار في مستوى 'الصف السابع'؛ يُقترح رفع مستوى التحدي بـ 'رعد التعلم السريع'." />
                 <RecItem text="الطلاب المتميزون يفضلون دور 'المعلم الصغير'؛ استثمر هذا لتعزيز الأقران المتعثرين." />
              </div>

              <div className="pt-10 mt-10 border-t border-white/5">
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-6 text-center">الخطة القادمة مقترحة</div>
                 <div className="flex flex-wrap gap-2 justify-center">
                    {['البطل اللغوي', 'التحدي الذكي', 'الربط الثقافي'].map(label => (
                      <span key={label} className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-bold font-naskh hover:bg-gold hover:text-slate-950 transition-all cursor-default">
                        {label}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, subLabel, value, color }: any) {
  return (
    <div className="glass-panel p-8 flex flex-col gap-6 group hover:border-white/20 transition-all cursor-default relative overflow-hidden">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-[360deg]", {
        "bg-sky-500/10 text-sky-400 border border-sky-500/20": color === "sky",
        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20": color === "emerald",
        "bg-gold/10 text-gold border border-gold/20": color === "gold",
        "bg-rose-500/10 text-rose-400 border border-rose-500/20": color === "rose",
      })}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{subLabel}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-black text-white">{value}</div>
          <div className="text-xs text-slate-400 font-naskh font-bold">{label}</div>
        </div>
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
