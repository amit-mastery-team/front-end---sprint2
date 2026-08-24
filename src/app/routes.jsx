import OverviewPage from '@/features/overview/OverviewPage';
import QuestionBankPage from '@/features/questions/QuestionBankPage';
import ReviewQueuePage from '@/features/review/ReviewQueuePage';
import PracticeQuizPage from '@/features/practice/PracticeQuizPage';
import AssessmentBuilderPage from '@/features/builder/AssessmentBuilderPage';
import FormAssemblyPage from '@/features/assembly/FormAssemblyPage';
import StudentAttemptPage from '@/features/attempt/StudentAttemptPage';
import PlacementPage from '@/features/placement/PlacementPage';
import SecurityPage from '@/features/security/SecurityPage';
import { PATH } from './paths';

/**
 * Single source of truth for routing, the sidebar and the page title.
 * `titleKey` resolves against the `nav` section of the catalogues.
 *
 * Import paths from '@/app/paths', never from here — this module pulls in every
 * page, so importing it from a page would create a cycle.
 */
export const ROUTES = Object.freeze([
  { path: PATH.OVERVIEW, titleKey: 'overview', element: <OverviewPage />, index: true },
  { path: PATH.BANK, titleKey: 'bank', element: <QuestionBankPage /> },
  { path: PATH.REVIEW, titleKey: 'review', element: <ReviewQueuePage /> },
  { path: PATH.PRACTICE, titleKey: 'practice', element: <PracticeQuizPage /> },
  { path: PATH.BUILDER, titleKey: 'builder', element: <AssessmentBuilderPage /> },
  { path: PATH.ASSEMBLY, titleKey: 'assembly', element: <FormAssemblyPage /> },
  { path: PATH.ATTEMPT, titleKey: 'attempt', element: <StudentAttemptPage /> },
  { path: PATH.WORK, titleKey: 'work', element: <PlacementPage /> },
  { path: PATH.SECURITY, titleKey: 'security', element: <SecurityPage /> },
]);

export const titleKeyForPath = (pathname) =>
  ROUTES.find((route) => route.path === pathname)?.titleKey ?? 'overview';
