"use client";

import { useUserLoggedContext } from "@/context/userLogged";
import { auth } from "@/services/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { push } = useRouter();
  const { setHasUserLogged } = useUserLoggedContext();

  const logout = () => {
    signOut(auth)
      .then(() => {
        setHasUserLogged(false);
        push("/");
      })
      .catch(() => {
        throw new Error();
      });
  };

  return (
    <button
      className="rounded-3xl h-10 w-36 text-base border-2 border-blueCol text-blueCol ml-8 font-semibold uppercase transition-all hover:scale-95 hover:bg-blueCol hover:text-white sm:h-14 sm:w-40 sm:text-xl"
      onClick={logout}
    >
      {"Sair >"}
    </button>
  );
}
