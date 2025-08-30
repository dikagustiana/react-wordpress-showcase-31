import { TreePine } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

const GreenTransition = () => {
  const cards = [
    {
      title: 'Where We Are Now',
      description: 'Summarize the current state: energy mix, emissions, active policies, and key barriers.',
      buttonText: 'View Essays',
      path: '/green-transition/where-we-are-now'
    },
    {
      title: 'Challenges Ahead',
      description: 'Identify gaps in policy, funding, technology, infrastructure, and market readiness.',
      buttonText: 'Explore Essays',
      path: '/green-transition/challenges-ahead'
    },
    {
      title: 'Pathways Forward',
      description: 'Roadmap for implementation: sector priorities, sequence of initiatives, funding, and metrics.',
      buttonText: 'See Essays',
      path: '/green-transition/pathways-forward'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative h-[60vh] min-h-[400px] flex items-center justify-center"
          style={{
            backgroundImage: 'url(/lovable-uploads/d49a1a46-b20a-499c-acc1-feff1e9ad4a8.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          aria-label="Wind turbines in landscape representing green energy transition"
        >
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
          
          {/* Hero Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <h1 className="font-plus-jakarta font-bold text-white text-[42px] md:text-[48px] lg:text-[52px] leading-tight">
              Would it be green transition for the rich and energy poverty for the rest?
            </h1>
          </div>
        </section>

        {/* Cards Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cards.map((card, index) => (
                <Card
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={TreePine}
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

export default GreenTransition;