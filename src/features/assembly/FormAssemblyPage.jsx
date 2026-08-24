import { AsyncBoundary, Button, Hero, NumberField, SelectField } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useFormAssembly } from './hooks/useFormAssembly';
import BankGapDialog from './components/BankGapDialog';
import EquivalenceTable from './components/EquivalenceTable';
import FormCards from './components/FormCards';

export default function FormAssemblyPage() {
  const { t } = useI18n();
  const assembly = useFormAssembly();

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('assembly.title')}
        lede={t('assembly.lede')}
        goal={t('assembly.goal')}
      />

      <div className="form-grid u-mb-3">
        <NumberField label={t('assembly.formCount')} min={1} value={assembly.formCount} onChange={assembly.setFormCount} />
        <NumberField label={t('assembly.seedLabel')} min={1} value={assembly.seed} onChange={assembly.setSeed} />
        <SelectField
          label={t('assembly.randomizeOrder')}
          value={String(assembly.randomizeOrder)}
          options={['false', 'true']}
          getLabel={(option) => t(`builder.personalizedOption.${option}`)}
          onChange={(value) => assembly.setRandomizeOrder(value === 'true')}
        />
      </div>

      <AsyncBoundary
        loading={assembly.loading}
        error={assembly.error}
        onRetry={assembly.reload}
        isEmpty={assembly.forms.length === 0}
        emptyMessage={t('assembly.empty')}
      >
        <FormCards forms={assembly.forms} />
      </AsyncBoundary>

      <div className="btn-row u-my-4">
        <Button variant="primary" onClick={() => assembly.run()} disabled={assembly.running}>
          {assembly.running ? t('state.loading') : t('assembly.run')}
        </Button>
        <Button
          variant="danger"
          onClick={() => assembly.run({ simulateGap: true })}
          disabled={assembly.running}
        >
          {t('assembly.simulateGap')}
        </Button>
      </div>

      {assembly.forms.length > 0 ? (
        <AsyncBoundary loading={assembly.loading} error={assembly.error} onRetry={assembly.reload}>
          <EquivalenceTable forms={assembly.forms} checks={assembly.checks} />
        </AsyncBoundary>
      ) : null}

      <BankGapDialog gap={assembly.gap} onClose={assembly.clearGap} />
    </>
  );
}
