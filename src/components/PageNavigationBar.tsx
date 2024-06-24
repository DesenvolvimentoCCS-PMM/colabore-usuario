import Link from "next/link";

interface PageNavigationBarProps {
  currentPage: string;
  target: string;
  targetName: string;
}

export function PageNavigationBar({
  currentPage,
  target,
  targetName,
}: PageNavigationBarProps) {
  return (
    <div className="flex items-center gap-x-2 absolute top-32 left-6 xl:left-0">
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
