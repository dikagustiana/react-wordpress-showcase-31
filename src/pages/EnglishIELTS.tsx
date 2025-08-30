import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  BookOpen, 
  MessageCircle, 
  PenTool, 
  FileText,
  Target,
  Headphones,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  Award,
  TrendingUp
} from 'lucide-react';

const EnglishIELTS = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'English – IELTS' }
  ];

  const learningSteps = [
    {
      icon: BookOpen,
      title: "Absolute Basics",
      description: "Alphabet, sounds, greetings, and introducing yourself.",
      buttonText: "View Practices",
      color: "bg-green-500"
    },
    {
      icon: MessageCircle,
      title: "Everyday English",
      description: "Daily vocabulary and useful expressions you'll actually use.",
      buttonText: "View Practices",
      color: "bg-orange-500"
    },
    {
      icon: PenTool,
      title: "Grammar Foundations",
      description: "Simple structures, clear questions, and confident answers.",
      buttonText: "View Practices",
      color: "bg-green-500"
    },
    {
      icon: FileText,
      title: "Paragraph Writing",
      description: "Learn to build paragraphs with strong topic sentences and connectors.",
      buttonText: "View Practices",
      color: "bg-orange-500"
    }
  ];

  const practiceAreas = [
    {
      icon: PenTool,
      title: "Writing Practice",
      description: "Master Task 1 and Task 2 essays with clear strategies and feedback.",
      tags: ["Task 1 Analysis", "Task 2 Arguments", "Grammar Check", "Band Score Tips"],
      color: "bg-green-500"
    },
    {
      icon: MessageCircle,
      title: "Speaking Practice",
      description: "Boost your fluency with cue cards, mock interviews, and everyday speaking drills.",
      tags: ["Part 1 Interview", "Part 2 Cue Cards", "Part 3 Discussion", "Pronunciation"],
      color: "bg-orange-500"
    },
    {
      icon: Headphones,
      title: "Reading & Listening Practice",
      description: "Train your focus with exam-style passages and listening tasks.",
      tags: ["Reading Passages", "Listening Tests", "Question Types", "Time Management"],
      color: "bg-slate-600"
    }
  ];

  const extraTools = [
    {
      icon: BookOpen,
      title: "Vocabulary Boosters",
      items: ["Academic Word Lists", "Topic-Specific Vocabulary", "Collocations", "Synonyms"],
      color: "bg-green-500"
    },
    {
      icon: Target,
      title: "Band Descriptors",
      items: ["Speaking Criteria", "Writing Assessment", "Score Breakdown", "Improvement Tips"],
      color: "bg-orange-500"
    },
    {
      icon: Users,
      title: "Practical Tips",
      items: ["Time Management", "Exam Strategies", "Common Mistakes", "Stress Management"],
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      items: ["Practice Tests", "Score Tracking", "Skill Analysis", "Goal Setting"],
      color: "bg-orange-500"
    }
  ];

  const pathwaySteps = [
    { label: "ABC Basics", subtitle: "alphabet, greetings", color: "bg-green-500" },
    { label: "Daily English", subtitle: "simple vocab & sentences", color: "bg-orange-500" },
    { label: "Paragraphs", subtitle: "structured writing", color: "bg-green-500" },
    { label: "IELTS 7.5", subtitle: "final goal", color: "bg-orange-500", highlight: true }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
              {/* University logos pattern in background */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 gap-8 p-8 rotate-12 scale-150">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-12 h-12 bg-white/20 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative flex items-center justify-between px-12 py-16">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  Your Path to IELTS 7.5<br />
                  Starts Here
                </h1>
                <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                  From simple words to structured essays, I'll guide you step by step until you 
                  achieve your dream IELTS score.
                </p>
                <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg rounded-lg">
                  Start Learning Today
                </Button>
              </div>
              
              {/* Learning Pathway */}
              <div className="hidden lg:flex flex-col space-y-6">
                {pathwaySteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center`}>
                      {step.highlight ? <Award className="w-6 h-6 text-white" /> : <CheckCircle className="w-6 h-6 text-white" />}
                    </div>
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg min-w-[200px]">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-800">{step.label}</h3>
                        <p className="text-sm text-slate-600">{step.subtitle}</p>
                        {step.highlight && (
                          <div className="flex items-center mt-1">
                            <Target className="w-4 h-4 text-orange-500 mr-1" />
                            <span className="text-xs text-orange-600 font-medium">Target Achievement</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    {index < pathwaySteps.length - 1 && (
                      <div className="w-px h-8 bg-blue-300 ml-6"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Build Your English Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Build Your English, One Step at a Time
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Every big achievement starts small. We'll begin with the basics — simple words, everyday 
                phrases, and clear grammar. Then, step by step, you'll learn how to connect sentences and craft 
                full paragraphs that express your ideas confidently.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {learningSteps.map((step, index) => (
                <Card key={index} className="bg-muted/30 border-0 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>
                    <Button variant="outline" className="w-full">
                      {step.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Smart Practice Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Get Exam-Ready with Smart Practice
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Once you're confident with everyday English, it's time to level up. We'll dive into IELTS-specific 
                training — writing structured essays, speaking fluently under time pressure, and sharpening your 
                reading and listening skills with real test-style tasks.
              </p>
            </div>
            
            <div className="space-y-8">
              {practiceAreas.map((area, index) => (
                <Card key={index} className="bg-white border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className={`w-16 h-16 ${area.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <area.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-3">{area.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{area.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {area.tags.map((tag, tagIndex) => (
                            <span 
                              key={tagIndex} 
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Extra Tools Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Extra Tools for Extra Confidence
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Sometimes it's the small details that make a big difference. That's why I'll share practical tips, 
                vocabulary boosters, and band descriptors explained in simple words — so you know exactly 
                how examiners score your answers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {extraTools.map((tool, index) => (
                <Card key={index} className="bg-muted/20 border-0 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${tool.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-4">{tool.title}</h3>
                    <div className="space-y-2">
                      {tool.items.map((item, itemIndex) => (
                        <div 
                          key={itemIndex}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EnglishIELTS;