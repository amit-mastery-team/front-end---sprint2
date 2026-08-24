import PropTypes from 'prop-types';
import { Button } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function ReviewList({ items, onSelect }) {
  const { t } = useI18n();

  const metaFor = (item) =>
    t('review.itemMeta', {
      source: t(`source.${item.source}`),
      type: t(`questionType.${item.type}`),
      difficulty: t(`difficulty.${item.difficulty}`),
      marks: item.marks,
    });

  return (
    <ul className="list list--plain">
      {items.map((item) => (
        <li className="list-item" key={item.id}>
          <div>
            <b>
              {item.id} • {t(`topics.${item.topic}`)}
            </b>
            <div className="small">{metaFor(item)}</div>
          </div>
          <Button onClick={() => onSelect(item)}>{t('common.review')}</Button>
        </li>
      ))}
    </ul>
  );
}

ReviewList.propTypes = {
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
