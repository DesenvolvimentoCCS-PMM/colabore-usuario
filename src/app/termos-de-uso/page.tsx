import Image from "next/image";
import Logo from "@/assets/logoColabore.svg";

export default function Terms() {
  return (
    <div className="pb-10 pt-20 px-10">
      <div className="max-w-4xl m-auto">
        <div className="w-full my-10">
          <Image
            src={Logo}
            width={300}
            height={300}
            alt="Espaço Colabore Mesquita"
            className="m-auto"
          />

          <h1 className="text-center font-medium">
            Política de utilização do Espaço Colabore e Política de Privacidade
            e Uso de Imagens
          </h1>
        </div>

        <ol className="text-sm space-y-10">
          <li className="space-y-4">
            <h2 className="font-medium">1. Introdução</h2>
            <p>
              O Espaço Colabore, operado pela Prefeitura Municipal de Mesquita,
              está comprometido em respeitar a privacidade e os direitos dos
              seus usuários. Esta política de privacidade explica como
              coletamos, usamos e protegemos os seus dados pessoais, incluindo o
              uso de imagens e vídeos para fins de divulgação.
            </p>
          </li>
          <li className="space-y-4">
            <h2 className="font-medium">2. Coleta de Dados Pessoais</h2>
            <p>
              Ao agendar um horário no Espaço Colabore, você concorda com a
              coleta de dados pessoais necessários para a reserva e utilização
              dos nossos serviços. Os dados coletados podem incluir o seu nome,
              CPF, endereço, e-mail, número de telefone e outras informações
              relevantes.
            </p>
          </li>
          <li className="space-y-4">
            <h2 className="font-medium">3. Uso de Imagens e Vídeos</h2>
            <p>
              Ao agendar um horário no Espaço Colabore, você autoriza
              automaticamente o registro fotográfico e de trechos em vídeos das
              atividades realizadas ali, para fins de divulgação do Espaço
              Colabore não apenas nos canais oficiais da Prefeitura de Mesquita
              e nas próprias redes sociais oficiais do Espaço Colabore, mas
              também para divulgação do Espaço Colabore para a imprensa em
              geral.
            </p>
          </li>
          <li className="space-y-4">
            <h2 className="font-medium">4. Direitos e Deveres</h2>
            <p>
              O usuário tem o direito de solicitar acesso aos seus dados
              pessoais coletados pelo Espaço Colabore, assim como a correção de
              qualquer informação incorreta ou desatualizada. O Espaço Colabore
              se compromete a proteger esses dados pessoais, de acordo com as
              melhores práticas de segurança e em conformidade com a Lei nº
              13.709/2018 (Lei Geral de Proteção de Dados) e com o inciso LXXIX
              do art. 5º da Constituição Federal de 1988. O Espaço Colabore
              também se compromete a utilizar as imagens e vídeos de forma ética
              e responsável.
            </p>

            <p>
              Quanto à utilização do Espaço Colabore, o usuário agendado terá o
              direito de acesso às instalações de acordo com o agendamento
              realizado, ou seja, respeitando a finalidade do agendamento e a
              duração previamente acordada. É dever do usuário respeitar as
              regras e regulamentos internos do Espaço Colabore, incluindo
              horários de funcionamento e conduta adequada. Além disso, cabe ao
              usuário zelar pela limpeza e organização do local que estiver
              utilizando, assim como utilizar os recursos disponibilizados de
              forma responsável. É imprescindível respeitar a privacidade e a
              concentração dos demais usuários do Espaço Colabore.
            </p>
            <p>
              É vedada a utilização do Espaço Colabore para realização de
              atividades ilegais, prejudiciais ou que violem os direitos de
              terceiros. E cabe ao usuário notificar imediatamente a equipe do
              Espaço Colabore sobre qualquer problema, dano ou incidente
              identificado nas instalações.
            </p>
          </li>
          <li className="space-y-4">
            <h2 className="font-medium">5. Contato</h2>
            <p>
              Em caso de dúvidas sobre essa política de privacidade ou o uso de
              suas informações pessoais, entre em contato pelo telefone (21)
              96971-8153 ou pelo e-mail espaco.colabore@mesquita.rj.gov.br.
            </p>
          </li>

          <li className="space-y-4">
            <h2 className="font-medium">
              {" "}
              6. Alterações na Política de Privacidade
            </h2>
            <p>
              Esta política de privacidade pode ser atualizada periodicamente,
              para refletir alterações em nossas práticas de coleta e uso de
              dados pessoais. Recomendamos que você revise regularmente esta
              política para estar ciente de possíveis atualizações.
            </p>

            <p>
              Ao agendar um horário no Espaço Colabore, você reconhece ter lido,
              compreendido e concordado com os termos desta política de
              privacidade.
            </p>
          </li>

          <li className="italic text-sm">
            Data da última atualização: 20 de outubro de 2023.
          </li>
        </ol>
      </div>
    </div>
  );
}
