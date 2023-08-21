"use client";

import Image from "next/image";
import homeIcon from "@/assets/icons/homeIcon.svg";
import infoIcon from "@/assets/icons/infoIcon.svg";
import arrobaIcon from "@/assets/icons/arrobaIcon.svg";
import Link from "next/link";
import { List, X } from "phosphor-react";
import { useState } from "react";

export function Nav() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <>
      {menuIsOpen ? (
        <button
          className="sm:hidden"
          onClick={() => setMenuIsOpen((state) => !state)}
        >
          <X size={40} color="white" />
        </button>
      ) : (
        <button
          className="sm:hidden"
          onClick={() => setMenuIsOpen((state) => !state)}
        >
          <List size={40} color="white" />
        </button>
      )}

      <nav
        className={`fixed transition-all duration-500 top-20 ${
          menuIsOpen ? "px-6 pb-10 pt-4 bg-blueCol right-0 " : "-right-full"
        } sm:static`}
      >
        <div className=" text-white flex flex-col items-end gap-x-10 flex-wrap justify-end gap-y-2 sm:flex-row">
          <Link
            href={"/"}
            className={`flex items-center text-sm gap-x-3 transition-all border-b-2 border-b-blueCol hover:scale-105`}
          >
            <Image src={homeIcon} alt="Ícone de Home" height={18} width={18} />
            Ínicio
          </Link>

          <Link
            href={"/"}
            className={`flex items-center text-sm gap-x-3 transition-all border-b-2 border-b-blueCol hover:scale-105`}
          >
            <Image
              src={arrobaIcon}
              alt="Ícone de Home"
              height={18}
              width={18}
            />
            Ir para o site
          </Link>

          <Link
            href={"/como-funciona"}
            className={`flex items-center text-sm gap-x-3 transition-all border-b-2 border-b-blueCol hover:scale-105`}
          >
            <Image
              src={infoIcon}
              alt="Ícone de Informação"
              height={18}
              width={18}
            />
            Como funciona
          </Link>
        </div>
      </nav>
    </>
  );
}
