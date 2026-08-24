import PropTypes from 'prop-types';
import { BADGE_TONES } from '@/shared/constants/ui';

export default function Badge({ tone = 'info', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

Badge.propTypes = {
  tone: PropTypes.oneOf(BADGE_TONES),
  children: PropTypes.node.isRequired,
};
