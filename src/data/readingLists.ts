// Curated reading lists for Learning Buddy - written like a smart friend's recommendations

export interface ReadingItem {
  id: string;
  title: string;
  author: string;
  year: number;
  summary: string; // 2-3 sentences, friendly tone
  tags: string[];
  coverUrl?: string;
  type: 'book' | 'article' | 'journal' | 'paper';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: string;
  externalUrl?: string;
}

export const READING_LISTS: Record<string, ReadingItem[]> = {
  'economics': [
    {
      id: 'economics-1',
      title: 'The Wealth of Nations',
      author: 'Adam Smith',
      year: 1776,
      summary: "The OG economics book that started it all! Smith breaks down how markets work and why the 'invisible hand' guides economic decisions. It's dense but surprisingly readable for an 18th-century text, and you'll finally understand what everyone means when they quote Adam Smith.",
      tags: ['Classic', 'Foundational', 'Market Theory'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '4-6 weeks'
    },
    {
      id: 'economics-2',
      title: 'Capital in the Twenty-First Century',
      author: 'Thomas Piketty',
      year: 2013,
      summary: "Piketty uses centuries of data to show how wealth inequality keeps growing. It's like having a really smart economist friend explain why the rich keep getting richer using actual numbers instead of just theories. Fair warning: lots of graphs, but they're actually fascinating!",
      tags: ['Modern', 'Inequality', 'Data-Heavy', 'Bestseller'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '3-4 weeks'
    },
    {
      id: 'economics-3',
      title: 'Freakonomics',
      author: 'Steven Levitt & Stephen Dubner',
      year: 2005,
      summary: "Economics meets detective work! These guys use economic thinking to solve weird puzzles like why drug dealers live with their moms and whether names affect life outcomes. Super entertaining and makes you see the hidden economic forces everywhere.",
      tags: ['Beginner Friendly', 'Popular', 'Applied Economics'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '1-2 weeks'
    },
    {
      id: 'economics-4',
      title: 'The General Theory of Employment, Interest and Money',
      author: 'John Maynard Keynes',
      year: 1936,
      summary: "Keynes basically rewrote economics after the Great Depression, arguing that governments should step in when markets fail. It's the foundation of modern macroeconomic policy. Heavy reading, but essential if you want to understand how economic policy actually works.",
      tags: ['Classic', 'Macroeconomics', 'Policy', 'Advanced'],
      type: 'book',
      difficulty: 'advanced',
      estimatedReadTime: '4-5 weeks'
    },
    {
      id: 'economics-5',
      title: 'Nudge',
      author: 'Richard Thaler & Cass Sunstein',
      year: 2008,
      summary: "How small changes in how choices are presented can dramatically change what people decide. These behavioral economists show how 'nudging' people works better than forcing them. You'll start noticing nudges everywhere after reading this!",
      tags: ['Behavioral Economics', 'Policy', 'Psychology', 'Accessible'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '2 weeks'
    },
    {
      id: 'economics-6',
      title: 'The Black Swan',
      author: 'Nassim Nicholas Taleb',
      year: 2007,
      summary: "Taleb argues that rare, unpredictable events (black swans) shape our world more than we think. He's got a unique writing style - part philosopher, part statistician, part provocateur. Great for understanding uncertainty and why experts often get big predictions wrong.",
      tags: ['Risk', 'Philosophy', 'Statistics', 'Contrarian'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '2-3 weeks'
    },
    {
      id: 'economics-7',
      title: 'Poor Economics',
      author: 'Abhijit Banerjee & Esther Duflo',
      year: 2011,
      summary: "Two MIT economists use actual experiments to figure out what really helps poor people. Instead of grand theories, they test specific interventions and share what actually works. Eye-opening and practical - shows how rigorous research can guide anti-poverty efforts.",
      tags: ['Development', 'Evidence-Based', 'Global Issues', 'Nobel Prize'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '2-3 weeks'
    },
    {
      id: 'economics-8',
      title: 'The Road to Serfdom',
      author: 'Friedrich Hayek',
      year: 1944,
      summary: "Hayek's warning about how economic planning can lead to political tyranny. Written during WWII, it's a passionate defense of free markets and individual liberty. Even if you disagree with his conclusions, his arguments about knowledge and planning are brilliant.",
      tags: ['Classic', 'Political Economy', 'Austrian School', 'Liberty'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '2-3 weeks'
    }
  ],

  'political-theory': [
    {
      id: 'political-1',
      title: 'The Republic',
      author: 'Plato',
      year: -380,
      summary: "Plato's vision of the ideal state, featuring the famous 'philosopher kings' and the allegory of the cave. It's like the ultimate thought experiment about justice, power, and what makes a good society. Still relevant after 2,400 years!",
      tags: ['Ancient', 'Philosophy', 'Justice', 'Foundational'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '3-4 weeks'
    },
    {
      id: 'political-2',
      title: 'The Prince',
      author: 'Niccolò Machiavelli',
      year: 1532,
      summary: "The handbook for how to gain and keep political power, written by someone who actually worked in politics. Machiavelli is brutally honest about how power really works - forget idealism, this is realpolitik at its finest. Short but packed with insights.",
      tags: ['Classic', 'Power', 'Strategy', 'Realism'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '1-2 weeks'
    },
    {
      id: 'political-3',
      title: 'A Theory of Justice',
      author: 'John Rawls',
      year: 1971,
      summary: "Rawls asks: what would a fair society look like if you designed it from behind a 'veil of ignorance' - not knowing if you'd be rich or poor, smart or average? His answer revolutionized political philosophy and gives us tools to think about inequality and fairness.",
      tags: ['Modern', 'Justice', 'Ethics', 'Influential'],
      type: 'book',
      difficulty: 'advanced',
      estimatedReadTime: '4-6 weeks'
    },
    {
      id: 'political-4',
      title: 'The Communist Manifesto',
      author: 'Karl Marx & Friedrich Engels',
      year: 1848,
      summary: "Marx and Engels' call to revolution that changed the world. Whether you love it or hate it, you need to understand the ideas that influenced everything from labor movements to entire nations. It's surprisingly short and readable!",
      tags: ['Classic', 'Revolution', 'Labor', 'Ideology'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '1 week'
    },
    {
      id: 'political-5',
      title: 'Democracy in America',
      author: 'Alexis de Tocqueville',
      year: 1835,
      summary: "A young French aristocrat visits America and writes the most insightful book about democracy ever written. Tocqueville saw both the promise and the dangers of democratic society with remarkable clarity. His observations feel incredibly current.",
      tags: ['Classic', 'Democracy', 'American Politics', 'Sociology'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '4-5 weeks'
    },
    {
      id: 'political-6',
      title: 'The Clash of Civilizations',
      author: 'Samuel Huntington',
      year: 1996,
      summary: "Huntington argues that future conflicts will be cultural rather than ideological or economic. Controversial but influential, especially after 9/11. Even critics acknowledge his framework shaped how we think about international relations in the post-Cold War world.",
      tags: ['International Relations', 'Culture', 'Conflict', 'Controversial'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '3 weeks'
    }
  ],

  'philosophy': [
    {
      id: 'philosophy-1',
      title: 'Meditations',
      author: 'Marcus Aurelius',
      year: 180,
      summary: "The personal journal of a Roman Emperor who happened to be a philosopher. Marcus writes to himself about virtue, mortality, and how to live a good life. It's like having access to the inner thoughts of one of history's most powerful people - surprisingly humble and wise.",
      tags: ['Ancient', 'Stoicism', 'Self-Help', 'Timeless'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '2 weeks'
    },
    {
      id: 'philosophy-2',
      title: 'Being and Time',
      author: 'Martin Heidegger',
      year: 1927,
      summary: "Heidegger dives deep into what it means to exist and be human. He's notoriously difficult to read, but his ideas about authenticity, anxiety, and 'being-toward-death' changed philosophy forever. Prepare for some serious mental gymnastics, but the payoff is huge.",
      tags: ['Existentialism', 'Continental', 'Complex', 'Influential'],
      type: 'book',
      difficulty: 'advanced',
      estimatedReadTime: '6-8 weeks'
    },
    {
      id: 'philosophy-3',
      title: 'The Nicomachean Ethics',
      author: 'Aristotle',
      year: -350,
      summary: "Aristotle's guide to living well and being virtuous. He argues that happiness comes from developing good character and finding the right balance in everything. It's practical philosophy - less abstract theorizing, more 'here's how to actually live a good life.'",
      tags: ['Ancient', 'Ethics', 'Virtue', 'Practical'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '3-4 weeks'
    },
    {
      id: 'philosophy-4',
      title: 'The Stranger',
      author: 'Albert Camus',
      year: 1942,
      summary: "A guy kills someone almost by accident and doesn't seem to care about anything. Sounds depressing, but Camus uses this story to explore absurdism - the idea that life has no inherent meaning, but that's actually liberating. Short, powerful, and surprisingly optimistic.",
      tags: ['Existentialism', 'Absurdism', 'Literature', 'Accessible'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '1 week'
    },
    {
      id: 'philosophy-5',
      title: 'Critique of Pure Reason',
      author: 'Immanuel Kant',
      year: 1781,
      summary: "Kant tries to figure out what we can actually know and how we know it. He argues that our minds actively shape our experience of reality. It's incredibly difficult but revolutionary - basically created modern philosophy. Maybe read a good commentary alongside it!",
      tags: ['Classical', 'Epistemology', 'German Idealism', 'Challenging'],
      type: 'book',
      difficulty: 'advanced',
      estimatedReadTime: '8-10 weeks'
    }
  ],

  'history': [
    {
      id: 'history-1',
      title: 'The Guns of August',
      author: 'Barbara Tuchman',
      year: 1962,
      summary: "Tuchman tells the story of the first month of World War I like a thriller novel, but with rigorous historical research. She shows how a series of bad decisions and miscalculations led to the catastrophe that defined the 20th century. Gripping and tragic.",
      tags: ['World War I', 'Military History', 'Narrative', 'Pulitzer Prize'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '2-3 weeks'
    },
    {
      id: 'history-2',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      year: 2014,
      summary: "The epic story of humanity from hunter-gatherers to space explorers. Harari weaves together anthropology, biology, and history to explain how we became the dominant species. Big ideas, engaging writing, and will change how you think about human civilization.",
      tags: ['Big History', 'Anthropology', 'Popular', 'Thought-Provoking'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '2-3 weeks'
    },
    {
      id: 'history-3',
      title: 'The Decline and Fall of the Roman Empire',
      author: 'Edward Gibbon',
      year: 1776,
      summary: "Gibbon's masterpiece chronicles Rome's transformation from republic to empire to collapse. His prose is elegant, his insights sharp, and his scope breathtaking. It's long but rewarding - you'll understand how one of history's greatest civilizations rose and fell.",
      tags: ['Classical', 'Rome', 'Epic', 'Masterwork'],
      type: 'book',
      difficulty: 'advanced',
      estimatedReadTime: '8-12 weeks'
    },
    {
      id: 'history-4',
      title: 'The Cold War',
      author: 'John Lewis Gaddis',
      year: 2005,
      summary: "Gaddis explains the 45-year standoff between superpowers with clarity and balance. He shows how ideology, personality, and accident shaped the conflict that defined the second half of the 20th century. Essential for understanding modern geopolitics.",
      tags: ['20th Century', 'Geopolitics', 'Comprehensive', 'Authoritative'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '3-4 weeks'
    }
  ],

  'social-issues': [
    {
      id: 'social-1',
      title: 'The Power Broker',
      author: 'Robert Caro',
      year: 1974,
      summary: "The biography of Robert Moses, the man who shaped modern New York through sheer will and political cunning. Caro shows how power really works in American politics - it's part biography, part cautionary tale about unchecked authority. Long but absolutely gripping.",
      tags: ['Biography', 'Power', 'Urban Planning', 'Pulitzer Prize'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '4-6 weeks'
    },
    {
      id: 'social-2',
      title: 'The New Jim Crow',
      author: 'Michelle Alexander',
      year: 2010,
      summary: "Alexander argues that mass incarceration functions as a new system of racial control, replacing Jim Crow laws. She connects dots between criminal justice policy and racial inequality that many people miss. Essential reading for understanding American criminal justice.",
      tags: ['Criminal Justice', 'Race', 'Policy', 'Contemporary'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '2-3 weeks'
    },
    {
      id: 'social-3',
      title: 'Bowling Alone',
      author: 'Robert Putnam',
      year: 2000,
      summary: "Putnam documents the decline of social connections in America - from bowling leagues to dinner parties to civic organizations. He shows how this 'social capital' matters for democracy and individual wellbeing. Makes you want to call an old friend or join a club!",
      tags: ['Social Capital', 'Community', 'Democracy', 'Sociology'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '3 weeks'
    }
  ],

  'culture': [
    {
      id: 'culture-1',
      title: 'The Interpretation of Cultures',
      author: 'Clifford Geertz',
      year: 1973,
      summary: "Geertz revolutionized anthropology by treating culture as a web of meanings that people create and inhabit. His concept of 'thick description' changed how we study human societies. Academic but accessible, and full of fascinating examples from his fieldwork.",
      tags: ['Anthropology', 'Culture Theory', 'Methodology', 'Influential'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '3-4 weeks'
    },
    {
      id: 'culture-2',
      title: 'The Golden Bough',
      author: 'James George Frazer',
      year: 1890,
      summary: "Frazer's massive study of mythology, religion, and folklore from around the world. He traces common patterns in human beliefs about magic, kingship, and the sacred. It's dated in some ways, but still fascinating for its scope and influence on literature and psychology.",
      tags: ['Mythology', 'Religion', 'Comparative', 'Classic'],
      type: 'book',
      difficulty: 'advanced',
      estimatedReadTime: '6-8 weeks'
    }
  ],

  'education': [
    {
      id: 'education-1',
      title: 'Pedagogy of the Oppressed',
      author: 'Paulo Freire',
      year: 1968,
      summary: "Freire argues that education should help people critically examine their world rather than just accept it. His ideas about 'banking education' vs. 'problem-posing education' influenced teachers worldwide. Dense with theory but passionate about human liberation through learning.",
      tags: ['Critical Pedagogy', 'Social Justice', 'Brazil', 'Influential'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: '2-3 weeks'
    },
    {
      id: 'education-2',
      title: 'How Children Learn',
      author: 'John Holt',
      year: 1967,
      summary: "Holt observes how children naturally learn when they're curious and free from pressure. His insights sparked the unschooling movement and changed how many people think about education. Warm, observant, and full of respect for children's intelligence.",
      tags: ['Child Development', 'Alternative Education', 'Learning Theory', 'Accessible'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '2 weeks'
    }
  ],

  'collections': [
    {
      id: 'collections-1',
      title: 'The Best American Essays',
      author: 'Various Authors',
      year: 2023,
      summary: "A yearly collection of the best essays published in American magazines. Each volume has a different guest editor, so you get exposed to different tastes and perspectives. Perfect for discovering new writers and seeing what's happening in contemporary non-fiction.",
      tags: ['Essays', 'Contemporary', 'Anthology', 'Writing'],
      type: 'book',
      difficulty: 'beginner',
      estimatedReadTime: '4-6 weeks'
    },
    {
      id: 'collections-2',
      title: 'The Norton Anthology of World Literature',
      author: 'Various Authors',
      year: 2018,
      summary: "The ultimate survey of world literature from ancient times to today. Massive but well-organized, with helpful introductions and notes. Great for exploring different literary traditions or just having a comprehensive reference on your shelf.",
      tags: ['Literature', 'World', 'Reference', 'Comprehensive'],
      type: 'book',
      difficulty: 'intermediate',
      estimatedReadTime: 'Ongoing reference'
    }
  ]
};

export const ALL_TAGS = [
  'Beginner Friendly', 'Classic', 'Advanced', 'Journal', 'Popular',
  'Foundational', 'Modern', 'Contemporary', 'Historical', 'Philosophy',
  'Theory', 'Practical', 'Research-Based', 'Narrative', 'Biography',
  'Policy', 'International', 'American', 'European', 'Global',
  'Economics', 'Politics', 'Culture', 'Society', 'Science',
  'Literature', 'Reference', 'Anthology', 'Methodology'
];

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export const READING_TYPES = ['book', 'article', 'journal', 'paper'] as const;