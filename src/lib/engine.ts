/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LessonPlanForm, LessonPlan, LessonPlanStage } from "../types";
import { GRADES, SUBJECTS, LESSON_TYPES, INTRO_TYPES, ALPHA_STRATEGIES, CHALLENGES, PERIODS } from "../constants/data";
import { OBJECTIVES, ERRORS, ASSESSMENTS, STRATEGIES, TOOLS, HOMEWORK } from "../constants/content";
import { formatDateArabic } from "./utils";

/**
 * Stage builder constant
 */
function buildStages(subject: string, grade: string, duration: number): LessonPlanStage[] {
  const G = parseInt(grade);
  const T = duration === 35
    ? { intro: 7, present: 13, practice: 10, assess: 5 }
    : { intro: 5, present: 12, practice: 8, assess: 5 };

  const genericClose = ["تلخيص القاعدة بمشاركة الطلاب", "سؤالان تقييميان سريعان", "تعزيز الطلاب المتميزين", "توجيه الواجب المنزلي"];

  const stagesMap: Record<string, LessonPlanStage[]> = {
    grammar: [
      { name: "التهيئة والمراجعة", t: T.intro, acts: G === 7 ? ["مراجعة سريعة بأسئلة شفهية", "تهيئة بمثال من البيئة اليمنية"] : ["مناقشة سريعة ومراجعة تطبيقية"], color: "#e8f4f8" },
      { name: "العرض والشرح", t: T.present, acts: ["عرض الأمثلة", "استنباط القاعدة"], color: "#e8f8f0" },
      { name: "التطبيق والممارسة", t: T.practice, acts: ["تطبيقات فردية", "لعبة لغوية"], color: "#fef9e7" },
      { name: "التقييم والخلاصة", t: T.assess, acts: genericClose, color: "#fdf2f8" },
    ]
    // Add more mappings as needed or keep flexible
  };

  return stagesMap[subject] || stagesMap.grammar;
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

  const errors = ERRORS[form.subject]?.[gn] || [];
  const remedies = errors.map(() => "تصحيح فوري بأسلوب التساؤل ثم مثال تصحيحي مقابل");
  
  const challengeRecs = (form.classProblems || [])
    .flatMap(k => CHALLENGES[k]?.recs || []);

  return {
    id: Date.now(),
    form,
    meta: {
      grade: g.label,
      gradeNum: gn,
      gradeCode: g.code,
      subject: sub.label,
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
      level: g.level,
      bloom: g.bloom,
      cogNote: g.cog,
      lessonTypeLabel: LESSON_TYPES[ltk as keyof typeof LESSON_TYPES]?.label || "",
      introTypeLabel: INTRO_TYPES[itk as keyof typeof INTRO_TYPES]?.label || "",
      alphaLabel: ALPHA_STRATEGIES[ask as keyof typeof ALPHA_STRATEGIES]?.label || "",
      color: g.color,
      accent: g.accent,
      light: g.light,
    },
    objectives,
    strategies: STRATEGIES[form.subject]?.[gn] || [],
    tools: TOOLS[form.subject]?.[gn] || [],
    stages: buildStages(form.subject, form.grade, parseInt(form.duration)),
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
      `الكتاب المدرسي للغة العربية — ${g.label}`,
      "دليل المعلم — وزارة التربية والتعليم اليمنية",
      "معجم الوسيط",
    ],
  };
}
