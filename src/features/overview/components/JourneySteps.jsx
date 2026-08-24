import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/shared/components/ui';
import { PATH } from '@/app/paths';
import { useI18n } from '@/shared/i18n/I18nProvider';

const STEPS = [
  { key: 'step1', to: PATH.BANK },
  { key: 'step2', to: PATH.BUILDER },
  { key: 'step3', to: PATH.ATTEMPT },
];

export default function JourneySteps() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="grid g3">
      {STEPS.map((step) => (
        <Card key={step.key} title={t(`overview.${step.key}`)}>
          <p>{t(`overview.${step.key}Body`)}</p>
          <Button variant="primary" onClick={() => navigate(step.to)}>
            {t(`overview.${step.key}Cta`)}
          </Button>
        </Card>
      ))}
    </div>
  );
}
