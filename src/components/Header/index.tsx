import Image from "next/image";
import Logo from "@/assets/logoPrefeitura.svg";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="h-20 bg-blueCol fixed left-0 right-0 z-50">
      <div className="h-20 max-w-8xl px-4 m-auto flex items-center justify-between">
        <Image
          src={Logo}
          alt="Logo - Prefeitura de Mesquita"
          className="w-40"
        />
        <Nav />
      </div>
    </header>
  );
}
