import Link from "next/link";

interface PageNavigationProps {
  currentPage: string;
  target: string;
  targetName: string;
}

export function PageNavigation({
  currentPage,
  target,
  targetName,
}: PageNavigationProps) {
  return (
    <div className="flex items-center gap-x-2 absolute top-32 left-0">
      <Link href={target} className="text-gray-400 text-xs underline">
        {targetName}
      </Link>

      <span>{" > "}</span>

      <span className="bg-blueCol text-white p-1 rounded-lg text-xs">
        {currentPage}
      </span>
    </div>
  );
}
