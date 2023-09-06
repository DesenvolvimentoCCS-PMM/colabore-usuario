interface ContainerProps {
  children: React.ReactNode;
  center?: boolean;
}
export function Container({ children, center }: ContainerProps) {
  return (
    <div
      className={`bg-white m-auto px-8 pt-40 pb-28 min-h-[90vh] mx-auto max-w-7xl relative
    ${center && "grid place-items-center"}`}
    >
      {children}
    </div>
  );
}
