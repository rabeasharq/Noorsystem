/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Rocket, ShieldCheck, Database, FileText, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export function GuidePanel() {
  const sections = [
    { 
      id: 1,
      icon: <Rocket className="w-5 h-5 text-sky-400" />,
      title: "نظرة عامة على المنظومة",
      body: "منظومة نور هي منصة متكاملة لمعلمي اللغة العربية في اليمن. صُممت لتعمل محلياً بالكامل (Offline-first) للحفاظ على خصوصيتك وضمان السرعة حتى بدون إنترنت."
    },
    { 
      id: 2,
      icon: <Zap className="w-5 h-5 text-gold" />,
      title: "استراتيجية جيل ألفا",
      body: "نعتمد في نور على تحليل خصائص جيل ألفا المعرفية (مولودو بعد 2010)، حيث نوفر استراتيجيات مثل 'محطات التعلم' و'التلعيب' التي تزيد من معدلات التركيز والتفاعل في الفصل اليمني."
    },
    { 
      id: 3,
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      title: "التصدير والطباعة الاحترافية",
      body: "يمكنك تصدير أي خطة قمت بإنشائها إلى ملف Word جاهز للتعديل، أو طباعتها مباشرة كملف PDF بتنسيق رسمي متوافق مع متطلبات وزارة التربية والتعليم."
    },
    { 
      id: 4,
      icon: <Database className="w-5 h-5 text-rose-400" />,
      title: "إدارة البيانات والأمان",
      body: "بياناتك محفوظة في قاعدة بيانات محلية (IndexedDB) بمتصفحك. ننصح دائماً بتصدير نسخة احتياطية (عبر لوحة الأمان) كل أسبوع لضمان عدم فقدان أعمالك في حال مسح متصفحك."
    },
    { 
      id: 5,
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
      title: "الخصوصية المطلقة",
      body: "لا يتم إرسال أي معلومة (اسمك، مدرستك، تحضيرك) لأي خادم. كل شيء يتم معالجته وحفظه داخل جهازك الشخصي فقط."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="text-center mb-10">
        <HelpCircle className="w-16 h-16 text-gold/20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white font-naskh">دليل الاستخدام والتشغيل</h2>
        <p className="text-slate-500 text-sm mt-2">تعرف على كيفية استغلال كافة مميزات منظومة نور</p>
      </div>

      <div className="space-y-3">
        {sections.map(s => (
          <AccordionItem key={s.id} {...s} />
        ))}
      </div>

      <div className="mt-12 p-6 bg-slate-900/50 border border-white/5 rounded-3xl text-center">
        <p className="text-slate-500 text-xs leading-relaxed">
          نحن في مرحلة التطوير المستمر. الإصدار القادم سيشمل:<br/>
          دعم الذكاء الاصطناعي لتوليد المقترحات القرائية · الربط مع السحابة للتنقل بين الأجهزة · مكتبة نماذج جاهزة
        </p>
      </div>
    </div>
  );
}

function AccordionItem({ title, icon, body }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all", open && "border-white/20 bg-white/[0.08]")}>
      <button 
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-center justify-between text-right outline-none"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
          <span className="text-white font-bold font-naskh">{title}</span>
        </div>
        <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <div className="h-px bg-white/5 mb-4"></div>
          <p className="text-slate-400 text-sm leading-relaxed font-naskh pr-12">
            {body}
          </p>
        </div>
      )}
    </div>
  );
}
