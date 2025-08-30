import { Calendar, TrendingUp, Leaf, BookOpen, Search, Book, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

const Index = () => {
  const learningDoors = [
    {
      title: "Accounting",
      tagline: "Numbers Tell Stories.",
      description: "Learn to read financial statements and uncover the meaning behind every figure.",
      icon: Calendar,
      path: "/accounting"
    },
    {
      title: "Finance", 
      tagline: "Strategies for Tomorrow.",
      description: "Master financial thinking and make smarter business decisions for the future.",
      icon: TrendingUp,
      path: "/finance-101"
    },
    {
      title: "Green Transition",
      tagline: "Green Means Opportunity.",
      description: "Discover how sustainability unlocks innovation and shapes the economy of tomorrow.",
      icon: Leaf,
      path: "/green-transition"
    },
    {
      title: "Research & Analysis",
      tagline: "Think Like a Detective.",
      description: "Sharpen your critical thinking and research skills to analyze any piece of information.",
      icon: Search,
      path: "/critical-thinking-research"
    },
    {
      title: "Books & Academia",
      tagline: "Books That Change You.",
      description: "Explore powerful reads that expand your knowledge and reshape your perspective.",
      icon: Book,
      path: "/books-academia"
    },
    {
      title: "English Practice",
      tagline: "From Zero to 7.5.",
      description: "Follow a guided path to build your English step by step — all the way to achieving your IELTS dream score.",
      icon: MessageSquare,
      path: "/english-ielts"
    }
  ];

  const scrollToPaths = () => {
    const pathsSection = document.getElementById('paths-section');
    if (pathsSection) {
      pathsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image with Blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/lovable-uploads/30be2386-86bf-41aa-900b-683e1049cf08.png')`,
              filter: 'blur(4px)',
              transform: 'scale(1.1)' // Prevent blur edges
            }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Every Great Story Begins with Someone Who Was Scared but Did It Anyway
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Just begin. Messy, nervous, unsure. That's how the best stories start
            </p>
            <button 
              onClick={scrollToPaths}
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 animate-scale-in"
            >
              Choose Your Path
            </button>
          </div>
        </section>

        {/* Learning Doors Section */}
        <section id="paths-section" className="py-16 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                6 Learning Doors
              </h2>
              <p className="text-lg text-muted-foreground">
                Your Gateway to Smarter Learning
              </p>
            </div>
            
            {/* Learning Doors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningDoors.map((door, index) => (
                <div
                  key={door.path}
                  className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <door.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {door.title}
                    </h3>
                    <p className="text-sm font-medium text-green-600">
                      {door.tagline}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {door.description}
                    </p>
                  </div>
                  
                  {/* Enter Button */}
                  <div className="mt-6">
                    <Link
                      to={door.path}
                      className="block w-full bg-primary text-primary-foreground py-3 rounded-lg text-center font-medium hover:bg-primary/90 transition-colors"
                    >
                      Enter
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;