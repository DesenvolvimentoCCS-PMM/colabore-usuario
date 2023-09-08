import Image from "next/image";
import Ilustration from "@/assets/ilustration.jpg";
import { SigninForm } from "@/app/entrar/SigninForm";
import { Container } from "@/components/Container";
import { PageNavigation } from "@/components/PageNavigation";

export default function Entrar() {
  return (
    <Container center>
      <PageNavigation currentPage="Entrar" target="/" targetName="Ínicio" />
      <main className="grid grid-cols-1 place-items-center space-y-10 sm:grid-cols-2 sm:space-y-0 sm:space-x-12">
        <Image
          src={Ilustration}
          alt="Ilustração de pessoas vendo um calendário"
          className="w-10/12 max-w-2xl hidden sm:block sm:w-full"
        />
        <SigninForm />
      </main>
    </Container>
  );
}
