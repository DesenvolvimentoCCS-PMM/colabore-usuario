interface User {
  nome: string;
  whatsapp: string;
  dataDeNascimento: string;
  cpf: string;
  telefoneSecundario: string;
  profissao?: string;
  foto?: string;
  endereco: [
    cep: string,
    rua: string,
    bairro: string,
    numero: string,
    cidade: string,
    estado: string
  ];
  email: string;
  senha: string;
}
