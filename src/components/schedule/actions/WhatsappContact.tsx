import { WhatsappLogo } from "phosphor-react";

export function WhatsappContact({
  whatsappNumber,
}: {
  whatsappNumber: string;
}) {
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      className="px-3 py-3 rounded-3xl text-sm flex items-center h-12 justify-center gap-x-1 max-w-xs  group bg-green-600 hover:scale-95 hover:brightness-95 sm:w-max"
      target="_blank"
    >
      <WhatsappLogo size={26} color="white" />

      <span className="w-0 m-[-2px] opacity-0 overflow-hidden text-white transition-all duration-300 group-hover:w-32 group-hover:m-auto group-hover:opacity-100">
        Entrar em contato
      </span>
    </a>
  );
}
