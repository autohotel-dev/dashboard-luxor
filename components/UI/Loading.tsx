// Loading.tsx - Componente de carga
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
}

export default function Loading({ size = 'md', text = '' }: LoadingProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}
