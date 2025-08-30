import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, Wrench, Calculator, FileText, HelpCircle, BarChart, Building, Users } from 'lucide-react';

const CriticalThinkingResearch = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/10 to-muted/20">
          <div className="max-w-content mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold text-primary mb-6 font-plus-jakarta">
              Critical Thinking
              <br />
              <span className="text-secondary">and Research</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Learn to think sharper and research smarter. Build your mindset, then 
              master the methods.
            </p>
            <button className="bg-card-cta hover:bg-card-cta/90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              Start Learning
            </button>
          </div>
        </section>

        {/* 4 Phases of Critical Thinking */}
        <section className="py-16">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4 font-plus-jakarta">
                4 Phases of Critical Thinking
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Think like a detective, not just a student. These four phases help you sharpen your mind and 
                avoid common thinking traps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Phase 1: Clarify */}
              <Link 
                to="/critical-thinking-research/clarify"
                className="group bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-2 font-plus-jakarta block"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="w-16 h-16 bg-card-icon-bg rounded-lg shadow-sm flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-title mb-3 text-center">
                  Clarify
                </h3>
                <p className="text-card-description text-sm leading-relaxed text-center">
                  Train your eyes to spot real arguments vs noise.
                </p>
              </Link>

              {/* Phase 2: Analyze */}
              <Link 
                to="/critical-thinking-research/analyze"
                className="group bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-2 font-plus-jakarta block"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="w-16 h-16 bg-card-icon-bg rounded-lg shadow-sm flex items-center justify-center mx-auto">
                    <Wrench className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-title mb-3 text-center">
                  Analyze
                </h3>
                <p className="text-card-description text-sm leading-relaxed text-center">
                  Break arguments apart and detect fallacies.
                </p>
              </Link>

              {/* Phase 3: Construct */}
              <Link 
                to="/critical-thinking-research/construct"
                className="group bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-2 font-plus-jakarta block"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="w-16 h-16 bg-card-icon-bg rounded-lg shadow-sm flex items-center justify-center mx-auto">
                    <Building className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-title mb-3 text-center">
                  Construct
                </h3>
                <p className="text-card-description text-sm leading-relaxed text-center">
                  Build your own strong and logical arguments.
                </p>
              </Link>

              {/* Phase 4: Apply */}
              <Link 
                to="/critical-thinking-research/apply"
                className="group bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-2 font-plus-jakarta block"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div className="w-16 h-16 bg-card-icon-bg rounded-lg shadow-sm flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-title mb-3 text-center">
                  Apply
                </h3>
                <p className="text-card-description text-sm leading-relaxed text-center">
                  Bring critical thinking to real-world cases: media, science, daily life.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Phases of Research */}
        <section className="py-16 bg-gradient-to-br from-secondary/5 via-muted/10 to-primary/5">
          <div className="max-w-content mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4 font-plus-jakarta">
                4 Phases of Research
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Great research is clear thinking in action. From asking sharp questions to writing with 
                impact, here's your roadmap.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Phase 1: Frame */}
              <Link 
                to="/critical-thinking-research/frame"
                className="group bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-2 font-plus-jakarta block"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="w-16 h-16 bg-card-icon-bg rounded-lg shadow-sm flex items-center justify-center mx-auto">
                    <HelpCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-title mb-3 text-center">
                  Frame
                </h3>
                <p className="text-card-description text-sm leading-relaxed text-center">
                  Formulate sharp questions & a clear framework.
                </p>
              </Link>

              {/* Phase 2: Data */}
              <Link 
                to="/critical-thinking-research/data"
                className="group bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-2 font-plus-jakarta block"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="w-16 h-16 bg-card-icon-bg rounded-lg shadow-sm flex items-center justify-center mx-auto">
                    <BarChart className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-title mb-3 text-center">
                  Data
                </h3>
                <p className="text-card-description text-sm leading-relaxed text-center">
                  Collect and tell the story behind your numbers.
                </p>
              </Link>

              {/* Phase 3: Analyze */}
              <Link 
                to="/critical-thinking-research/research-analyze"
                className="group bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-2 font-plus-jakarta block"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="w-16 h-16 bg-card-icon-bg rounded-lg shadow-sm flex items-center justify-center mx-auto">
                    <Calculator className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-title mb-3 text-center">
                  Analyze
                </h3>
                <p className="text-card-description text-sm leading-relaxed text-center">
                  Design empirical strategies and act with honesty.
                </p>
              </Link>

              {/* Phase 4: Communicate */}
              <Link 
                to="/critical-thinking-research/communicate"
                className="group bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-2 font-plus-jakarta block"
              >
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div className="w-16 h-16 bg-card-icon-bg rounded-lg shadow-sm flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-title mb-3 text-center">
                  Communicate
                </h3>
                <p className="text-card-description text-sm leading-relaxed text-center">
                  Write & present results with clarity and impact.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16">
          <div className="max-w-content mx-auto px-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12 border-l-4 border-green-500">
              <div className="text-center">
                <div className="text-6xl text-gray-300 mb-6">❝</div>
                <blockquote className="text-2xl font-medium text-primary mb-6 max-w-4xl mx-auto leading-relaxed font-plus-jakarta">
                  "Critical Thinking sharpens your mind. Research puts it into action. Together, they make you unstoppable."
                </blockquote>
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CriticalThinkingResearch;