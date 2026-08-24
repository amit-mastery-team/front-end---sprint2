import { AsyncBoundary, Hero } from '@/shared/components/ui';
import { WORK_ITEM_KIND } from '@/shared/constants/domain';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';
import { usePlacements } from './hooks/usePlacements';
import PlacementCard from './components/PlacementCard';
import AddWorkItemDialog from './components/AddWorkItemDialog';

export default function PlacementPage() {
  const { t } = useI18n();
  const { notify } = useToast();
  const { placements, loading, error, reload, target, openDialog, closeDialog, attach, attaching } =
    usePlacements();

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('work.title')}
        lede={t('work.lede')}
        goal={t('work.goal')}
      />

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        <div className="grid g3">
          {placements.map((placement) => (
            <PlacementCard
              key={placement.id}
              placement={placement}
              onOpen={(name) => notify(t('work.opened', { name }))}
              onAttachQuiz={(placementId) => openDialog({ placementId, kind: WORK_ITEM_KIND.QUIZ })}
              onAddAssignment={(placementId) => openDialog({ placementId, kind: WORK_ITEM_KIND.ASSIGNMENT })}
            />
          ))}
        </div>
      </AsyncBoundary>

      <AddWorkItemDialog target={target} pending={attaching} onClose={closeDialog} onSubmit={attach} />
    </>
  );
}
