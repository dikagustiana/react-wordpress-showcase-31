import { GreenEssay } from '@/hooks/useGreenEssays';

export const dummyGreenEssays: Record<string, Partial<GreenEssay>[]> = {
  'where-we-are-now': [
    {
      id: 'dummy-1-where-we-are-now',
      slug: 'politik-energi-antara-populisme-dan-realisme',
      section: 'where-we-are-now',
      title: 'Politik Energi: Antara Populisme dan Realisme',
      subtitle: 'Analisis mendalam tentang dinamika politik energi Indonesia dan bagaimana populisme mempengaruhi kebijakan transisi energi yang realistis.',
      author_name: 'Dr. Politik Hijau',
      cover_image_url: '/lovable-uploads/d49a1a46-b20a-499c-acc1-feff1e9ad4a8.png',
      status: 'published' as const,
      reading_time: 8,
      created_at: '2024-11-15T10:00:00Z',
      updated_at: '2024-11-15T10:00:00Z',
      content_html: `
        <h1>Politik Energi: Antara Populisme dan Realisme</h1>
        
        <p>Transisi energi global sedang menghadapi tantangan kompleks yang memerlukan pendekatan holistik dan realistis. Di Indonesia, dinamika politik energi seringkali terperangkap antara narasi populis dan kebutuhan teknis yang sesungguhnya.</p>
        
        <h2>Kondisi Saat Ini</h2>
        
        <p>Indonesia masih bergantung pada energi fosil untuk sebagian besar kebutuhan energinya. Meski demikian, pemerintah telah berkomitmen untuk mencapai net zero emission pada 2060 atau lebih cepat dengan dukungan internasional.</p>
        
        <h3>Tantangan Utama</h3>
        
        <ol>
          <li><strong>Infrastruktur Legacy</strong> - Ketergantungan pada infrastruktur energi fosil yang sudah ada</li>
          <li><strong>Biaya Transisi</strong> - Investasi besar yang diperlukan untuk teknologi energi bersih</li>
          <li><strong>Resistensi Politik</strong> - Kepentingan berbagai stakeholder yang saling bertentangan</li>
          <li><strong>Kesenjangan Teknologi</strong> - Gap antara teknologi yang dibutuhkan dan yang tersedia</li>
        </ol>
        
        <blockquote>
          <p>"Transisi energi bukan hanya soal teknologi, tetapi juga tentang transformasi sosial, ekonomi, dan politik yang menyeluruh."</p>
        </blockquote>
        
        <h2>Solusi dan Rekomendasi</h2>
        
        <ul>
          <li>Kebijakan pemerintah yang konsisten dan berkelanjutan</li>
          <li>Investasi teknologi bersih dengan dukungan swasta</li>
          <li>Edukasi masyarakat tentang pentingnya transisi energi</li>
          <li>Kerjasama internasional dalam transfer teknologi</li>
        </ul>
        
        <p>Ke depan, Indonesia perlu mengembangkan roadmap yang realistis namun ambisius, dengan mempertimbangkan kapasitas lokal, potensi sumber daya, dan kebutuhan masyarakat. Kolaborasi antara pemerintah, sektor swasta, dan civil society menjadi kunci untuk mewujudkan transisi energi yang adil dan berkelanjutan.</p>
      `
    },
    {
      id: 'dummy-2-where-we-are-now',
      slug: 'snapshot-energi-global-realitas-vs-ambisi',
      section: 'where-we-are-now',
      title: 'Snapshot Energi Global: Realitas vs Ambisi',
      subtitle: 'Perbandingan antara target global transisi energi dengan kenyataan implementasi di berbagai negara, termasuk gap yang masih harus diatasi.',
      author_name: 'Dr. Sari Energi',
      cover_image_url: '/lovable-uploads/2fef84e0-2d64-4a55-a6c7-8e5541784690.png',
      status: 'published' as const,
      reading_time: 10,
      created_at: '2024-11-20T10:00:00Z',
      updated_at: '2024-11-20T10:00:00Z',
      content_html: `
        <h1>Snapshot Energi Global: Realitas vs Ambisi</h1>
        
        <p>Dunia sedang berada di persimpangan penting dalam sejarah energi. Target ambisius untuk mencapai net zero emission pada 2050 bertemu dengan realitas implementasi yang penuh tantangan.</p>
        
        <h2>Kondisi Global</h2>
        
        <p>Meskipun investasi dalam energi terbarukan terus meningkat, kecepatan transisi saat ini masih belum mencukupi untuk memenuhi target Paris Agreement. Gap antara ambisi dan realitas masih sangat lebar.</p>
        
        <h3>Data Terkini</h3>
        
        <ul>
          <li>Kapasitas energi terbarukan global meningkat 10% pada 2023</li>
          <li>Investasi mencapai $1.8 triliun dalam teknologi energi bersih</li>
          <li>Namun, emisi CO2 dari sektor energi masih meningkat 1.1%</li>
        </ul>
        
        <blockquote>
          <p>"Kita membutuhkan transformasi sistem energi yang lebih cepat dan lebih dalam dari yang pernah dilakukan sebelumnya."</p>
        </blockquote>
        
        <h2>Gap vs Ambisi</h2>
        
        <p>Analisis menunjukkan bahwa untuk mencapai target 1.5°C, dunia perlu mengurangi emisi hingga 45% pada 2030 dibanding level 2010. Saat ini, trajectory kita masih jauh dari target tersebut.</p>
        
        <h3>Faktor Penghambat</h3>
        
        <ol>
          <li>Ketergantungan pada infrastruktur fosil existing</li>
          <li>Tantangan finansial dan akses modal</li>
          <li>Kebijakan yang belum konsisten secara global</li>
          <li>Resistensi dari industri tradisional</li>
        </ol>
        
        <h2>Rekomendasi</h2>
        
        <p>Diperlukan pendekatan holistik yang mengintegrasikan kebijakan, teknologi, dan keuangan untuk mempercepat transisi energi global. Kolaborasi internasional menjadi kunci utama keberhasilan.</p>
      `
    },
    {
      id: 'dummy-3-where-we-are-now',
      slug: 'infrastruktur-energi-indonesia-tantangan-dan-peluang',
      section: 'where-we-are-now',
      title: 'Infrastruktur Energi Indonesia: Tantangan dan Peluang',
      subtitle: 'Evaluasi komprehensif kondisi infrastruktur energi Indonesia saat ini dan identifikasi peluang untuk modernisasi dan transisi.',
      author_name: 'Prof. Hijau Nusantara',
      cover_image_url: '/lovable-uploads/30be2386-86bf-41aa-900b-683e1049cf08.png',
      status: 'published' as const,
      reading_time: 12,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      content_html: `
        <h1>Infrastruktur Energi Indonesia: Tantangan dan Peluang</h1>
        
        <p>Indonesia memiliki potensi energi terbarukan yang sangat besar namun infrastruktur yang masih didominasi oleh energi fosil. Transisi memerlukan strategi yang tepat dan investasi yang berkelanjutan.</p>
        
        <h2>Kondisi Infrastruktur Saat Ini</h2>
        
        <p>Indonesia memiliki kapasitas listrik terpasang sekitar 75 GW, dengan mayoritas berasal dari PLTU batubara. Sistem transmisi dan distribusi masih menghadapi berbagai keterbatasan, terutama di daerah terpencil.</p>
        
        <h3>Tantangan Utama</h3>
        
        <ul>
          <li><strong>Geografis</strong> - Sebaran pulau yang luas memerlukan solusi infrastruktur yang berbeda</li>
          <li><strong>Finansial</strong> - Kebutuhan investasi yang sangat besar untuk modernisasi</li>
          <li><strong>Teknis</strong> - Integrasi energi terbarukan ke grid yang existing</li>
          <li><strong>Regulasi</strong> - Kebijakan yang belum sepenuhnya mendukung transisi</li>
        </ul>
        
        <blockquote>
          <p>"Indonesia memiliki potensi energi terbarukan hingga 3,600 GW, namun pemanfaatannya masih kurang dari 3%."</p>
        </blockquote>
        
        <h2>Peluang Besar</h2>
        
        <h3>Potensi Energi Terbarukan</h3>
        
        <ol>
          <li><strong>Solar PV</strong> - 207 GW potensi dengan irradiasi yang konsisten</li>
          <li><strong>Hydro</strong> - 95 GW dari sumber air yang melimpah</li>
          <li><strong>Wind</strong> - 155 GW terutama di kawasan timur Indonesia</li>
          <li><strong>Geothermal</strong> - 24 GW dari aktivitas vulkanik</li>
          <li><strong>Bioenergy</strong> - Potensi besar dari biomass dan biogas</li>
        </ol>
        
        <h2>Roadmap Modernisasi</h2>
        
        <p>Diperlukan pendekatan bertahap yang dimulai dari pengembangan smart grid, peningkatan kapasitas transmisi, dan integrasi energi terbarukan secara gradual. Kerjasama dengan sektor swasta dan dukungan internasional menjadi kunci keberhasilan.</p>
        
        <h3>Kesimpulan</h3>
        
        <p>Meski menghadapi tantangan besar, Indonesia memiliki semua elemen yang diperlukan untuk menjadi leader dalam transisi energi di kawasan. Yang dibutuhkan adalah komitmen politik yang kuat dan implementasi yang konsisten.</p>
      `
    }
  ],
  'challenges-ahead': [
    {
      id: 'dummy-1-challenges-ahead',
      slug: 'ketergantungan-fossil-fuel-hambatan-utama',
      section: 'challenges-ahead',
      title: 'Ketergantungan Fossil Fuel: Hambatan Utama',
      subtitle: 'Menganalisis mengapa ketergantungan pada bahan bakar fosil menjadi hambatan terbesar dalam transisi energi dan strategi untuk mengatasinya.',
      author_name: 'Dr. Politik Hijau',
      cover_image_url: '/lovable-uploads/e4fef01c-e480-414e-8764-4044cb4cc1aa.png',
      status: 'published' as const,
      reading_time: 9,
      created_at: '2024-11-18T10:00:00Z',
      updated_at: '2024-11-18T10:00:00Z',
      content_html: `
        <h1>Ketergantungan Fossil Fuel: Hambatan Utama</h1>
        
        <p>Ketergantungan pada bahan bakar fosil menjadi hambatan struktural terbesar dalam transisi energi global. Lock-in effect dari investasi infrastruktur yang sudah ada menciptakan resistensi terhadap perubahan.</p>
        
        <h2>Akar Permasalahan</h2>
        
        <p>Sistem energi fosil telah dibangun selama lebih dari satu abad dengan investasi triliunan dollar. Infrastruktur ini tidak hanya mencakup pembangkit listrik, namun juga seluruh rantai nilai dari ekstraksi hingga konsumsi.</p>
        
        <h3>Dimensi Ketergantungan</h3>
        
        <ul>
          <li><strong>Ekonomi</strong> - Industri fosil menyerap jutaan tenaga kerja dan berkontribusi signifikan pada GDP</li>
          <li><strong>Politik</strong> - Lobby industri yang kuat dan kepentingan geopolitik</li>
          <li><strong>Sosial</strong> - Masyarakat yang bergantung pada industri fosil untuk mata pencaharian</li>
          <li><strong>Teknis</strong> - Infrastruktur existing yang belum habis masa pakainya</li>
        </ul>
        
        <blockquote>
          <p>"Transisi energi bukan hanya tentang mengganti teknologi, tetapi mengubah seluruh sistem ekonomi dan sosial yang terkait."</p>
        </blockquote>
        
        <h2>Strategi Pelepasan Bertahap</h2>
        
        <h3>Just Transition</h3>
        
        <p>Konsep just transition menekankan pentingnya memastikan bahwa pekerja dan komunitas yang bergantung pada industri fosil tidak ditinggalkan dalam proses transisi.</p>
        
        <ol>
          <li>Retraining dan reskilling pekerja</li>
          <li>Diversifikasi ekonomi daerah</li>
          <li>Investasi dalam industri hijau baru</li>
          <li>Perlindungan sosial selama masa transisi</li>
        </ol>
        
        <h3>Policy Mix</h3>
        
        <p>Dibutuhkan kombinasi kebijakan yang tepat:</p>
        
        <ul>
          <li>Carbon pricing untuk menginternalisasi eksternalitas</li>
          <li>Subsidi untuk teknologi energi bersih</li>
          <li>Regulasi yang mendorong phase-out bertahap</li>
          <li>Investasi publik dalam R&D energi terbarukan</li>
        </ul>
        
        <h2>Lessons Learned</h2>
        
        <p>Pengalaman berbagai negara menunjukkan bahwa transisi yang berhasil memerlukan pendekatan yang disesuaikan dengan konteks lokal, timeline yang realistis, dan dukungan politik yang berkelanjutan.</p>
      `
    },
    {
      id: 'dummy-2-challenges-ahead',
      slug: 'keadilan-energi-siapa-yang-tertinggal',
      section: 'challenges-ahead',
      title: 'Keadilan Energi: Siapa yang Tertinggal?',
      subtitle: 'Perspektif tentang aspek keadilan sosial dalam transisi energi dan bagaimana memastikan tidak ada kelompok yang tertinggal.',
      author_name: 'Dr. Sari Energi',
      cover_image_url: '/lovable-uploads/faf0d242-4524-4b6b-9fd8-c9f4478afc86.png',
      status: 'published' as const,
      reading_time: 11,
      created_at: '2024-11-25T10:00:00Z',
      updated_at: '2024-11-25T10:00:00Z',
      content_html: `
        <h1>Keadilan Energi: Siapa yang Tertinggal?</h1>
        
        <p>Transisi energi tidak akan bermakna jika tidak memperhatikan aspek keadilan sosial. Risiko terbesar adalah terciptanya kesenjangan baru antara mereka yang dapat mengakses energi bersih dan yang tidak.</p>
        
        <h2>Definisi Keadilan Energi</h2>
        
        <p>Keadilan energi mencakup tiga dimensi utama: distributif (akses yang merata), prosedural (partisipasi dalam pengambilan keputusan), dan pengakuan (mengakui kebutuhan yang berbeda dari berbagai kelompok).</p>
        
        <h3>Kelompok Rentan</h3>
        
        <ul>
          <li><strong>Masyarakat Miskin</strong> - Tidak mampu mengakses teknologi energi bersih yang masih mahal</li>
          <li><strong>Daerah Terpencil</strong> - Infrastruktur energi terbarukan belum menjangkau seluruh wilayah</li>
          <li><strong>Pekerja Fosil</strong> - Menghadapi risiko kehilangan pekerjaan tanpa alternatif yang memadai</li>
          <li><strong>Perempuan</strong> - Seringkali tidak terlibat dalam pengambilan keputusan energi</li>
        </ul>
        
        <blockquote>
          <p>"Transisi energi yang adil berarti memastikan tidak ada yang tertinggal dalam perjalanan menuju masa depan yang berkelanjutan."</p>
        </blockquote>
        
        <h2>Manifestasi Ketidakadilan</h2>
        
        <h3>Energy Poverty</h3>
        
        <p>Sekitar 759 juta orang di dunia masih tidak memiliki akses listrik, sementara 2.6 miliar orang masih mengandalkan biomass tradisional untuk memasak. Transisi energi harus memastikan akses universal ini tercapai.</p>
        
        <h3>Distributional Injustice</h3>
        
        <ol>
          <li>Manfaat transisi energi cenderung dinikmati oleh kelas menengah-atas</li>
          <li>Biaya transisi seringkali ditanggung oleh masyarakat berpenghasilan rendah</li>
          <li>Pembangkit energi terbarukan tidak selalu berlokasi dekat dengan konsumen</li>
        </ol>
        
        <h2>Solusi dan Rekomendasi</h2>
        
        <h3>Pendekatan Inklusif</h3>
        
        <p>Strategi yang diperlukan:</p>
        
        <ul>
          <li>Subsidi silang untuk memastikan akses energi bersih bagi masyarakat miskin</li>
          <li>Program community-owned renewable energy</li>
          <li>Pelibatan aktif masyarakat dalam perencanaan proyek energi</li>
          <li>Capacity building untuk kelompok marginal</li>
        </ul>
        
        <h3>Policy Framework</h3>
        
        <p>Pemerintah perlu mengembangkan kerangka kebijakan yang secara eksplisit memasukkan aspek keadilan dalam setiap program transisi energi. Monitoring dan evaluasi dampak sosial harus menjadi bagian integral dari implementasi.</p>
        
        <h2>Kesimpulan</h2>
        
        <p>Keadilan energi bukan hanya imperatif moral, tetapi juga kunci keberhasilan transisi energi. Tanpa dukungan sosial yang luas, transisi energi akan menghadapi resistensi dan tidak akan berkelanjutan dalam jangka panjang.</p>
      `
    },
    {
      id: 'dummy-3-challenges-ahead',
      slug: 'geopolitik-transisi-risiko-dan-konflik-baru',
      section: 'challenges-ahead',
      title: 'Geopolitik Transisi: Risiko dan Konflik Baru',
      subtitle: 'Dampak transisi energi terhadap geopolitik global dan potensi risiko serta konflik baru yang dapat muncul.',
      author_name: 'Prof. Hijau Nusantara',
      cover_image_url: '/lovable-uploads/d49a1a46-b20a-499c-acc1-feff1e9ad4a8.png',
      status: 'published' as const,
      reading_time: 10,
      created_at: '2024-12-05T10:00:00Z',
      updated_at: '2024-12-05T10:00:00Z',
      content_html: `
        <h1>Geopolitik Transisi: Risiko dan Konflik Baru</h1>
        
        <p>Transisi energi global tidak hanya mengubah cara kita memproduksi dan mengkonsumsi energi, tetapi juga mengubah peta kekuatan geopolitik dunia. Negara-negara yang selama ini mendominasi karena sumber daya fosil akan menghadapi tantangan baru.</p>
        
        <h2>Pergeseran Kekuatan Global</h2>
        
        <p>Era energi terbarukan menciptakan peta kekuatan yang berbeda. Negara dengan akses ke mineral kritikal seperti lithium, cobalt, dan rare earth elements akan menjadi pemain kunci baru dalam sistem energi global.</p>
        
        <h3>Winners dan Losers</h3>
        
        <ul>
          <li><strong>Potential Winners</strong> - China (solar/manufacturing), Norway (hydro), Chile (lithium), Congo (cobalt)</li>
          <li><strong>Potential Losers</strong> - Saudi Arabia, Russia, Venezuela (exportir fosil tradisional)</li>
          <li><strong>Mixed Impact</strong> - Indonesia (coal vs nickel), Australia (coal vs critical minerals)</li>
        </ul>
        
        <blockquote>
          <p>"Transisi energi menciptakan geografi kekuatan baru yang akan menentukan tatanan geopolitik abad ke-21."</p>
        </blockquote>
        
        <h2>Risiko dan Konflik Potensial</h2>
        
        <h3>Resource Wars 2.0</h3>
        
        <p>Kompetisi untuk menguasai mineral kritikal dapat memicu konflik baru:</p>
        
        <ol>
          <li><strong>Supply Chain Vulnerabilities</strong> - Konsentrasi produksi di beberapa negara</li>
          <li><strong>Trade Wars</strong> - Proteksionisme dalam teknologi energi bersih</li>
          <li><strong>Resource Nationalism</strong> - Negara membatasi ekspor mineral kritikal</li>
          <li><strong>Technology Competition</strong> - Persaingan standar dan teknologi</li>
        </ol>
        
        <h3>Regional Tensions</h3>
        
        <p>Beberapa region akan mengalami ketegangan khusus:</p>
        
        <ul>
          <li>Arctic - akses ke rare earth dan renewable energy potential</li>
          <li>South China Sea - shipping routes untuk komponen teknologi bersih</li>
          <li>Africa - eksploitasi mineral vs pembangunan berkelanjutan</li>
          <li>Middle East - diversifikasi ekonomi dari ketergantungan minyak</li>
        </ul>
        
        <h2>Strategi Mitigasi</h2>
        
        <h3>Multilateral Cooperation</h3>
        
        <p>Diperlukan kerjasama internasional yang kuat untuk mencegah konflik:</p>
        
        <ul>
          <li>International frameworks untuk fair access ke critical minerals</li>
          <li>Technology sharing agreements</li>
          <li>Joint development programs</li>
          <li>Conflict prevention mechanisms</li>
        </ul>
        
        <h3>Diversification Strategies</h3>
        
        <p>Negara-negara perlu mengembangkan strategi diversifikasi untuk mengurangi ketergantungan dan risiko geopolitik.</p>
        
        <h2>Indonesia's Position</h2>
        
        <p>Indonesia berada dalam posisi strategis dengan memiliki cadangan nickel terbesar dunia (kunci untuk baterai) namun juga masih bergantung pada ekspor batubara. Strategi yang tepat dapat menjadikan Indonesia pemain penting dalam geopolitik energi masa depan.</p>
        
        <h2>Outlook</h2>
        
        <p>Transisi energi akan menciptakan tatanan geopolitik yang lebih multipolar namun juga lebih kompleks. Keberhasilan navigasi dalam landscape ini akan menentukan posisi negara-negara dalam sistem internasional masa depan.</p>
      `
    }
  ],
  'pathways-forward': [
    {
      id: 'dummy-1-pathways-forward',
      slug: 'peta-jalan-net-zero-2060-sektor-prioritas',
      section: 'pathways-forward',
      title: 'Peta Jalan Net Zero 2060: Sektor Prioritas',
      subtitle: 'Roadmap detail menuju net zero emission 2060 dengan identifikasi sektor-sektor prioritas dan langkah-langkah konkret.',
      author_name: 'Dr. Politik Hijau',
      cover_image_url: '/lovable-uploads/2fef84e0-2d64-4a55-a6c7-8e5541784690.png',
      status: 'published' as const,
      reading_time: 12,
      created_at: '2024-11-22T10:00:00Z',
      updated_at: '2024-11-22T10:00:00Z',
      content_html: `
        <h1>Peta Jalan Net Zero 2060: Sektor Prioritas</h1>
        
        <p>Indonesia telah berkomitmen untuk mencapai net zero emission pada 2060 atau lebih cepat dengan dukungan internasional. Roadmap yang realistis memerlukan identifikasi sektor prioritas dan langkah-langkah konkret yang dapat diimplementasikan secara bertahap.</p>
        
        <h2>Target dan Timeline</h2>
        
        <p>Untuk mencapai net zero 2060, Indonesia perlu mengurangi emisi sebesar 41% pada 2030 (dibanding business as usual) dan 83% pada 2050. Ini memerlukan transformasi fundamental di semua sektor ekonomi.</p>
        
        <h3>Sektor Prioritas</h3>
        
        <ol>
          <li><strong>Sektor Energi (40% emisi)</strong> - Transisi dari PLTU batubara ke energi terbarukan</li>
          <li><strong>FOLU - Forestry and Land Use (17% emisi)</strong> - Mencegah deforestasi dan restorasi lahan</li>
          <li><strong>Waste Management (7% emisi)</strong> - Pengelolaan sampah yang berkelanjutan</li>
          <li><strong>Industri Proses (13% emisi)</strong> - Dekarbonisasi sektor semen, baja, dan petrokimia</li>
          <li><strong>Transportasi (12% emisi)</strong> - Elektrifikasi kendaraan dan modal shift</li>
          <li><strong>Pertanian (11% emisi)</strong> - Praktik pertanian berkelanjutan</li>
        </ol>
        
        <blockquote>
          <p>"Net zero bukan hanya tentang mengurangi emisi, tetapi juga membangun ekonomi yang lebih resilient dan berkelanjutan."</p>
        </blockquote>
        
        <h2>Roadmap per Fase</h2>
        
        <h3>2024-2030: Foundation Phase</h3>
        
        <ul>
          <li>Moratorium PLTU batubara baru</li>
          <li>Akselerasi pembangunan energi terbarukan hingga 23% dari energy mix</li>
          <li>Carbon tax implementation di sektor prioritas</li>
          <li>Green taxonomy dan sustainable finance framework</li>
        </ul>
        
        <h3>2030-2040: Acceleration Phase</h3>
        
        <ul>
          <li>Phase-out PLTU batubara secara bertahap</li>
          <li>Energi terbarukan mencapai 40% dari energy mix</li>
          <li>Elektrifikasi massal transportasi publik</li>
          <li>Industrial decarbonization dengan teknologi CCUS</li>
        </ul>
        
        <h3>2040-2060: Deep Decarbonization</h3>
        
        <ul>
          <li>Energi terbarukan dominan (70%+)</li>
          <li>Hard-to-abate sectors menggunakan hydrogen dan ammonia</li>
          <li>Carbon removal technologies</li>
          <li>Net zero economy fully operational</li>
        </ul>
        
        <h2>Kebutuhan Investasi</h2>
        
        <p>Estimasi kebutuhan investasi untuk mencapai net zero adalah $3.5-4 triliun hingga 2060, atau sekitar $135-155 miliar per tahun. Ini memerlukan mobilisasi sektor swasta dan dukungan keuangan internasional.</p>
        
        <h3>Enablers Kunci</h3>
        
        <ol>
          <li>Policy certainty dan regulatory framework yang konsisten</li>
          <li>Carbon pricing yang efektif</li>
          <li>Green finance ecosystem</li>
          <li>Technology transfer dan innovation</li>
          <li>Capacity building dan just transition</li>
        </ol>
        
        <h2>Kesimpulan</h2>
        
        <p>Net zero 2060 adalah target yang ambisius namun achievable dengan commitment politik yang kuat, investasi yang memadai, dan kolaborasi semua stakeholder. Indonesia memiliki peluang untuk menjadi model transisi energi yang adil dan berkelanjutan bagi negara berkembang lainnya.</p>
      `
    },
    {
      id: 'dummy-2-pathways-forward',
      slug: 'inovasi-teknologi-energi-dari-ide-ke-implementasi',
      section: 'pathways-forward',
      title: 'Inovasi Teknologi Energi: Dari Ide ke Implementasi',
      subtitle: 'Proses transformasi inovasi teknologi energi bersih dari tahap konsep hingga implementasi massal di Indonesia.',
      author_name: 'Dr. Sari Energi',
      cover_image_url: '/lovable-uploads/30be2386-86bf-41aa-900b-683e1049cf08.png',
      status: 'published' as const,
      reading_time: 9,
      created_at: '2024-11-28T10:00:00Z',
      updated_at: '2024-11-28T10:00:00Z',
      content_html: `
        <h1>Inovasi Teknologi Energi: Dari Ide ke Implementasi</h1>
        
        <p>Transisi energi memerlukan tidak hanya teknologi yang sudah ada, tetapi juga inovasi berkelanjutan untuk menghadapi tantangan yang belum terpecahkan. Proses dari riset di laboratorium hingga implementasi komersial memerlukan ekosistem yang mendukung.</p>
        
        <h2>Landscape Inovasi Energi</h2>
        
        <p>Indonesia memiliki potensi besar untuk menjadi hub inovasi teknologi energi bersih di Asia Tenggara. Dengan sumber daya alam yang melimpah dan pasar domestik yang besar, Indonesia dapat menjadi testbed untuk teknologi energi terdepan.</p>
        
        <h3>Teknologi Prioritas</h3>
        
        <ul>
          <li><strong>Battery Technology</strong> - Memanfaatkan cadangan nickel untuk baterai EV dan grid storage</li>
          <li><strong>Green Hydrogen</strong> - Produksi hydrogen dari energi terbarukan untuk industri</li>
          <li><strong>Geothermal Innovation</strong> - Enhanced geothermal systems untuk potensi yang belum tereksploitasi</li>
          <li><strong>Bioenergy</strong> - Konversi waste to energy dan biofuel generasi kedua</li>
          <li><strong>Smart Grid</strong> - Integrasi energi terbarukan yang intermittent</li>
        </ul>
        
        <blockquote>
          <p>"Inovasi energi bukan hanya tentang teknologi, tetapi juga tentang business model dan sistem yang memungkinkan adoption secara massal."</p>
        </blockquote>
        
        <h2>Innovation Pipeline</h2>
        
        <h3>Research & Development</h3>
        
        <p>Tahap awal inovasi dimulai dari riset fundamental di universitas dan lembaga penelitian. Indonesia perlu memperkuat kapasitas R&D dengan:</p>
        
        <ol>
          <li>Meningkatkan anggaran R&D energi hingga 1% dari GDP</li>
          <li>Kolaborasi antara universitas, industri, dan pemerintah (triple helix)</li>
          <li>Attraction talent internasional dan diaspora Indonesia</li>
          <li>Centers of excellence untuk teknologi energi prioritas</li>
        </ol>
        
        <h3>Pilot & Demonstration</h3>
        
        <p>Teknologi yang promising perlu diuji dalam skala pilot sebelum komersialisasi:</p>
        
        <ul>
          <li>Test beds di berbagai kondisi geografis Indonesia</li>
          <li>Regulatory sandbox untuk teknologi baru</li>
          <li>Public-private partnership dalam demonstrasi</li>
          <li>Learning by doing untuk cost reduction</li>
        </ul>
        
        <h3>Scale-up & Commercialization</h3>
        
        <p>Tahap paling kritis adalah scale-up dari pilot menjadi commercial viable:</p>
        
        <ul>
          <li>Valley of death financing untuk bridging gap</li>
          <li>Market creation mechanisms</li>
          <li>Manufacturing capabilities dan supply chain</li>
          <li>Standards dan certification</li>
        </ul>
        
        <h2>Ekosistem Inovasi</h2>
        
        <h3>Key Players</h3>
        
        <p>Ekosistem inovasi yang sehat memerlukan berbagai aktor:</p>
        
        <ol>
          <li><strong>Research Institutes</strong> - ITB, IPB, BRIN untuk riset fundamental</li>
          <li><strong>Corporates</strong> - PLN, Pertamina, VALE untuk implementasi</li>
          <li><strong>Startups</strong> - Agility dan innovation culture</li>
          <li><strong>Government</strong> - Policy support dan early adoption</li>
          <li><strong>Investors</strong> - Patient capital untuk deep tech</li>
        </ol>
        
        <h3>Supporting Infrastructure</h3>
        
        <ul>
          <li>Innovation hubs dan incubators</li>
          <li>Testing facilities dan labs</li>
          <li>Skilled workforce development</li>
          <li>Intellectual property protection</li>
        </ul>
        
        <h2>Case Studies</h2>
        
        <h3>Success Story: Geothermal Innovation</h3>
        
        <p>Indonesia telah berhasil mengembangkan expertise dalam geothermal technology, dari riset di ITB hingga implementasi komersial oleh Pertamina Geothermal Energy. Ini menunjukkan bahwa dengan fokus yang tepat, Indonesia dapat menjadi leader teknologi tertentu.</p>
        
        <h2>Roadmap ke Depan</h2>
        
        <p>Untuk mempercepat inovasi teknologi energi, Indonesia perlu:</p>
        
        <ol>
          <li>National innovation strategy untuk energi bersih</li>
          <li>Dedicated funding untuk energy innovation</li>
          <li>International collaboration dan technology transfer</li>
          <li>Market-driven innovation dengan demand pull policies</li>
        </ol>
        
        <h2>Kesimpulan</h2>
        
        <p>Inovasi teknologi energi adalah kunci untuk mencapai transisi energi yang cost-effective dan sesuai dengan kondisi Indonesia. Dengan membangun ekosistem inovasi yang kuat, Indonesia dapat tidak hanya mengadopsi teknologi global tetapi juga menjadi eksportir solusi energi bersih.</p>
      `
    },
    {
      id: 'dummy-3-pathways-forward',
      slug: 'peran-finansial-hijau-instrumen-dan-investasi',
      section: 'pathways-forward',
      title: 'Peran Finansial Hijau: Instrumen dan Investasi',
      subtitle: 'Eksplorasi berbagai instrumen keuangan hijau dan strategi investasi yang dapat mendukung percepatan transisi energi.',
      author_name: 'Prof. Hijau Nusantara',
      cover_image_url: '/lovable-uploads/e4fef01c-e480-414e-8764-4044cb4cc1aa.png',
      status: 'published' as const,
      reading_time: 11,
      created_at: '2024-12-03T10:00:00Z',
      updated_at: '2024-12-03T10:00:00Z',
      content_html: `
        <h1>Peran Finansial Hijau: Instrumen dan Investasi</h1>
        
        <p>Transisi energi memerlukan investasi masif yang tidak dapat dipenuhi oleh sektor publik saja. Green finance menjadi kunci untuk memobilisasi modal swasta dalam mendukung ekonomi berkelanjutan. Indonesia perlu mengembangkan ekosistem keuangan hijau yang robust.</p>
        
        <h2>Kebutuhan Pembiayaan</h2>
        
        <p>Untuk mencapai target net zero 2060, Indonesia memerlukan investasi sekitar $3.5-4 triliun selama 35 tahun. Gap pembiayaan yang besar ini memerlukan inovasi dalam instrumen keuangan dan mobilisasi sektor swasta secara masif.</p>
        
        <h3>Sumber Pembiayaan</h3>
        
        <ul>
          <li><strong>Public Sector (20%)</strong> - APBN, BUMN, development finance institutions</li>
          <li><strong>Private Sector (60%)</strong> - Commercial banks, institutional investors, corporates</li>
          <li><strong>International (20%)</strong> - Climate finance, multilateral banks, bilateral cooperation</li>
        </ul>
        
        <blockquote>
          <p>"Green finance bukan hanya tentang uang, tetapi tentang mengalokasikan modal ke arah yang dapat menciptakan value jangka panjang."</p>
        </blockquote>
        
        <h2>Instrumen Keuangan Hijau</h2>
        
        <h3>Green Bonds</h3>
        
        <p>Indonesia telah menjadi pioneer dalam green sukuk dan sovereign green bonds. Market ini terus berkembang dengan berbagai inovator:</p>
        
        <ol>
          <li><strong>Government Green Bonds</strong> - Untuk pembiayaan infrastruktur hijau</li>
          <li><strong>Corporate Green Bonds</strong> - Perusahaan untuk proyek berkelanjutan</li>
          <li><strong>Green Sukuk</strong> - Instrumen syariah untuk pasar Muslim</li>
          <li><strong>Blue Bonds</strong> - Khusus untuk proyek kelautan dan perikanan</li>
        </ol>
        
        <h3>Transition Finance</h3>
        
        <p>Untuk sektor yang sulit didekarbonisasi, diperlukan transition finance:</p>
        
        <ul>
          <li>Sustainability-linked bonds dengan KPI target emisi</li>
          <li>Transition labels untuk sektor batubara yang beralih</li>
          <li>Just transition bonds untuk communities affected</li>
        </ul>
        
        <h3>Innovative Instruments</h3>
        
        <ul>
          <li><strong>Carbon Credits</strong> - Monetisasi carbon removal dan reduction</li>
          <li><strong>Blended Finance</strong> - Kombinasi public-private untuk risk mitigation</li>
          <li><strong>Green Loans</strong> - Kredit dengan preferential rates untuk proyek hijau</li>
          <li><strong>Impact Investment</strong> - Investasi dengan dual objectives</li>
        </ul>
        
        <h2>Ekosistem Green Finance</h2>
        
        <h3>Regulatory Framework</h3>
        
        <p>Regulator keuangan Indonesia telah mengembangkan framework yang progresif:</p>
        
        <ol>
          <li>Green Taxonomy untuk definisi aktivitas berkelanjutan</li>
          <li>Sustainable Finance Roadmap 2021-2025</li>
          <li>Climate risk disclosure requirements</li>
          <li>Green banking guidelines</li>
        </ol>
        
        <h3>Market Infrastructure</h3>
        
        <p>Infrastructure yang diperlukan untuk pasar keuangan hijau:</p>
        
        <ul>
          <li>Green bond listing di Bursa Efek Indonesia</li>
          <li>ESG rating agencies dan verification bodies</li>
          <li>Green index dan benchmark development</li>
          <li>Digital platforms untuk green finance access</li>
        </ul>
        
        <h2>Tantangan dan Solusi</h2>
        
        <h3>Key Challenges</h3>
        
        <ul>
          <li><strong>Greenwashing Risk</strong> - Lack of standardization dan monitoring</li>
          <li><strong>High Cost of Capital</strong> - Risk perception untuk teknologi baru</li>
          <li><strong>Currency Risk</strong> - Mismatch antara revenue (Rupiah) dan financing (USD)</li>
          <li><strong>Pipeline Shortage</strong> - Kurangnya proyek bankable</li>
        </ul>
        
        <h3>Solutions</h3>
        
        <ol>
          <li><strong>Standards Harmonization</strong> - Alignment dengan international standards</li>
          <li><strong>Risk Mitigation Instruments</strong> - Guarantees dan insurance products</li>
          <li><strong>Capacity Building</strong> - Training untuk financial institutions</li>
          <li><strong>Project Development Support</strong> - Technical assistance untuk project preparation</li>
        </ol>
        
        <h2>Role of Different Actors</h2>
        
        <h3>Commercial Banks</h3>
        
        <p>Perbankan Indonesia perlu meningkatkan portofolio green lending dari 5% saat ini menjadi 20% pada 2030 melalui:</p>
        
        <ul>
          <li>Dedicated green lending units</li>
          <li>Staff training dan green finance expertise</li>
          <li>Partnership dengan green technology providers</li>
        </ul>
        
        <h3>Institutional Investors</h3>
        
        <p>Pension funds, insurance companies, dan asset managers dapat menjadi anchor investors untuk proyek jangka panjang dengan:</p>
        
        <ul>
          <li>ESG integration dalam investment process</li>
          <li>Long-term asset allocation untuk infrastructure</li>
          <li>Stewardship dan active ownership</li>
        </ul>
        
        <h2>Outlook dan Rekomendasi</h2>
        
        <p>Green finance di Indonesia memiliki momentum yang kuat dengan dukungan regulatasi dan growing investor interest. Untuk akselerasi lebih lanjut diperlukan:</p>
        
        <ol>
          <li>National green finance strategy yang comprehensive</li>
          <li>Incentive alignment untuk mobilisasi private capital</li>
          <li>International cooperation untuk technology transfer</li>
          <li>Digital innovation untuk financial inclusion</li>
        </ol>
        
        <h2>Kesimpulan</h2>
        
        <p>Green finance adalah enabler kunci untuk transisi energi Indonesia. Dengan mengembangkan instrumen yang inovatif dan ekosistem yang supportive, Indonesia dapat menjadi regional leader dalam sustainable finance dan mencapai target climate ambition secara cost-effective.</p>
      `
    }
  ]
};