# Sobre o projeto

### Requisitos para rodar:

- [NodeJS](https://nodejs.org/en)
- Node Package Manager (Instalado juntamente com o Node)
- [GIT](https://git-scm.com/downloads)

### Como rodar na minha máquina ?

- Clone o projeto `git clone https://github.com/DesenvolvimentoCCS-PMM/colabore-usuario.git`;
- Dentro da pasta do projeto, instale as dependências com `npm install`;
- Agora bastar rodar o projeto com `npm run dev`;
- Pronto 🎉.

## Estrutura do Projeto

- `/src` - Contém todos as pastas e arquivos necessários para o funcionamento da aplicação.

- `/src/app` - É a pasta utilizada pelo NEXT para montar o sistema de roteamento da aplicação, todas as pasta dentro de _/app_ que possuem o arquivo _page.tsx_ são uma rota da aplicação.

  - `/app/.../...` - Dentro das pastas que representam as rotas, também há alguns componentes que são utilizados apenas naquela rota da aplicação.

    - exemplo:
      - `/app/cadastro/SignupForm.tsx`: Componente do formulário de cadastro, exclusivo da rota de Cadastro.

  - `/app/icon.png` - Arquivos com o nome _icon.png_ ou _favicon.ico_ definem o Favicon da aplicação.
  - `/app/layout.tsx` - Todo o sistema é gerado a partir desse arquivo, lá definimos _Metatags_, _Fonts_, _Providers_ e qualquer outra coisa que precise ser acessado no escopo global da aplicação.
  - `/app/global.css` - Define estilizações globais e inicializa o TailwindCSS.

- `/src/assets` - Recursos como imagens, videos e audios.
- `src/components` - São todos os pequenos pedaços da interface que são (re)utilizados em diversas partes da interface.
  - exemplo:
    - `<Container/>` - Usado para englobar o contéudo de uma página com uma estilização padronizada.
- `src/context` - Requisição/compartilhamento de dados e estados globais da interface.
- `src/services` - Configurações de serviços externos, como a configuração do Firebase, por exemplo.
- `src/types` - Tipagens do Typescript.
- `src/utils` - Funções auxilares, podem ser utilizadas em qualquer parte da interface, geralmente para tratar dados.

## Páginas do Sistema

- Homepage: `src/app/(home)`
- Cadastro: `src/app/cadastro`
- Login `src/app/entrar`
- Painel inicial do usuário: `src/app/agendamentos`
- Formulário de agendamento: `src/app/agendamentos/agendar`
- Sobre nós: `src/app/como-funciona`
- Termos de uso: `src/app/termos-de-uso`
