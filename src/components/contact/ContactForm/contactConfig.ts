export const BUDGET_OPTIONS = [
  { value: 'under-5k',  label: 'Under $5,000' },
  { value: '5k-10k',    label: '$5,000 – $10,000' },
  { value: '10k-25k',   label: '$10,000 – $25,000' },
  { value: '25k-50k',   label: '$25,000 – $50,000' },
  { value: '50k-plus',  label: '$50,000+' },
  { value: 'not-sure',  label: 'Not sure yet' },
] as const;

export type BudgetValue = (typeof BUDGET_OPTIONS)[number]['value'];

export const BUDGET_VALUES = BUDGET_OPTIONS.map((o) => o.value);

export const FIELD_LIMITS = {
  name: 120,
  organisation: 120,
  email: 254,
  message: 2000,
} as const;

export const MIN_DWELL_MS = 2000;
