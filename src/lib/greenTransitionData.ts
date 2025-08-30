export interface GreenTransitionEssay {
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

const generateGreenContent = (topic: string) => `
# ${topic}

Masa transisi hijau merupakan tantangan global yang memerlukan pendekatan komprehensif dan terstruktur. Dalam konteks perubahan iklim dan kebutuhan energi berkelanjutan, kita harus memahami kompleksitas permasalahan yang ada.

## Kondisi Saat Ini

Sebagian besar negara masih bergantung pada energi fosil untuk memenuhi kebutuhan energi nasional. Data menunjukkan bahwa 80% konsumsi energi global masih berasal dari sumber tidak terbarukan. Hal ini menciptakan dilema antara pertumbuhan ekonomi dan perlindungan lingkungan.

### Tantangan Utama

1. **Infrastruktur Legacy**: Sistem energi yang sudah mapan sulit untuk diubah dalam waktu singkat
2. **Biaya Transisi**: Investasi besar diperlukan untuk teknologi hijau
3. **Resistensi Politik**: Kepentingan ekonomi jangka pendek vs tujuan lingkungan jangka panjang
4. **Kesenjangan Teknologi**: Negara berkembang tertinggal dalam adopsi teknologi hijau

> "Transisi energi bukan hanya soal teknologi, tetapi juga tentang keadilan sosial dan ekonomi yang berkelanjutan."

## Solusi dan Rekomendasi

Untuk mencapai transisi yang efektif, diperlukan koordinasi antara:

- Kebijakan pemerintah yang mendukung
- Investasi swasta dalam teknologi bersih
- Edukasi masyarakat tentang pentingnya energi berkelanjutan
- Kerjasama internasional dalam transfer teknologi

### Tabel: Target Transisi Energi

| Sektor | Target 2030 | Target 2050 | Status Saat Ini |
|--------|-------------|-------------|-----------------|
| Energi Terbarukan | 50% | 80% | 30% |
| Transportasi Listrik | 30% | 70% | 10% |
| Efisiensi Energi | 40% | 60% | 25% |

## Kesimpulan

Transisi hijau memerlukan komitmen jangka panjang dari semua pihak. Tanpa langkah konkret hari ini, risiko perubahan iklim akan semakin mengancam generasi mendatang.

**Referensi:**
1. International Energy Agency (2024). World Energy Outlook
2. IPCC Climate Change Report (2023)
3. McKinsey Global Institute (2024). The Economics of Green Transition
`;

export const greenTransitionEssaysByPhase: Record<string, GreenTransitionEssay[]> = {
  'where-we-are-now': [
    {
      id: 'now-1',
      title: 'Snapshot Energi Global: Realitas vs Ambisi',
      snippet: 'Analisis komprehensif tentang kondisi transisi energi saat ini di tingkat global dan regional.',
      author: 'Dr. Sari Energi',
      date: 'Des 2024',
      readTime: '8 min',
      thumbnail: '/lovable-uploads/d49a1a46-b20a-499c-acc1-feff1e9ad4a8.png',
      content: generateGreenContent('Snapshot Energi Global: Realitas vs Ambisi'),
      phase: 'where-we-are-now'
    },
    {
      id: 'now-2',
      title: 'Infrastruktur Energi Indonesia: Tantangan dan Peluang',
      snippet: 'Evaluasi mendalam tentang kondisi infrastruktur energi Indonesia dalam konteks transisi hijau.',
      author: 'Prof. Hijau Nusantara',
      date: 'Des 2024',
      readTime: '12 min',
      thumbnail: '/lovable-uploads/30be2386-86bf-41aa-900b-683e1049cf08.png',
      content: generateGreenContent('Infrastruktur Energi Indonesia: Tantangan dan Peluang'),
      phase: 'where-we-are-now'
    },
    {
      id: 'now-3',
      title: 'Politik Energi: Antara Populisme dan Realisme',
      snippet: 'Bagaimana faktor politik mempengaruhi kebijakan transisi energi dan dampaknya terhadap masyarakat.',
      author: 'Dr. Politik Hijau',
      date: 'Nov 2024',
      readTime: '10 min',
      thumbnail: '/lovable-uploads/2fef84e0-2d64-4a55-a6c7-8e5541784690.png',
      content: generateGreenContent('Politik Energi: Antara Populisme dan Realisme'),
      phase: 'where-we-are-now'
    }
  ],
  'challenges-ahead': [
    {
      id: 'challenges-1',
      title: 'Kesenjangan Pembiayaan Transisi Hijau',
      snippet: 'Analisis gap antara kebutuhan dan ketersediaan pembiayaan untuk proyek energi berkelanjutan.',
      author: 'Ekonom Hijau',
      date: 'Des 2024',
      readTime: '9 min',
      thumbnail: '/placeholder.svg',
      content: generateGreenContent('Kesenjangan Pembiayaan Transisi Hijau'),
      phase: 'challenges-ahead'
    }
  ],
  'pathways-forward': [
    {
      id: 'pathways-1',
      title: 'Roadmap Transisi: Dari Visi ke Implementasi',
      snippet: 'Strategi konkret untuk mewujudkan transisi energi yang inklusif dan berkelanjutan.',
      author: 'Strategis Masa Depan',
      date: 'Des 2024',
      readTime: '15 min',
      thumbnail: '/placeholder.svg',
      content: generateGreenContent('Roadmap Transisi: Dari Visi ke Implementasi'),
      phase: 'pathways-forward'
    }
  ]
};

export const getAllGreenTransitionEssaysForPhase = (phase: string): GreenTransitionEssay[] => {
  return greenTransitionEssaysByPhase[phase] || [];
};

export const getGreenTransitionEssayById = (id: string): GreenTransitionEssay | undefined => {
  for (const phaseEssays of Object.values(greenTransitionEssaysByPhase)) {
    const essay = phaseEssays.find(essay => essay.id === id);
    if (essay) return essay;
  }
  return undefined;
};

export const getGreenTransitionPhaseTitle = (phase: string): string => {
  const phaseTitles: Record<string, string> = {
    'where-we-are-now': 'Where We Are Now',
    'challenges-ahead': 'Challenges Ahead', 
    'pathways-forward': 'Pathways Forward'
  };
  return phaseTitles[phase] || phase;
};

export const getGreenTransitionPhases = () => [
  { id: 'where-we-are-now', title: 'Where We Are Now', description: 'Current state of global energy transition' },
  { id: 'challenges-ahead', title: 'Challenges Ahead', description: 'Barriers and obstacles to overcome' },
  { id: 'pathways-forward', title: 'Pathways Forward', description: 'Solutions and implementation strategies' }
];

// Get next and previous essays within the same phase
export const getAdjacentGreenTransitionEssays = (currentId: string, phase: string) => {
  const essays = getAllGreenTransitionEssaysForPhase(phase);
  const currentIndex = essays.findIndex(essay => essay.id === currentId);
  
  return {
    previous: currentIndex > 0 ? essays[currentIndex - 1] : null,
    next: currentIndex < essays.length - 1 ? essays[currentIndex + 1] : null
  };
};

// Get related essays from other phases
export const getRelatedGreenTransitionEssays = (currentId: string, limit: number = 3): GreenTransitionEssay[] => {
  const allEssays = Object.values(greenTransitionEssaysByPhase).flat();
  return allEssays
    .filter(essay => essay.id !== currentId)
    .slice(0, limit);
};