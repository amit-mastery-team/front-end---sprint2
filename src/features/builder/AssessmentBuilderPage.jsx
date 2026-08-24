import { useNavigate } from 'react-router-dom';
import { AsyncBoundary, Button, Card, Hero } from '@/shared/components/ui';
import { PATH } from '@/app/paths';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';
import { useBlueprint } from './hooks/useBlueprint';
import BlueprintFields from './components/BlueprintFields';
import BlueprintTable from './components/BlueprintTable';
import IntegrityCard from './components/IntegrityCard';
import ReadinessCard from './components/ReadinessCard';

export default function AssessmentBuilderPage() {
  const { t, tx } = useI18n();
  const navigate = useNavigate();
  const { notifyFailure } = useToast();
  const {
    blueprint,
    loading,
    error,
    reload,
    setField,
    setRow,
    save,
    saving,
    isGraded,
    complete,
    incompleteReasons,
    canAssemble,
  } = useBlueprint();

  const assemble = () => {
    if (!canAssemble) {
      notifyFailure(
        `${t('builder.cannotAssemble')} ${incompleteReasons.map((reason) => t(`builder.reason.${reason}`)).join(' ')}`,
      );
      return;
    }
    navigate(PATH.ASSEMBLY);
  };

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('builder.title')}
        lede={t('builder.lede')}
        goal={t('builder.goal')}
      />

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        {blueprint ? (
          <div className="split">
            <Card title={tx(blueprint.name)}>
              <BlueprintFields blueprint={blueprint} onChange={setField} />
              <hr />
              <h3>{t('builder.blueprint')}</h3>
              <BlueprintTable rows={blueprint.rows} onChangeRow={setRow} />

              <div className="btn-row u-mt-4">
                <Button variant="primary" onClick={save} disabled={saving}>
                  {saving ? t('common.saving') : t('builder.saveBlueprint')}
                </Button>
                <Button onClick={assemble}>{t('builder.assemble')}</Button>
              </div>
            </Card>

            <div className="stack">
              <IntegrityCard isGraded={isGraded} complete={complete} reasons={incompleteReasons} />
              <ReadinessCard />
            </div>
          </div>
        ) : null}
      </AsyncBoundary>
    </>
  );
}
