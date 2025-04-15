import { User } from 'phosphor-react';

interface AvatarProps {
  url?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-8 h-8 text-base',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-xl',
};

export const Avatar = ({ url, alt = 'Avatar', size = 'md' }: AvatarProps) => {
  const sizeClass = sizeMap[size];

  return (
    <div
      className={`rounded-full overflow-hidden bg-gray-700 border border-gray-500 flex items-center justify-center ${sizeClass}`}
    >
      {url ? (
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User weight="bold" className="text-gray-300" />
      )}
    </div>
  );
};
