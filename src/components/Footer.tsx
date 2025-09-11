import { Mail, Linkedin } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-primary border-t font-plus-jakarta">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-primary-foreground">Your Friendly Learning Buddy</h3>
            <p className="text-sm leading-relaxed text-primary-foreground">
              Empowering individuals with financial knowledge and education. 
              Every great story begins with someone who was scared but did it anyway.
            </p>
          </div>
          
          {/* Learn Section */}
          <div>
            <h4 className="font-medium mb-4 text-primary-foreground">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/accounting" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline transition-colors">
                  Accounting
                </a>
              </li>
              <li>
                <a href="/finance-101" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline transition-colors">
                  Finance
                </a>
              </li>
              <li>
                <a href="/green-transition" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline transition-colors">
                  Green Transition
                </a>
              </li>
              <li>
                <a href="/critical-thinking-research" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline transition-colors">
                  Research & Analysis
                </a>
              </li>
              <li>
                <a href="/books-academia" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline transition-colors">
                  Books & Academia
                </a>
              </li>
              <li>
                <a href="/english-ielts" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline transition-colors">
                  English Practice
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h4 className="font-medium mb-4 text-primary-foreground">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:dika.g.irawan@gmail.com" className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground hover:underline transition-colors">
                  <Mail className="w-4 h-4" />
                  dika.g.irawan@gmail.com
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/dika-gustiana-irawan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground hover:underline transition-colors">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-hover mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground">
            © 2025 Dika G Irawan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;