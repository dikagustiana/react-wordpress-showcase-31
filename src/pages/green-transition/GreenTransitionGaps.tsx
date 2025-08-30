import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const GreenTransitionGaps = () => {
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
              The Gaps Between Ambition and Reality
            </h1>
            
            <div className="text-lg leading-relaxed text-muted-foreground space-y-6">
              <p>
                Despite ambitious net-zero pledges, current investment levels and policy enforcement fall short. Infrastructure gaps remain, especially in storage and grid modernization. Financial flows favor advanced economies, leaving the Global South exposed to energy insecurity. Without stronger coordination, the ambition–reality gap will widen.
              </p>
              
              <p>
                The scale of the investment gap is staggering. While climate finance commitments have increased, they remain far below what's needed for a rapid transition. The International Energy Agency estimates that annual clean energy investment must triple by 2030 to meet global climate goals, yet current funding mechanisms are inadequate to bridge this divide.
              </p>
              
              <p>
                Policy implementation faces numerous obstacles. Many countries have adopted renewable energy targets but lack the regulatory frameworks to achieve them. Permitting processes for clean energy projects often take years, while fossil fuel developments face fewer bureaucratic hurdles. This regulatory asymmetry slows deployment of critical technologies.
              </p>
              
              <p>
                Technology deployment gaps persist across multiple fronts. Energy storage costs have fallen dramatically but remain too high for widespread adoption in emerging markets. Grid infrastructure in many regions cannot handle variable renewable energy sources, requiring massive upgrades that are often delayed or underfunded.
              </p>
              
              <p>
                The human capital dimension is equally challenging. Many countries lack the skilled workforce needed for clean energy deployment and maintenance. Training programs exist but often fail to match the pace of technological change. This skills gap threatens to become a major bottleneck as the transition accelerates.
              </p>
              
              <p>
                Geopolitical tensions further complicate the transition. Critical mineral supply chains are concentrated in few countries, creating vulnerability and potential for market manipulation. Trade disputes can slow technology transfer and increase costs, particularly affecting developing nations' access to clean energy solutions.
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

export default GreenTransitionGaps;