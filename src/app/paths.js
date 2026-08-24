/**
 * Route paths, deliberately in a module of their own with no imports.
 *
 * `routes.jsx` imports every page, and pages need to link to each other, so
 * reading paths from `routes.jsx` would create an import cycle: the page module
 * would evaluate before `PATH` was initialised. Keeping paths in a leaf module
 * breaks that cycle.
 */
export const PATH = Object.freeze({
  OVERVIEW: '/',
  BANK: '/bank',
  REVIEW: '/review',
  PRACTICE: '/practice',
  BUILDER: '/builder',
  ASSEMBLY: '/assembly',
  ATTEMPT: '/attempt',
  WORK: '/work',
  SECURITY: '/security',
});
