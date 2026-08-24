/** Resolves "a.b.c" against a nested catalogue. */
export function lookup(catalogue, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), catalogue);
}

/** Replaces {{name}} placeholders with the supplied values. */
export function interpolate(template, values) {
  if (!values) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}
