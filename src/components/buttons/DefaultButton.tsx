import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface DefaultButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  islink?: boolean;
  href?: string;
  children: ReactNode;
}

export function Button(props: DefaultButtonProps) {
  const defaultStyle =
    "flex items-center gap-x-2 rounded-3xl bg-[#CC9935] px-10 py-2 max-w-max text-white font-medium text-sm uppercase disabled:opacity-50 disabled:pointer-events-none sm:text-base disabled:opacity-50";

  return (
    <>
      {props.islink ? (
        <Link href={props.href!} className={defaultStyle}>
          {props.children}
        </Link>
      ) : (
        <button {...props} className={defaultStyle}>
          {props.children}
        </button>
      )}
    </>
  );
}
