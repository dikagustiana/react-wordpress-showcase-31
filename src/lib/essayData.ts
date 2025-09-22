export interface Essay {
  id: string;
  title: string;
  snippet: string;
  author: string;
  date: string;
  readTime: string;
  thumbnail: string;
  content: string;
  phase: string;
}

const generateLoremContent = () => `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at risus mi. Sed congue facilisis libero, ut cursus ipsum tempor vel. Donec euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nunc, vel aliquam nunc nisl vel nunc.

Mauris vel lorem sed nunc tincidunt lacinia. Sed vel nunc vel lorem tincidunt lacinia. Donec euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nunc, vel aliquam nunc nisl vel nunc. Vestibulum at risus mi. Sed congue facilisis libero, ut cursus ipsum tempor vel.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed vel nunc vel lorem tincidunt lacinia. Donec euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nunc, vel aliquam nunc nisl vel nunc.

Vestibulum at risus mi. Sed congue facilisis libero, ut cursus ipsum tempor vel. Donec euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nunc, vel aliquam nunc nisl vel nunc. Mauris vel lorem sed nunc tincidunt lacinia.

Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.

Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.
`;

export const essaysByPhase: Record<string, Essay[]> = {
  clarify: [
    {
      id: 'clarify-1',
      title: 'The Art of Spotting Hidden Arguments',
      snippet:
        'Learn to identify real arguments beneath layers of rhetoric and noise. Essential skills for clear thinking.',
      author: 'Smart Friend',
      date: 'Aug 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'clarify',
    },
    {
      id: 'clarify-2',
      title: "Why Most People Think They're Being Logical",
      snippet:
        'Exploring cognitive biases that make us overconfident in our reasoning abilities and how to overcome them.',
      author: 'Logic Master',
      date: 'Jul 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'clarify',
    },
    {
      id: 'clarify-3',
      title: 'Questions That Cut Through Confusion',
      snippet:
        'A toolkit of powerful questions to clarify murky situations and get to the heart of any matter.',
      author: 'Clarity Coach',
      date: 'Jul 2024',
      readTime: '5 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'clarify',
    },
    {
      id: 'clarify-4',
      title: 'The Signal vs Noise Problem',
      snippet:
        'How to filter meaningful information from distractions in our information-overloaded world.',
      author: 'Info Curator',
      date: 'Jun 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'clarify',
    },
    {
      id: 'clarify-5',
      title: 'Mental Models for Clearer Thinking',
      snippet:
        'Essential frameworks that help organize thoughts and approach problems more systematically.',
      author: 'Model Thinker',
      date: 'Jun 2024',
      readTime: '9 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'clarify',
    },
  ],
  analyze: [
    {
      id: 'analyze-1',
      title: 'Breaking Arguments Into Pieces',
      snippet:
        'Master the art of dissecting complex arguments to understand their structure and validity.',
      author: 'Logic Detective',
      date: 'Aug 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'analyze',
    },
    {
      id: 'analyze-2',
      title: 'Common Fallacies in Everyday Conversations',
      snippet:
        'Spot the most frequent logical fallacies that derail productive discussions and debates.',
      author: 'Fallacy Hunter',
      date: 'Jul 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'analyze',
    },
    {
      id: 'analyze-3',
      title: 'The Anatomy of Strong Evidence',
      snippet:
        'What makes evidence compelling and how to evaluate the strength of supporting materials.',
      author: 'Evidence Expert',
      date: 'Jul 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'analyze',
    },
    {
      id: 'analyze-4',
      title: 'When Statistics Lie',
      snippet:
        'Understanding how numbers can be manipulated and how to read data more critically.',
      author: 'Data Skeptic',
      date: 'Jun 2024',
      readTime: '9 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'analyze',
    },
    {
      id: 'analyze-5',
      title: 'Assumption Hunting in Complex Problems',
      snippet:
        'Techniques for uncovering hidden assumptions that often undermine our reasoning.',
      author: 'Assumption Tracker',
      date: 'Jun 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'analyze',
    },
  ],
  construct: [
    {
      id: 'construct-1',
      title: 'Building Arguments That Stand',
      snippet:
        'The architecture of persuasive reasoning: from premises to conclusions that hold up under scrutiny.',
      author: 'Argument Architect',
      date: 'Aug 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'construct',
    },
    {
      id: 'construct-2',
      title: 'The Power of Structured Reasoning',
      snippet:
        'Why organization matters in thinking and how to create logical frameworks for complex ideas.',
      author: 'Structure Guru',
      date: 'Jul 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'construct',
    },
    {
      id: 'construct-3',
      title: 'From Idea to Iron-Clad Case',
      snippet:
        'Step-by-step process for transforming rough thoughts into compelling, logical arguments.',
      author: 'Case Builder',
      date: 'Jul 2024',
      readTime: '9 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'construct',
    },
    {
      id: 'construct-4',
      title: 'Anticipating Counterarguments',
      snippet:
        'How to strengthen your position by thinking like your strongest critics.',
      author: "Devil's Advocate",
      date: 'Jun 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'construct',
    },
    {
      id: 'construct-5',
      title: 'The Art of Logical Persuasion',
      snippet:
        'Combining sound reasoning with effective communication to change minds and influence decisions.',
      author: 'Persuasion Expert',
      date: 'Jun 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'construct',
    },
  ],
  apply: [
    {
      id: 'apply-1',
      title: 'Critical Thinking in Social Media',
      snippet:
        'Navigate the digital noise with strategies for evaluating online information and claims.',
      author: 'Digital Critic',
      date: 'Aug 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'apply',
    },
    {
      id: 'apply-2',
      title: 'Reading Scientific Studies Like a Pro',
      snippet:
        'Essential skills for interpreting research papers and understanding what studies actually prove.',
      author: 'Science Reader',
      date: 'Jul 2024',
      readTime: '9 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'apply',
    },
    {
      id: 'apply-3',
      title: 'Decision Making Under Uncertainty',
      snippet:
        'How to apply critical thinking when facing incomplete information and high stakes.',
      author: 'Decision Expert',
      date: 'Jul 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'apply',
    },
    {
      id: 'apply-4',
      title: 'Critical Thinking at Work',
      snippet:
        'Practical applications of logical reasoning in professional settings and business decisions.',
      author: 'Business Thinker',
      date: 'Jun 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'apply',
    },
    {
      id: 'apply-5',
      title: 'Everyday Philosophy: Thinking About Life',
      snippet:
        'Using critical thinking tools to examine personal beliefs, values, and life choices.',
      author: 'Life Philosopher',
      date: 'Jun 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'apply',
    },
  ],
  frame: [
    {
      id: 'frame-1',
      title: 'The Power of Asking Sharp Questions',
      snippet:
        'How the right questions can transform your research from good to exceptional. Question formulation techniques.',
      author: 'Question Master',
      date: 'Aug 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'frame',
    },
    {
      id: 'frame-2',
      title: 'Building Research Frameworks That Work',
      snippet:
        'Design robust conceptual frameworks that guide your research and organize your thinking effectively.',
      author: 'Framework Designer',
      date: 'Jul 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'frame',
    },
    {
      id: 'frame-3',
      title: 'From Curiosity to Research Question',
      snippet:
        'Transform vague interests into specific, researchable questions that lead to meaningful discoveries.',
      author: 'Curiosity Guide',
      date: 'Jul 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'frame',
    },
    {
      id: 'frame-4',
      title: 'Scope and Boundaries in Research',
      snippet:
        'Learn when to narrow your focus and when to broaden it for maximum research impact.',
      author: 'Scope Specialist',
      date: 'Jun 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'frame',
    },
    {
      id: 'frame-5',
      title: 'Literature Review as Foundation',
      snippet:
        'How to use existing research to build a solid foundation for your own investigations.',
      author: 'Literature Expert',
      date: 'Jun 2024',
      readTime: '9 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'frame',
    },
  ],
  data: [
    {
      id: 'data-1',
      title: 'Making Numbers Tell Stories',
      snippet:
        'Transform raw data into compelling narratives that reveal insights and drive action.',
      author: 'Data Storyteller',
      date: 'Aug 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'data',
    },
    {
      id: 'data-2',
      title: 'Collection Strategies That Actually Work',
      snippet:
        'Proven methods for gathering high-quality data efficiently and avoiding common pitfalls.',
      author: 'Collection Expert',
      date: 'Jul 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'data',
    },
    {
      id: 'data-3',
      title: 'When Your Data Misbehaves',
      snippet:
        'Dealing with missing values, outliers, and other data quality issues that can derail research.',
      author: 'Data Cleaner',
      date: 'Jul 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'data',
    },
    {
      id: 'data-4',
      title: 'Visualization for Understanding',
      snippet:
        'Create charts and graphs that actually help you understand your data, not just look pretty.',
      author: 'Viz Master',
      date: 'Jun 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'data',
    },
    {
      id: 'data-5',
      title: 'Ethical Data Collection',
      snippet:
        'Navigate privacy, consent, and ethical considerations in modern data gathering practices.',
      author: 'Ethics Guardian',
      date: 'Jun 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'data',
    },
  ],
  'research-analyze': [
    {
      id: 'research-analyze-1',
      title: 'Designing Honest Empirical Strategies',
      snippet:
        'Build research methods that minimize bias and maximize the reliability of your findings.',
      author: 'Method Designer',
      date: 'Aug 2024',
      readTime: '9 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'research-analyze',
    },
    {
      id: 'research-analyze-2',
      title: 'Statistical Honesty in Practice',
      snippet:
        'Avoid p-hacking and other statistical sins that compromise research integrity.',
      author: 'Stats Ethicist',
      date: 'Jul 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'research-analyze',
    },
    {
      id: 'research-analyze-3',
      title: 'Pattern Recognition vs Wishful Thinking',
      snippet:
        'Learn to distinguish genuine patterns from random noise and confirmation bias.',
      author: 'Pattern Expert',
      date: 'Jul 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'research-analyze',
    },
    {
      id: 'research-analyze-4',
      title: 'When Your Hypothesis is Wrong',
      snippet:
        'Embrace negative results and learn how they can be more valuable than positive ones.',
      author: 'Null Advocate',
      date: 'Jun 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'research-analyze',
    },
    {
      id: 'research-analyze-5',
      title: 'Replication and Reliability',
      snippet:
        'Why reproducible research matters and how to make your work stand up to scrutiny.',
      author: 'Reliability Expert',
      date: 'Jun 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'research-analyze',
    },
  ],
  communicate: [
    {
      id: 'communicate-1',
      title: 'Writing That Cuts Through Academic Jargon',
      snippet:
        'Make your research accessible without dumbing it down. Clear communication strategies for complex ideas.',
      author: 'Clear Writer',
      date: 'Aug 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'communicate',
    },
    {
      id: 'communicate-2',
      title: 'Presenting Research with Impact',
      snippet:
        'Transform dry findings into compelling presentations that engage and persuade your audience.',
      author: 'Presentation Pro',
      date: 'Jul 2024',
      readTime: '8 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'communicate',
    },
    {
      id: 'communicate-3',
      title: 'Visual Communication of Complex Ideas',
      snippet:
        'Use diagrams, infographics, and visual aids to make complex research findings understandable.',
      author: 'Visual Communicator',
      date: 'Jul 2024',
      readTime: '6 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'communicate',
    },
    {
      id: 'communicate-4',
      title: 'Tailoring Your Message to Your Audience',
      snippet:
        'Adapt your communication style for different stakeholders without losing scientific rigor.',
      author: 'Audience Expert',
      date: 'Jun 2024',
      readTime: '7 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'communicate',
    },
    {
      id: 'communicate-5',
      title: 'From Paper to Policy Impact',
      snippet:
        'Bridge the gap between academic research and real-world application through strategic communication.',
      author: 'Impact Strategist',
      date: 'Jun 2024',
      readTime: '9 min',
      thumbnail: '/placeholder.svg',
      content: generateLoremContent(),
      phase: 'communicate',
    },
  ],
};

export const getAllEssaysForPhase = (phase: string): Essay[] => {
  return essaysByPhase[phase] || [];
};

export const getEssayById = (id: string): Essay | undefined => {
  // First check custom essays in localStorage
  const customEssays = loadCustomEssays();
  for (const phaseEssays of Object.values(customEssays)) {
    const essay = phaseEssays.find((essay) => essay.id === id);
    if (essay) return essay;
  }

  // Then check default essays
  for (const phaseEssays of Object.values(essaysByPhase)) {
    const essay = phaseEssays.find((essay) => essay.id === id);
    if (essay) return essay;
  }
  return undefined;
};

export const getPhaseTitle = (phase: string): string => {
  const phaseTitles: Record<string, string> = {
    clarify: 'Clarify',
    analyze: 'Analyze',
    construct: 'Construct',
    apply: 'Apply',
    frame: 'Frame',
    data: 'Data',
    'research-analyze': 'Analyze',
    communicate: 'Communicate',
  };
  return phaseTitles[phase] || 'Essays';
};

// LocalStorage key for custom essays
const CUSTOM_ESSAYS_KEY = 'customEssays';

// Load custom essays from localStorage
const loadCustomEssays = (): Record<string, Essay[]> => {
  try {
    const stored = localStorage.getItem(CUSTOM_ESSAYS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading custom essays:', error);
    return {};
  }
};

// Save custom essays to localStorage
const saveCustomEssays = (customEssays: Record<string, Essay[]>) => {
  try {
    localStorage.setItem(CUSTOM_ESSAYS_KEY, JSON.stringify(customEssays));
  } catch (error) {
    console.error('Error saving custom essays:', error);
  }
};

// Add a new essay to a specific phase
export const addEssayToPhase = (phase: string, essay: Essay): void => {
  const customEssays = loadCustomEssays();

  if (!customEssays[phase]) {
    customEssays[phase] = [];
  }

  // Add to the beginning of the array (most recent first)
  customEssays[phase].unshift(essay);

  // Save to localStorage
  saveCustomEssays(customEssays);
};

// Get all essays for a phase (including custom ones)
export const getAllEssaysForPhaseWithCustom = (phase: string): Essay[] => {
  const defaultEssays = essaysByPhase[phase] || [];
  const customEssays = loadCustomEssays();
  const phaseCustomEssays = customEssays[phase] || [];

  // Combine custom essays (first) with default essays
  return [...phaseCustomEssays, ...defaultEssays];
};

// Remove a custom essay
export const removeCustomEssay = (phase: string, essayId: string): void => {
  const customEssays = loadCustomEssays();

  if (customEssays[phase]) {
    customEssays[phase] = customEssays[phase].filter(
      (essay) => essay.id !== essayId
    );
    saveCustomEssays(customEssays);
  }
};

// Check if an essay is custom (can be deleted)
export const isCustomEssay = (essayId: string): boolean => {
  const customEssays = loadCustomEssays();

  for (const phaseEssays of Object.values(customEssays)) {
    if (phaseEssays.some((essay) => essay.id === essayId)) {
      return true;
    }
  }

  return false;
};
