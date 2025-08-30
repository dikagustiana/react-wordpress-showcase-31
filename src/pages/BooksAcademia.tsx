import { BookOpen, GraduationCap, Library } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

const BooksAcademia = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Books and Academia' }
  ];

  const cards = [
    {
      title: 'Books',
      description: 'Explore and upload reading materials across a wide range of subjects. Visit the books category page to upload files and folders into curated categories.',
      icon: BookOpen,
      path: '/books/categories',
      buttonText: 'Browse Categories'
    },
    {
      title: 'Finance & Accounting Books',
      description: 'List references that deepen your knowledge in finance and accounting—textbooks, handbooks, and practitioner guides. Add highlights, summaries, or detailed reviews.',
      icon: Library,
      path: '/books/finance-accounting',
      buttonText: 'View Collection'
    },
    {
      title: 'An Academic Temper',
      description: 'Cultivate the habits of rigorous inquiry: read critically, trace sources, replicate methods, and write with clarity. Share your notes, paper critiques, and templates for literature reviews.',
      icon: GraduationCap,
      path: '/books/academic-temper',
      buttonText: 'Open Resources'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#E6F4FF] py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#2F4B6E', fontFamily: 'Plus Jakarta Sans' }}>
              Books & Academia
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Use this page to showcase books and academic resources that support your learning in finance, accounting, and beyond. Curate, summarize, and link to the materials you recommend.
            </p>
          </div>
        </section>

        {/* Intro Text Section */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              Provide summaries and download links for your favourite books, finance & accounting references, and other scholarly materials. Use the placeholders below as a guide.
            </p>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((card, index) => (
                <Card
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  path={card.path}
                  buttonText={card.buttonText}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BooksAcademia;