/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { NoorDB } from "../lib/db";
import { downloadFile } from "../lib/utils";
import { Download, Upload, ShieldCheck, AlertTriangle } from "lucide-react";

interface BackupPanelProps {
  onImported: () => void;
  toast: (msg: string, type?: "success" | "error") => void;
}

export function BackupPanel({ onImported, toast }: BackupPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const data = await NoorDB.exportData();
      const fileName = `noor_backup_${new Date().toISOString().split("T")[0]}.json`;
      downloadFile(data, fileName, "application/json");
      toast("تم تصدير النسخة الاحتياطية بنجاح", "success");
    } catch (e) {
      toast("فشل تصدير البيانات", "error");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("تحذير: سيتم دمج البيانات المستوردة مع بياناتك الحالية. هل تريد الاستمرار؟")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = event.target?.result as string;
        await NoorDB.importData(json);
        toast("تم استيراد البيانات بنجاح", "success");
        onImported();
      } catch (err) {
        toast("فشل استيراد الملف. تأكد من صحة التنسيق.", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">الأمان والنسخ الاحتياطي</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export */}
        <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
            <Download className="w-4 h-4" /> تصدير نسخة احتياطية
          </h3>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">
            قم بتنزيل ملف يحتوي على كافة خططك وإعداداتك. يمكنك الاحتفاظ به في مكان آمن أو نقله لجهاز آخر.
          </p>
          <button 
            onClick={handleExport}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors"
          >
            تصدير البيانات الآن
          </button>
        </div>

        {/* Import */}
        <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" /> استعادة نسخة احتياطية
          </h3>
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">
            قم برفع ملف النسخة الاحتياطية (.json) لاستعادة بياناتك السابقة.
          </p>
          <input 
            type="file" 
            ref={fileRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />
          <button 
            onClick={() => fileRef.current?.click()}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-colors"
          >
            اختيار ملف الاستعادة
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 bg-slate-800/80 rounded-xl border border-slate-700">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <b className="text-slate-200 block mb-1">تعليمات هامة:</b>
          • البيانات تُخزن حالياً في متصفحك فقط. مسح بيانات المتصفح (History) قد يؤدي لفقدانها.<br/>
          • ننصح بتصدير نسخة احتياطية دورية (أسبوعياً) لضمان عدم فقدان أعمالك.<br/>
          • يمكنك استيراد الملفات المصدرة من أي إصدار سابق للمنظومة.
        </div>
      </div>
    </div>
  );
}
