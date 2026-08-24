import {
  ASSESSMENT_TYPE,
  ACADEMIC_LEVEL,
  DIFFICULTY,
  QUESTION_SOURCE,
  QUESTION_STATUS,
  QUESTION_TYPE,
  TOPIC,
  WORK_STATUS,
} from '@/shared/constants/domain';
import { LANGUAGE } from '@/shared/i18n/languages';

/**
 * Seed data for the mock layer.
 *
 * Content fields are bilingual objects because the real product stores questions
 * per language; the UI reads them through `tx()`. Everything enum-like is a code
 * translated in the UI through `t()`.
 */

const question = (id, en, ar, rest) => ({ id, text: { en, ar }, ...rest });

export const seed = {
  questions: [
    question('QB-1042', 'Which JOIN returns only matching rows?', 'أي JOIN بيرجّع الصفوف المتطابقة بس؟', {
      type: QUESTION_TYPE.SINGLE,
      topic: TOPIC.JOINS,
      difficulty: DIFFICULTY.EASY,
      marks: 1,
      language: LANGUAGE.EN,
      answer: { options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN'], correct: 'INNER JOIN' },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
    question(
      'QB-1043',
      'Explain the result of a LEFT JOIN when no match exists.',
      'اشرح نتيجة LEFT JOIN لما ما يكونش فيه تطابق.',
      {
        type: QUESTION_TYPE.SHORT,
        topic: TOPIC.JOINS,
        difficulty: DIFFICULTY.MEDIUM,
        marks: 3,
        language: LANGUAGE.EN,
        answer: { modelAnswer: 'The right side columns come back as NULL.' },
        source: QUESTION_SOURCE.AI,
        status: QUESTION_STATUS.IN_REVIEW,
      },
    ),
    question('QB-1044', 'Choose all aggregate functions.', 'اختار كل دوال التجميع.', {
      type: QUESTION_TYPE.MULTIPLE,
      topic: TOPIC.AGGREGATION,
      difficulty: DIFFICULTY.EASY,
      marks: 2,
      language: LANGUAGE.EN,
      answer: { options: ['SUM', 'COUNT', 'ORDER BY', 'AVG'], correct: ['SUM', 'COUNT', 'AVG'] },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.DRAFT,
    }),
    question('QB-1045', 'Calculate the output of this grouped query.', 'احسب ناتج الاستعلام المجمَّع ده.', {
      type: QUESTION_TYPE.NUMERIC,
      topic: TOPIC.AGGREGATION,
      difficulty: DIFFICULTY.HARD,
      marks: 4,
      language: LANGUAGE.EN,
      answer: { correct: 42 },
      source: QUESTION_SOURCE.AI,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1051', 'Which clause filters groups after aggregation?', 'أي جملة بتفلتر المجموعات بعد التجميع؟', {
      type: QUESTION_TYPE.MULTIPLE,
      topic: TOPIC.GROUP_BY,
      difficulty: DIFFICULTY.MEDIUM,
      marks: 2,
      language: LANGUAGE.AR,
      answer: { options: ['WHERE', 'HAVING', 'GROUP BY'], correct: ['HAVING'] },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.IN_REVIEW,
    }),

    // Approved pool the assembly engine actually draws from. Two options for
    // joins/easy and aggregation/easy so equivalent forms can genuinely differ
    // in which item they picked, not just in label.
    question('QB-1060', 'A second approved easy JOINs item.', 'سؤال JOINs سهل معتمد تاني.', {
      type: QUESTION_TYPE.SINGLE,
      topic: TOPIC.JOINS,
      difficulty: DIFFICULTY.EASY,
      marks: 1,
      language: LANGUAGE.EN,
      answer: { options: ['LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'], correct: 'LEFT JOIN' },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1061', 'Explain a self JOIN in one sentence.', 'اشرح الـ self JOIN في جملة واحدة.', {
      type: QUESTION_TYPE.SHORT,
      topic: TOPIC.JOINS,
      difficulty: DIFFICULTY.MEDIUM,
      marks: 2,
      language: LANGUAGE.EN,
      answer: { modelAnswer: 'A table joined to itself using an alias.' },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1062', 'A second approved medium JOINs item.', 'سؤال JOINs متوسط معتمد تاني.', {
      type: QUESTION_TYPE.SINGLE,
      topic: TOPIC.JOINS,
      difficulty: DIFFICULTY.MEDIUM,
      marks: 2,
      language: LANGUAGE.EN,
      answer: { options: ['CROSS JOIN', 'SELF JOIN', 'NATURAL JOIN'], correct: 'SELF JOIN' },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1063', 'Rank the three most expensive JOIN strategies.', 'رتّب أغلى ٣ استراتيجيات JOIN.', {
      type: QUESTION_TYPE.SHORT,
      topic: TOPIC.JOINS,
      difficulty: DIFFICULTY.HARD,
      marks: 3,
      language: LANGUAGE.EN,
      answer: { modelAnswer: 'Depends on index coverage and table size.' },
      source: QUESTION_SOURCE.AI,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1064', 'Which function counts non-NULL rows?', 'أي دالة بتعد الصفوف غير الفاضية؟', {
      type: QUESTION_TYPE.SINGLE,
      topic: TOPIC.AGGREGATION,
      difficulty: DIFFICULTY.EASY,
      marks: 1,
      language: LANGUAGE.EN,
      answer: { options: ['COUNT', 'SUM', 'AVG'], correct: 'COUNT' },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1065', 'A second approved easy aggregation item.', 'سؤال تجميع سهل معتمد تاني.', {
      type: QUESTION_TYPE.MULTIPLE,
      topic: TOPIC.AGGREGATION,
      difficulty: DIFFICULTY.EASY,
      marks: 1,
      language: LANGUAGE.EN,
      answer: { options: ['MIN', 'MAX', 'ORDER BY'], correct: ['MIN', 'MAX'] },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1066', 'When does HAVING run relative to WHERE?', 'HAVING بتتنفذ إمتى بالنسبة لـ WHERE؟', {
      type: QUESTION_TYPE.SHORT,
      topic: TOPIC.AGGREGATION,
      difficulty: DIFFICULTY.MEDIUM,
      marks: 2,
      language: LANGUAGE.EN,
      answer: { modelAnswer: 'After grouping, WHERE runs before it.' },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1067', 'Which operator matches a pattern?', 'أي عامل بيطابق نمط نصي؟', {
      type: QUESTION_TYPE.SINGLE,
      topic: TOPIC.FILTERING,
      difficulty: DIFFICULTY.EASY,
      marks: 1,
      language: LANGUAGE.EN,
      answer: { options: ['LIKE', 'JOIN', 'GROUP BY'], correct: 'LIKE' },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
    question('QB-1068', 'Explain filtering on a NULL column.', 'اشرح الفلترة على عمود NULL.', {
      type: QUESTION_TYPE.SHORT,
      topic: TOPIC.FILTERING,
      difficulty: DIFFICULTY.MEDIUM,
      marks: 2,
      language: LANGUAGE.EN,
      answer: { modelAnswer: 'Use IS NULL / IS NOT NULL, not =.' },
      source: QUESTION_SOURCE.HUMAN,
      status: QUESTION_STATUS.APPROVED,
    }),
  ],

  counts: { total: 126, inReview: 18, approved: 94, rejected: 7 },

  blueprint: {
    assessmentId: 'current',
    name: { en: 'Course exam • SQL Fundamentals', ar: 'امتحان كورس • أساسيات SQL' },
    assessmentType: ASSESSMENT_TYPE.COURSE_EXAM,
    totalMarks: 16,
    durationMinutes: 35,
    attemptLimit: 1,
    personalized: false,
    complete: true,
    rows: [
      { topic: TOPIC.JOINS, weight: 40, easy: 1, medium: 1, hard: 1 },
      { topic: TOPIC.AGGREGATION, weight: 35, easy: 1, medium: 1, hard: 1 },
      { topic: TOPIC.FILTERING, weight: 25, easy: 1, medium: 1, hard: 0 },
    ],
  },

  readiness: [
    { topic: TOPIC.JOINS, percent: 92 },
    { topic: TOPIC.AGGREGATION, percent: 78 },
    { topic: TOPIC.FILTERING, percent: 100 },
  ],

  // Populated by runAssembly — nothing is pre-baked, so what's on screen is
  // always what the deterministic engine actually produced.
  forms: [],
  assemblyChecks: [],

  // Items used by the most recent assembly run(s), inside the current
  // (pre-CRM, Sprint 2) logical delivery scope. Consulted so a later run
  // deprioritises what a recent one already used.
  exposureLog: [],

  attempt: {
    id: 'current',
    assessmentTitle: { en: 'SQL Fundamentals • Form B', ar: 'أساسيات SQL • نموذج ب' },
    assessmentType: ASSESSMENT_TYPE.COURSE_EXAM,
    form: 'B',
    attemptNumber: 1,
    attemptLimit: 1,
    remainingSeconds: 34 * 60 + 59,
    totalQuestions: 15,
    currentIndex: 3,
    lastSavedAt: null,
    submitted: false,
    question: {
      id: 'QB-1042',
      text: {
        en: 'What happens to unmatched rows from the left table in a LEFT JOIN?',
        ar: 'إيه اللي بيحصل للصفوف غير المتطابقة من الجدول الشمال في LEFT JOIN؟',
      },
      options: [
        { id: 'o1', label: { en: 'They are removed', ar: 'بتتشال' } },
        {
          id: 'o2',
          label: {
            en: 'They remain and right-side values become NULL',
            ar: 'بتفضل والقيم من ناحية اليمين بتبقى NULL',
          },
        },
        { id: 'o3', label: { en: 'They become duplicates', ar: 'بتتكرّر' } },
      ],
    },
  },

  placements: [
    {
      id: 'session-3',
      level: ACADEMIC_LEVEL.SESSION,
      title: { en: 'Session 3 — JOINs', ar: 'الجلسة ٣ — JOINs' },
      quiz: { id: 'quiz-session-3', name: { en: 'JOINs checkpoint', ar: 'نقطة تفتيش JOINs' }, status: WORK_STATUS.OPEN },
      assignments: [
        { id: 'asg-1', name: { en: 'Practice set A', ar: 'مجموعة تدريب أ' }, status: WORK_STATUS.OPEN },
        { id: 'asg-2', name: { en: 'Practice set B', ar: 'مجموعة تدريب ب' }, status: WORK_STATUS.DRAFT },
      ],
      note: { en: 'One quiz definition per session.', ar: 'تعريف اختبار واحد لكل جلسة.' },
    },
    {
      id: 'course-sql',
      level: ACADEMIC_LEVEL.COURSE,
      title: { en: 'SQL Fundamentals', ar: 'أساسيات SQL' },
      quiz: null,
      assignments: [{ id: 'asg-3', name: { en: 'Course project', ar: 'مشروع الكورس' }, status: WORK_STATUS.OPEN }],
      note: { en: 'Parent course is shown in the student list.', ar: 'الكورس الأب بيظهر في قائمة الطالب.' },
    },
    {
      id: 'diploma-da',
      level: ACADEMIC_LEVEL.DIPLOMA,
      title: { en: 'Data Analysis Diploma', ar: 'دبلومة تحليل البيانات' },
      quiz: null,
      assignments: [{ id: 'asg-4', name: { en: 'Diploma capstone', ar: 'مشروع تخرج الدبلومة' }, status: WORK_STATUS.DRAFT }],
      note: { en: 'Cross-course scope.', ar: 'نطاق عابر للكورسات.' },
    },
  ],

  security: {
    mfaEnabled: true,
    deniedRequests: 12,
    crmConnected: false,
    // Demo-only stand-in for a real authenticator app's time-based code.
    demoMfaCode: '246810',
  },

  audit: [
    {
      time: '10:42',
      user: 'student@demo',
      action: 'GET /admin/questions',
      outcome: 'denied',
      detail: '403',
      source: '203.0.113.118',
    },
    {
      time: '10:39',
      user: 'academic.admin@demo',
      action: 'MFA challenge',
      outcome: 'success',
      detail: '200',
      source: '10.20.14.9',
    },
    {
      time: '10:31',
      user: 'instructor@demo',
      action: 'POST /questions/QB-1051/review',
      outcome: 'denied',
      detail: '403',
      source: '10.20.14.31',
    },
  ],
};
