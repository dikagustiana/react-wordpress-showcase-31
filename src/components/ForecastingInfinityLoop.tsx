import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoopNode {
  id: string;
  label: string;
  group: 'input' | 'assumptions' | 'output';
  route: string;
  x: number;
  y: number;
  angle: number;
}

const ForecastingInfinityLoop = () => {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes: LoopNode[] = [
    // Group 1 - Input (Left side, blue)
    { id: 'sales-assumptions', label: 'Sales\nAssumptions', group: 'input', route: '/forecasting/input', x: 150, y: 80, angle: -45 },
    { id: 'revenue-projection', label: 'Revenue\nProjection', group: 'input', route: '/forecasting/input', x: 80, y: 120, angle: -90 },
    { id: 'cogs-gross-profit', label: 'COGS &\nGross Profit', group: 'input', route: '/forecasting/input', x: 80, y: 180, angle: -135 },
    
    // Group 2 - Assumptions (Right side, orange)
    { id: 'headcount-planning', label: 'Headcount\nPlanning', group: 'assumptions', route: '/forecasting/assumptions', x: 350, y: 80, angle: 45 },
    { id: 'salaries-planning', label: 'Salaries\nPlanning', group: 'assumptions', route: '/forecasting/assumptions', x: 420, y: 120, angle: 90 },
    { id: 'overhead-costs', label: 'Overhead Costs\nPlanning', group: 'assumptions', route: '/forecasting/assumptions', x: 420, y: 180, angle: 135 },
    { id: 'net-working-capital', label: 'Net Working\nCapital', group: 'assumptions', route: '/forecasting/assumptions', x: 350, y: 220, angle: 180 },
    { id: 'capex-projection', label: 'Capex\nProjection', group: 'assumptions', route: '/forecasting/assumptions', x: 280, y: 240, angle: 225 },
    
    // Group 3 - Output (Bottom center)
    { id: 'debt-dividends', label: 'Debt &\nDividends', group: 'output', route: '/forecasting/output', x: 150, y: 220, angle: 270 },
    { id: '3-statement-model', label: '3 Statement\nModel', group: 'output', route: '/forecasting/output', x: 220, y: 240, angle: 315 },
    { id: 'analysis-projections', label: 'Analysis of\nProjections', group: 'output', route: '/forecasting/output', x: 280, y: 80, angle: 0 },
  ];

  const groupRoutes = {
    input: '/forecasting/input',
    assumptions: '/forecasting/assumptions',
    output: '/forecasting/output'
  };

  const groupNames = {
    input: 'Input',
    assumptions: 'Assumption Drivers Planning',
    output: 'Output'
  };

  useEffect(() => {
    // Analytics: component view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'forecasting_loop_view', {
        component: 'ForecastingInfinityLoop'
      });
    }
  }, []);

  const handleNodeClick = (node: LoopNode) => {
    // Analytics: click event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'forecasting_loop_click', {
        group: node.group,
        label: node.label.replace('\n', ' '),
        route: node.route
      });
    }
    
    navigate(node.route);
  };

  const handleKeyDown = (event: React.KeyboardEvent, node: LoopNode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNodeClick(node);
    }
  };

  return (
    <div className="w-full">
      {/* Main SVG Infinity Loop */}
      <svg
        ref={svgRef}
        viewBox="0 0 500 300"
        className="w-full h-auto max-w-4xl mx-auto forecasting-loop"
        role="img"
        aria-label="Interactive forecasting process infinity loop showing input, assumptions, and output phases"
      >
        <defs>
          {/* Gradients for the loop segments */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Arrow markers */}
          <defs>
            <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <polygon points="0,0 0,6 9,3" fill="#0284c7" />
            </marker>
            <marker id="arrowOrange" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <polygon points="0,0 0,6 9,3" fill="#d97706" />
            </marker>
          </defs>

          {/* Focus outline filter */}
          <filter id="focusGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Left loop (blue) */}
        <path
          d="M 150 150 
             C 150 80, 220 80, 220 150
             C 220 220, 150 220, 150 150 Z"
          fill="url(#blueGradient)"
          stroke="#0284c7"
          strokeWidth="3"
          opacity="0.9"
        />

        {/* Right loop (orange) */}
        <path
          d="M 280 150 
             C 280 80, 350 80, 350 150
             C 350 220, 280 220, 280 150 Z"
          fill="url(#orangeGradient)"
          stroke="#d97706"
          strokeWidth="3"
          opacity="0.9"
        />

        {/* Center connection */}
        <rect
          x="215"
          y="130"
          width="70"
          height="40"
          fill="url(#blueGradient)"
          opacity="0.7"
        />

        {/* Direction arrows */}
        <path
          d="M 180 100 Q 200 90, 220 100"
          stroke="#0284c7"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowBlue)"
        />
        
        <path
          d="M 320 200 Q 300 210, 280 200"
          stroke="#d97706"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowOrange)"
        />

        {/* Interactive node buttons */}
        {nodes.map((node, index) => (
          <g key={node.id}>
            {/* Clickable area */}
            <circle
              cx={node.x}
              cy={node.y}
              r="25"
              fill="transparent"
              className="cursor-pointer focus:outline-none"
              tabIndex={0}
              onClick={() => handleNodeClick(node)}
              onKeyDown={(e) => handleKeyDown(e, node)}
              aria-label={`${node.label.replace('\n', ' ')} - ${groupNames[node.group]} group`}
            />
            
            {/* Text label */}
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-white pointer-events-none select-none"
              style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))'
              }}
            >
              {node.label.split('\n').map((line, lineIndex) => (
                <tspan
                  key={lineIndex}
                  x={node.x}
                  y={node.y + (lineIndex - 0.5) * 12}
                >
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}

        {/* Group hover areas for better UX */}
        {Object.keys(groupRoutes).map((groupKey) => {
          const group = groupKey as keyof typeof groupRoutes;
          const groupNodes = nodes.filter(n => n.group === group);
          
          return (
            <g key={group} className="group-hover-area">
              {groupNodes.map(node => (
                <circle
                  key={`hover-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  fill="rgba(255,255,255,0.1)"
                  className="opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Fallback Navigation List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {Object.entries(groupNames).map(([groupKey, groupName]) => {
          const group = groupKey as keyof typeof groupRoutes;
          const groupNodes = nodes.filter(n => n.group === group);
          
          return (
            <div key={group} className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-semibold text-[#2F4B6E] mb-3 text-sm">
                {groupName}
              </h3>
              <ul className="space-y-2">
                {groupNodes.map(node => (
                  <li key={node.id}>
                    <button
                      onClick={() => handleNodeClick(node)}
                      className="text-sm text-gray-600 hover:text-[#3FB68B] transition-colors text-left w-full"
                      aria-label={`Go to ${groupName}: ${node.label.replace('\n', ' ')}`}
                    >
                      {node.label.replace('\n', ' ')}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2 border-t">
                <button
                  onClick={() => navigate(groupRoutes[group])}
                  className="text-xs text-[#2F4B6E] hover:text-[#3FB68B] font-medium transition-colors"
                >
                  → View {groupName} Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastingInfinityLoop;