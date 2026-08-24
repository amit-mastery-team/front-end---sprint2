import PropTypes from 'prop-types';
import { Callout, NumberField, SelectField } from '@/shared/components/ui';
import { ASSESSMENT_TYPE_OPTIONS, isGradedAssessmentType } from '@/shared/constants/domain';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function BlueprintFields({ blueprint, onChange }) {
  const { t } = useI18n();
  const graded = isGradedAssessmentType(blueprint.assessmentType);

  return (
    <div className="form-grid">
      <SelectField
        label={t('builder.assessmentType')}
        value={blueprint.assessmentType}
        options={ASSESSMENT_TYPE_OPTIONS}
        getLabel={(option) => t(`assessmentType.${option}`)}
        onChange={(value) => onChange('assessmentType', value)}
      />
      <NumberField
        label={t('builder.totalMarks')}
        value={blueprint.totalMarks}
        onChange={(value) => onChange('totalMarks', value)}
      />
      <NumberField
        label={t('builder.duration')}
        value={blueprint.durationMinutes}
        onChange={(value) => onChange('durationMinutes', value)}
      />
      <NumberField
        label={t('builder.attemptLimit')}
        value={blueprint.attemptLimit}
        onChange={(value) => onChange('attemptLimit', value)}
      />
      <SelectField
        label={t('builder.personalizedLabel')}
        value={graded ? 'false' : String(Boolean(blueprint.personalized))}
        options={['false', 'true']}
        disabled={graded}
        getLabel={(option) => t(`builder.personalizedOption.${option}`)}
        onChange={(value) => onChange('personalized', value === 'true')}
      />
      {graded ? <Callout tone="warn">{t('builder.personalizedLockedGraded')}</Callout> : null}
    </div>
  );
}

BlueprintFields.propTypes = {
  blueprint: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
