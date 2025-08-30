import { BookOpen } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import Card from '../../components/Card';
const Categories = () => {
  const breadcrumbItems = [{
    label: 'Home',
    path: '/'
  }, {
    label: 'Books and Academia',
    path: '/books-academia'
  }, {
    label: 'Categories'
  }];
  const categories = [{
    title: 'Economics and Political Economy',
    description: 'Economic theories, market analysis, and political economic frameworks',
    path: '/books/economics'
  }, {
    title: 'Political Theory and Ideologies',
    description: 'Political philosophy, governance systems, and ideological frameworks',
    path: '/books/political-theory'
  }, {
    title: 'Philosophy and Thinkers',
    description: 'Philosophical works, critical thinking, and influential thought leaders',
    path: '/books/philosophy'
  }, {
    title: 'History and Biographies',
    description: 'Historical accounts, biographical studies, and timeline analyses',
    path: '/books/history'
  }, {
    title: 'Social Issues and Governance',
    description: 'Social policy, governance structures, and public administration',
    path: '/books/social-issues'
  }, {
    title: 'Culture and Religion',
    description: 'Cultural studies, religious texts, and anthropological research',
    path: '/books/culture'
  }, {
    title: 'Development and Education',
    description: 'Educational theory, development studies, and learning methodologies',
    path: '/books/education'
  }, {
    title: 'Collections and Miscellaneous',
    description: 'Curated collections, reference materials, and diverse resources',
    path: '/books/collections'
  }];
  return <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{
            color: '#2F4B6E',
            fontFamily: 'Plus Jakarta Sans'
          }}>
              Books Categories
            </h1>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">"Even today, I tell my readers: look if your country's per capita income is below $10,000, please go ahead and pirate copy my books." - Ha-joon Chang </p>
          </section>

          {/* Categories Grid */}
          <section className="pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => <Card key={index} title={category.title} description={category.description} icon={BookOpen} path={category.path} buttonText="View Books" />)}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Categories;