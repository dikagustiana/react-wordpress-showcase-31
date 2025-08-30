import { Mail, Linkedin } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-50 border-t font-plus-jakarta" style={{
    backgroundColor: '#F9FAFB'
  }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4" style={{
            color: '#203040'
          }}>Your Friendly Learning Buddy</h3>
            <p className="text-sm leading-relaxed" style={{
            color: '#203040'
          }}>
              Empowering individuals with financial knowledge and education. 
              Every great story begins with someone who was scared but did it anyway.
            </p>
          </div>
          
          {/* Learn Section */}
          <div>
            <h4 className="font-medium mb-4" style={{
            color: '#203040'
          }}>Learn</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/accounting" className="transition-colors hover:underline" style={{
                color: '#2F4B6E'
              }} onMouseEnter={e => e.currentTarget.style.color = '#1e3a52'} onMouseLeave={e => e.currentTarget.style.color = '#2F4B6E'}>
                  Accounting
                </a>
              </li>
              <li>
                <a href="/finance-101" className="transition-colors hover:underline" style={{
                color: '#2F4B6E'
              }} onMouseEnter={e => e.currentTarget.style.color = '#1e3a52'} onMouseLeave={e => e.currentTarget.style.color = '#2F4B6E'}>
                  Finance
                </a>
              </li>
              <li>
                <a href="/green-transition" className="transition-colors hover:underline" style={{
                color: '#2F4B6E'
              }} onMouseEnter={e => e.currentTarget.style.color = '#1e3a52'} onMouseLeave={e => e.currentTarget.style.color = '#2F4B6E'}>
                  Green Transition
                </a>
              </li>
              <li>
                <a href="/critical-thinking-research" className="transition-colors hover:underline" style={{
                color: '#2F4B6E'
              }} onMouseEnter={e => e.currentTarget.style.color = '#1e3a52'} onMouseLeave={e => e.currentTarget.style.color = '#2F4B6E'}>
                  Research & Analysis
                </a>
              </li>
              <li>
                <a href="/books-academia" className="transition-colors hover:underline" style={{
                color: '#2F4B6E'
              }} onMouseEnter={e => e.currentTarget.style.color = '#1e3a52'} onMouseLeave={e => e.currentTarget.style.color = '#2F4B6E'}>
                  Books & Academia
                </a>
              </li>
              <li>
                <a href="/english-ielts" className="transition-colors hover:underline" style={{
                color: '#2F4B6E'
              }} onMouseEnter={e => e.currentTarget.style.color = '#1e3a52'} onMouseLeave={e => e.currentTarget.style.color = '#2F4B6E'}>
                  English Practice
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h4 className="font-medium mb-4" style={{
            color: '#203040'
          }}>Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:dika.g.irawan@gmail.com" className="flex items-center gap-2 transition-colors hover:underline" style={{
                color: '#2F4B6E'
              }} onMouseEnter={e => e.currentTarget.style.color = '#1e3a52'} onMouseLeave={e => e.currentTarget.style.color = '#2F4B6E'}>
                  <Mail className="w-4 h-4" />
                  dika.g.irawan@gmail.com
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/dika-gustiana-irawan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:underline" style={{
                color: '#2F4B6E'
              }} onMouseEnter={e => e.currentTarget.style.color = '#1e3a52'} onMouseLeave={e => e.currentTarget.style.color = '#2F4B6E'}>
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center" style={{
        borderColor: '#E5E7EB'
      }}>
          <p className="text-sm" style={{
          color: '#203040'
        }}>
            © 2025 Dika G Irawan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;