/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { APP_NAME, APP_VERSION } from "../constants/data";
import { LayoutDashboard, FilePlus, Folders, BarChart3, BookOpen, ShieldOff } from "lucide-react";

interface SidebarProps {
  view: string;
  setView: (v: string) => void;
  plansCount: number;
}

export function Sidebar({ view, setView, plansCount }: SidebarProps) {
  const nav = [
    { key: "form", icon: <FilePlus className="w-5 h-5"/>, label: "خطة جديدة" },
    { key: "history", icon: <Folders className="w-5 h-5"/>, label: "خططي", badge: plansCount },
    { key: "feedback", icon: <BarChart3 className="w-5 h-5"/>, label: "التغذية الراجعة" },
    { key: "backup", icon: <ShieldOff className="w-5 h-5"/>, label: "الأمان والنسخ" },
    { key: "guide", icon: <BookOpen className="w-5 h-5"/>, label: "الدليل" },
  ];

  return (
    <div className="w-64 bg-[#0f1528] border-l border-white/10 flex flex-col h-screen h-full no-print">
      <div className="p-6 border-b border-white/5">
        <div className="text-gold font-bold text-2xl flex items-center gap-2">
          <span>📚</span> {APP_NAME}
        </div>
        <div className="text-slate-500 text-xs mt-1">منظومة تحضير اللغة العربية</div>
        <div className="text-slate-700 text-[10px] mt-2 uppercase tracking-widest">Version {APP_VERSION}</div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {nav.map((item) => {
          const isActive = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-gold/10 border border-gold/30 text-gold shadow-[0_0_15px_rgba(240,192,64,0.1)]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-naskh text-sm font-semibold">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-gold text-[#1a0a2a] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <div className="text-[11px] text-slate-500 leading-relaxed font-naskh">
           اليمن · وزارة التربية والتعليم<br/>
           تم التطوير محلياً لدعم المعلم اليمني
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] text-emerald-500 font-bold uppercase">Online & Persistent</span>
        </div>
      </div>
    </div>
  );
}
