export interface ScheduleDataType {
  uid: string;
  nome: string;
  whatsapp: string;
  email: string;
  cpf: string;
  endereco: {
    cep: string;
    rua: string;
    cidade: string;
    bairro: string;
    numero: number;
  };
  status: number;
  data: string;
  horario: string;
  tempoDeUso: string;
  tipoServico: string;
  motivo: string;
  concluidoEm?: string;
  excluidoEm?: string;
  criadoPor: string;
}
