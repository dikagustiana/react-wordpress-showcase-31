import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const GreenTransitionNow = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Back Navigation */}
          <Link
            to="/green-transition"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to The Green Transition
          </Link>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8 font-plus-jakarta">
              Where We Are Now
            </h1>
            
            <div className="text-lg leading-relaxed text-muted-foreground space-y-6">
              <p>
                Today's energy landscape is still dominated by fossil fuels. Renewable capacity is growing, but unevenly across regions. Policies have been introduced, yet many remain fragmented or underfunded. Developing countries often face the hardest trade-offs: balancing growth, energy access, and emissions targets.
              </p>
              
              <p>
                The current global energy mix reveals both progress and persistent challenges. While solar and wind installations have reached record levels, coal and natural gas continue to supply the majority of electricity generation worldwide. This transition is happening at different speeds across continents, with Europe and parts of Asia leading in renewable deployment while many developing nations struggle with basic energy access.
              </p>
              
              <p>
                Policy frameworks at national and international levels show a patchwork of ambition and implementation gaps. Carbon pricing mechanisms exist in some regions but remain absent in others. Subsidies for fossil fuels often dwarf support for clean energy, creating market distortions that slow the transition.
              </p>
              
              <p>
                The financing landscape reflects these disparities. While developed economies attract significant climate investment, emerging markets face capital constraints and higher borrowing costs. This financial divide threatens to create a two-speed transition where wealthier nations advance while others are left behind.
              </p>
              
              <p>
                Infrastructure challenges compound these issues. Aging power grids in many regions cannot accommodate variable renewable sources without significant upgrades. Energy storage remains expensive and limited in scale, while transmission networks often fail to connect renewable-rich areas with demand centers.
              </p>
            </div>
          </article>

          {/* Bottom Navigation */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link
              to="/green-transition"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to The Green Transition
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GreenTransitionNow;