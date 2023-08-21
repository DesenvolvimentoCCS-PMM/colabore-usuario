interface ContainerProps {
  children: React.ReactNode;
  center?: boolean;
}
export function Container({ children, center }: ContainerProps) {
  return (
    <div
      className={`bg-white m-auto px-8 py-14 min-h-[80vh] mx-auto max-w-7xl 
    ${center && "grid place-items-center"}`}
    >
      {children}
    </div>
  );
}
