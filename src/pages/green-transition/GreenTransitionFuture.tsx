import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const GreenTransitionFuture = () => {
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
              Where We Will Go and How
            </h1>
            
            <div className="text-lg leading-relaxed text-muted-foreground space-y-6">
              <p>
                A credible transition roadmap requires prioritizing renewable integration, phasing down coal, scaling clean technology, and addressing equity concerns. International financing and technology sharing must be scaled up. Progress will be measured not only in gigawatts of renewables, but in the inclusivity and resilience of energy systems.
              </p>
              
              <p>
                The pathway forward demands unprecedented coordination across sectors and borders. Priority must be given to accelerating renewable energy deployment while simultaneously building the infrastructure needed to support a clean energy economy. This includes massive investments in grid modernization, energy storage, and smart grid technologies that can manage variable renewable sources.
              </p>
              
              <p>
                Coal phase-down strategies must be carefully sequenced to avoid economic disruption and social unrest. Just transition policies are essential to support communities dependent on fossil fuel industries. Retraining programs, alternative economic opportunities, and social safety nets will determine whether the transition gains public support or faces resistance.
              </p>
              
              <p>
                Technology scaling requires focused support for emerging solutions. Green hydrogen, advanced batteries, and carbon capture technologies need continued research and development funding alongside deployment incentives. Public-private partnerships can accelerate innovation while sharing risks between sectors.
              </p>
              
              <p>
                International cooperation mechanisms must evolve to match the scale of the challenge. Climate finance commitments need to translate into accessible funding for developing countries. Technology transfer agreements should prioritize capacity building alongside equipment exports. South-South cooperation can complement traditional North-South flows.
              </p>
              
              <p>
                Success metrics must extend beyond traditional energy indicators. While renewable capacity additions remain important, new measures should include energy access rates, grid reliability, job creation in clean sectors, and reductions in energy poverty. These broader indicators will ensure the transition serves all populations, not just those who can afford new technologies.
              </p>
              
              <p>
                The resilience of future energy systems will depend on diversity of sources, redundancy in critical infrastructure, and flexibility to adapt to climate impacts. Building this resilience requires long-term planning and investment decisions that consider multiple scenarios and potential disruptions.
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

export default GreenTransitionFuture;