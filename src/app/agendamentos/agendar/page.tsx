import { Container } from "@/components/Container";
import Image from "next/image";
import img from "@/assets/maintenance-amico.svg";
import { auth } from "@/services/firebase";
import { EmailNotVerified } from "@/components/EmailNotVerified";

export default function Agendar() {
	const userAuth = auth.currentUser;

	if (userAuth && !userAuth.emailVerified) {
		return (
			<Container>
				<EmailNotVerified userAuth={userAuth} />
			</Container>
		);
	} 
		return (
        <div className="min-h-[calc(100vh-80px)] grid place-items-center">
          <div className="flex flex-col items-center gap-4 max-w-xl">
            <Image src={img} alt="Manutenção" width={500} height={500}/>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center">Estamos atualizando a área de agendamento!</h1>
            <p className="text-neutral-500 text-base text-center">No momento, a seção de agendamento está passando por melhorias para oferecer uma experiência ainda melhor para você.</p>
          </div>
        </div>
		)
}
