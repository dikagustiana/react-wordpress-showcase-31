import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  buttonText?: string;
  className?: string;
}

const Card = ({ title, description, icon: Icon, path, buttonText = 'Learn More', className = '' }: CardProps) => {
  return (
    <Link 
      to={path}
      className={`group block p-6 bg-card-bg-light rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] hover:bg-card-bg-light-hover transition-all duration-300 font-plus-jakarta ${className}`}
    >
      <div className="flex justify-start mb-4">
        <div className="p-3 bg-card-icon-bg rounded-lg shadow-sm">
          <Icon className="w-6 h-6 text-card-title" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-card-title mb-3">
        {title}
      </h3>
      <p className="text-card-description text-sm leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex items-center text-card-cta font-semibold text-sm hover:underline">
        {buttonText}
        <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
};

export default Card;