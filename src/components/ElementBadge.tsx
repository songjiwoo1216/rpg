import { ElementType } from '../types/game';
import { ELEMENT_COLORS } from '../utils/constants';

interface ElementBadgeProps {
  element: ElementType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ElementBadge({ element, size = 'md', showLabel = true, className = '' }: ElementBadgeProps) {
  const config = ELEMENT_COLORS[element] || ELEMENT_COLORS['불'];

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border backdrop-blur-xs select-none ${config.badge} ${sizeClasses} ${className}`}
      title={`${element} 속성`}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{element}</span>}
    </span>
  );
}
