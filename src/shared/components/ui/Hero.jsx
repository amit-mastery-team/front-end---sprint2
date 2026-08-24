import PropTypes from 'prop-types';

export default function Hero({ eyebrow, title, lede, goal }) {
  return (
    <header className="hero">
      {eyebrow ? <div className="hero__eyebrow">{eyebrow}</div> : null}
      <h2>{title}</h2>
      {lede ? <p>{lede}</p> : null}
      {goal ? (
        <div className="hero__goal">
          <span aria-hidden="true">◆</span> {goal}
        </div>
      ) : null}
    </header>
  );
}

Hero.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  lede: PropTypes.string,
  goal: PropTypes.string,
};
