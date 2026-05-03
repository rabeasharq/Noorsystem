/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LessonPlanForm, LessonPlan, LessonPlanStage } from "../types";
import { GRADES, SUBJECTS, LESSON_TYPES, INTRO_TYPES, ALPHA_STRATEGIES, CHALLENGES, PERIODS } from "../constants/data";
import { OBJECTIVES, ERRORS, ASSESSMENTS, STRATEGIES, TOOLS, HOMEWORK } from "../constants/content";
import { formatDateArabic } from "./utils";

/**
 * Builds smart pedagogical stages based on subject and grade
 */
function getSmartStages(subject: string, grade: string, duration: number, lessonType: string): LessonPlanStage[] {
  const G = parseInt(grade);
  const T = duration === 35
    ? { intro: 6, present: 14, practice: 10, assess: 5 }
    : { intro: 5, present: 12, practice: 8, assess: 5 };

  const close = ["استنتاج القاعدة النهائية", "سؤال 'تحدي ألفا' سريع", "توزيع نقاط التميز", "تحديد مهمة الواجب"];

  // Logic per subject
  if (subject === 'grammar') {
    return [
      { name: "العصف الذهني والتمهيد", t: T.intro, acts: ["عرض جملة إشكالية من الواقع اليمني", "استثارة المعلومات اللاحقة", "تحديد هدف الرحلة النحوية"], color: "#e0f2fe" },
      { name: "الاستنباط والنمذجة", t: T.present, acts: ["قراءة الأمثلة الشاهدة", "ملاحظة الظاهرة بالتلوين", "بناء القاعدة بمشاركة الطلاب", "توضيح المفاهيم الدقيقة"], color: "#f0fdf4" },
      { name: "محطات التطبيق (جيل ألفا)", t: T.practice, acts: ["نشاط 'المكتشف الصغير'", "تدريبات متدرجة (سهل/صعب)", "تصحيح تبادلي فوري"], color: "#fefce8" },
      { name: "الخاتمة والتقييم", t: T.assess, acts: close, color: "#fdf2f8" },
    ];
  }

  if (subject === 'texts' || subject === 'reading') {
    return [
      { name: "التهيئة النفسية والقرائية", t: T.intro, acts: ["عرض صورة أو مشهد محفز", "توقع أحداث النص", "كسر الجمود الأدبي"], color: "#e0f2fe" },
      { name: "القراءة التحليلية", t: T.present, acts: ["قراءة جهرية نموذجية", "تفكيك الوحدات المعنوية", "تحليل الجماليات والصور", "شرح المفردات بالسياق"], color: "#f0fdf4" },
      { name: "التفاعل النقدي والإبداعي", t: T.practice, acts: ["استخراج القيم المستفادة", "ربط النص بالواقع اليمني", "نشاط 'لو كنت مكان الكاتب'"], color: "#fefce8" },
      { name: "إغلاق الحصة", t: T.assess, acts: close, color: "#fdf2f8" },
    ];
  }

  if (subject === 'dictation' || subject === 'calligraphy') {
    return [
      { name: "الملاحظة البصرية", t: T.intro, acts: ["تأمل الحروف/الكلمات المستهدفة", "تحليل الشكل والمبنى"], color: "#e0f2fe" },
      { name: "المحاكاة والنمذجة", t: T.present, acts: ["كتابة النموذج على السبورة", "شرح قواعد الرسم الصحيح"], color: "#f0fdf4" },
      { name: "التدريب العملي متناهي الصغر", t: T.practice, acts: ["تطبيق 'الخمس دقائق' المركزة", "تحسين النموذج تدريجياً"], color: "#fefce8" },
      { name: "التقييم الجمالي", t: T.assess, acts: close, color: "#fdf2f8" },
    ];
  }

  // Default fallback
  return [
    { name: "التمهيد", t: T.intro, acts: ["تهيئة مشوقة للطلاب"], color: "#e0f2fe" },
    { name: "العرض", t: T.present, acts: ["شرح المحتوى الأساسي"], color: "#f0fdf4" },
    { name: "التطبيق", t: T.practice, acts: ["تمارين تطبيقية"], color: "#fefce8" },
    { name: "الخاتمة", t: T.assess, acts: ["تقليل وتلخيص"], color: "#fdf2f8" },
  ];
}

/**
 * Main Engine: Builds the full LessonPlan object from raw form data
 */
export function buildPlan(form: LessonPlanForm): LessonPlan {
  const g = GRADES[parseInt(form.grade)];
  const gn = parseInt(form.grade);
  const sub = SUBJECTS[form.subject];
  const itk = form.introType || "real_life";
  const ltk = form.lessonType || "inductive";
  const ask = form.alphaStrategy || "stations";

  const objectives = (OBJECTIVES[form.subject]?.[gn] || [])
    .map(o => `${o} ${form.lessonTitle}`);

  const errors = ERRORS[form.subject]?.[gn] || ["خطأ في الفهم العام"];
  const remedies = errors.map(() => "تصحيح فوري بأسلوب المقارنة والمقابلة والتعزيز البصري");
  
  const challengeRecs = (form.classProblems || [])
    .flatMap(k => CHALLENGES[k]?.recs || []);

  return {
    id: Date.now(),
    form,
    meta: {
      grade: g?.label || "غير محدد",
      gradeNum: gn,
      gradeCode: g?.code || "GX",
      subject: sub?.label || "عربي",
      subjectKey: form.subject,
      subType: form.subType || "",
      lessonTitle: form.lessonTitle,
      bookUnit: form.bookUnit || "",
      teacherName: form.teacherName || "",
      schoolName: form.schoolName || "",
      supervisorName: form.supervisorName || "",
      day: form.day,
      period: form.period ? PERIODS[parseInt(form.period) - 1] : "",
      periodNum: form.period || "",
      date: formatDateArabic(form.date),
      rawDate: form.date,
      duration: form.duration,
      week: form.week || "1",
      level: g?.level || "",
      bloom: g?.bloom || "",
      cogNote: g?.cog || "",
      lessonTypeLabel: LESSON_TYPES[ltk as keyof typeof LESSON_TYPES]?.label || "",
      introTypeLabel: INTRO_TYPES[itk as keyof typeof INTRO_TYPES]?.label || "",
      alphaLabel: ALPHA_STRATEGIES[ask as keyof typeof ALPHA_STRATEGIES]?.label || "",
      color: g?.color || "#1b3f7a",
      accent: g?.accent || "#3d8ef0",
      light: g?.light || "#e8f2ff",
    },
    objectives,
    strategies: STRATEGIES[form.subject]?.[gn] || [],
    tools: TOOLS[form.subject]?.[gn] || [],
    stages: getSmartStages(form.subject, form.grade, parseInt(form.duration), ltk),
    alphaStrategy: ALPHA_STRATEGIES[ask as keyof typeof ALPHA_STRATEGIES]?.label || "",
    alphaDesc: ALPHA_STRATEGIES[ask as keyof typeof ALPHA_STRATEGIES]?.desc || "",
    introLabel: INTRO_TYPES[itk as keyof typeof INTRO_TYPES]?.label || "",
    introEx: INTRO_TYPES[itk as keyof typeof INTRO_TYPES]?.ex || "",
    lessonTypeLabel: LESSON_TYPES[ltk as keyof typeof LESSON_TYPES]?.label || "",
    lessonTypeDesc: LESSON_TYPES[ltk as keyof typeof LESSON_TYPES]?.desc || "",
    expectedErrors: errors,
    errorRemedies: remedies,
    assessments: ASSESSMENTS[form.subject]?.[gn] || [],
    homework: HOMEWORK[form.subject]?.[gn] || "",
    challengeRecs,
    references: [
      `الكتاب المدرسي للغة العربية — ${g?.label || ""}`,
      "دليل المعلم التربوي اليمني",
      "معجم الوسيط والموارد الرقمية للمنظومة",
    ],
  };
}
