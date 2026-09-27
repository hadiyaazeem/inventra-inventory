/**
 * Chart colors, validated with the dataviz skill's validate_palette.js against
 * the dark navy chart surface (#0f1626 reference). These are chart-specific
 * steps — re-derived from the blue/indigo/cyan brand tokens but re-stepped
 * where the raw brand hex fails the lightness band, chroma floor, or
 * adjacent-pair CVD/normal-vision checks for a data mark on a dark surface.
 * Brand tokens stay unchanged for UI (buttons, badges, borders); only these
 * values feed Recharts fills.
 *
 * "Gray" is deliberately NOT one of the rotating category colors — a true
 * neutral fails the categorical chroma floor by definition (it can't carry
 * hue identity), so per the skill's own guidance gray is reserved for chart
 * chrome instead: axis labels, gridlines, and muted text (CHART_TEXT_MUTED /
 * CHART_GRID below).
 *
 * Order matters — this exact sequence (blue, cyan, violet, amber, rose)
 * clears every check (lightness/chroma/CVD/normal-vision/contrast) on the
 * dark surface by spacing hues around the wheel rather than clustering warm
 * or cool. Re-run the validator before changing the order.
 */
export const CATEGORICAL_PALETTE = [
  '#4C9AFF', // blue
  '#2DD4CE', // cyan-teal
  '#A78BFA', // violet
  '#F2B84B', // amber
  '#F0708A', // rose
]

/** Status triplet — validated standalone, all checks pass. */
export const STATUS_COLORS = {
  in_stock: '#22C58F',
  low_stock: '#F2B84B',
  out_of_stock: '#F0708A',
}

export const CHART_TEXT_MUTED = '#8a8580'
export const CHART_TEXT_SECONDARY = '#c4beb6'
export const CHART_GRID = 'rgba(255,255,255,0.08)'

/** Shared tooltip surface for Recharts <Tooltip contentStyle> across all charts. */
export const CHART_TOOLTIP_STYLE = {
  background: 'rgba(23,19,16,0.97)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  fontSize: 12,
  color: CHART_TEXT_SECONDARY,
  backdropFilter: 'blur(8px)',
}
