"use client";

import Image from "next/image";
import homeIcon from "@/assets/icons/homeIcon.svg";
import infoIcon from "@/assets/icons/infoIcon.svg";
import arrobaIcon from "@/assets/icons/arrobaIcon.svg";
import Link from "next/link";
import { At, House, Info, List, X } from "phosphor-react";
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
          <X size={40} className="text-blueCol" />
        </button>
      ) : (
        <button
          className="sm:hidden"
          onClick={() => setMenuIsOpen((state) => !state)}
        >
          <List size={40} className="text-blueCol" />
        </button>
      )}

      <nav
        className={`fixed transition-all duration-500 top-20 ${
          menuIsOpen ? "px-6 pb-10 pt-4 bg-blueCol right-0 " : "-right-full"
        } sm:static`}
      >
        <div className=" text-white flex flex-col items-end gap-x-10 flex-wrap justify-end gap-y-2 sm:flex-row sm:text-blueCol">
          <Link
            href={"/"}
            className={`flex items-center text-sm gap-x-3 transition-all hover:scale-105`}
          >
            <House size={24} className="text-white sm:text-blueCol" />
            Ínicio
          </Link>

          <Link
            href={"/como-funciona"}
            className={`flex items-center text-sm gap-x-3 transition-all hover:scale-105`}
          >
            <Info size={24} className="text-white sm:text-blueCol" />
            Como funciona
          </Link>
        </div>
      </nav>
    </>
  );
}
