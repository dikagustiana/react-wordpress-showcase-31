// Section constants untuk Green Transition
export const SECTION_KEYS = {
  WHERE_WE_ARE_NOW: 'where-we-are-now',
  CHALLENGES_AHEAD: 'challenges-ahead', 
  PATHWAY_FORWARD: 'pathway-forward'
} as const;

export type SectionKey = typeof SECTION_KEYS[keyof typeof SECTION_KEYS];

export const SECTION_TITLES: Record<SectionKey, string> = {
  'where-we-are-now': 'Where We Are Now',
  'challenges-ahead': 'Challenges Ahead',
  'pathway-forward': 'Pathways Forward'
};

export const SECTION_DESCRIPTIONS: Record<SectionKey, string> = {
  'where-we-are-now': 'Summarize the current state: energy mix, emissions, active policies, and key barriers.',
  'challenges-ahead': 'Identify gaps in policy, funding, technology, infrastructure, and market readiness.',
  'pathway-forward': 'Roadmap for implementation: sector priorities, sequence of initiatives, funding, and metrics.'
};

// URL builder functions
export const buildEssayUrl = (sectionKey: SectionKey, slug: string, edit?: boolean) => {
  const baseUrl = `/green-transition/${sectionKey}/${slug}`;
  return edit ? `${baseUrl}?edit=1` : baseUrl;
};

export const buildSectionUrl = (sectionKey: SectionKey) => {
  return `/green-transition/${sectionKey}`;
};

// Validation
export const isValidSectionKey = (key: string): key is SectionKey => {
  return Object.values(SECTION_KEYS).includes(key as SectionKey);
};