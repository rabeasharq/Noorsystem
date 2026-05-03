/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { BackupPanel } from "./components/BackupPanel";
import { useNoor } from "./hooks/useNoor";
import { AnimatePresence, motion } from "framer-motion";
import { NoorDB } from "./lib/db";
import { buildPlan } from "./lib/engine";

// Sub-panels (Placeholder logic until split)
// In a full production env, these would be separate files
function FormPanel({ onGenerate }: any) { return <div className="p-8 text-slate-400 text-center font-naskh">سيتم تفعيل لوحة الإدخال الاحترافية...</div>; }

export default function App() {
  const [view, setView] = useState("form");
  const [activePlan, setActivePlan] = useState<any>(null);
  const [toast, setToast] = useState<{msg:string, type:'success'|'error'|'info'} | null>(null);
  const { plans, refresh, isLoading } = useNoor();

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = (form: any) => {
    try {
      const plan = buildPlan(form);
      setActivePlan(plan);
      setView("preview");
    } catch (e) {
      showToast("فشل إنشاء الخطة. تأكد من إكمال البيانات الأساسية.", "error");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#080c1a]">
      <Sidebar view={view} setView={setView} plansCount={plans.length} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-white/5 bg-[#0f1528] flex items-center justify-between px-8 no-print shrink-0">
           <h2 className="text-xl font-bold text-white font-naskh">
             {view === "form" && "إنشاء تحضير جديد"}
             {view === "history" && "سجل الخطط المحفوظة"}
             {view === "backup" && "إدارة البيانات والأمان"}
           </h2>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === "form" && <FormPanel onGenerate={handleGenerate} />}
              {view === "backup" && <BackupPanel onImported={refresh} toast={showToast} />}
              
              {/* Fallback info */}
              {(view === "history" || view === "feedback") && (
                <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
                  <div className="text-4xl mb-4">🏗️</div>
                  <h3 className="text-white font-bold text-lg mb-2">قيد التطوير النهائي</h3>
                  <p className="text-slate-500 text-sm">يتم العمل حالياً على أتمتة هذه اللوحة لتكون متوافقة مع أداء النسخة 1.1</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[9999] border ${
                toast.type === 'success' ? 'bg-emerald-600 border-emerald-400' : 
                toast.type === 'error' ? 'bg-rose-600 border-rose-400' : 'bg-slate-800 border-slate-600'
              } text-white font-bold font-naskh flex items-center gap-3`}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
