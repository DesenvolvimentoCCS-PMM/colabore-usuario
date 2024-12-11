import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "@/assets/logoColabore.png";

//#dd9a25 - orange
//#22325c - blue

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fffded",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    backgroundColor: "#dd9a25",
    padding: 10,
    marginBottom: 10,
    fontWeight: "bold",
  },
  timeDate: {
    display: "flex",
    gap: "4px",
  },
  logo: {
    fontSize: 30,
    color: "#22325c",
    fontWeight: "extrabold",
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
  text: {
    fontSize: 14,
    paddingLeft: 4,
  },
  rules: {
    fontSize: 12,
  },
});

interface VoucherSchemaProps {
  name: string;
  scheduleCode: string;
  date: string;
  time: string;
  service: string;
}

export function VoucherSchema({
  name,
  scheduleCode,
  date,
  time,
  service,
}: VoucherSchemaProps) {
  return (
    <Document title="Comprovante - Espaço Colabore">
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.logo}>Espaço Colabore</Text>

          <Text style={styles.title}>Comprovante de agendamento</Text>

          <Text style={styles.label}>Código de agendamento:</Text>
          <Text style={styles.text}>{scheduleCode}</Text>

          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.text}>{name}</Text>

          <Text style={styles.label}>Serviço:</Text>
          <Text style={styles.text}>{service}</Text>
          <Text style={styles.label}>Data:</Text>
          <Text style={styles.text}>{date}</Text>
          <Text style={styles.label}>Horário:</Text>
          <Text style={styles.text}>{time}</Text>

          <Text style={styles.label}>Local do agendamento:</Text>
          <Text style={styles.text}>
            Av. Marechal Castelo Branco, 131 - Edson Passos, Mesquita - RJ
          </Text>

          <Text>
            ----------------------------------------------------------------------------------------------
          </Text>
          <Text style={{ marginTop: 10, fontSize: 12 }}>
            - Ao chegar no local, apresente este comprovante para uma das
            recepcionistas.
          </Text>
          <Text style={styles.rules}>
            - Chegue com antecedência de pelo menos 15 minutos.
          </Text>
          <Text style={styles.rules}>
            - Em caso de cancelamento, por favor, entre em contato conosco com
            pelo menos 24 horas de antecedência.
          </Text>
          <Text>
            ----------------------------------------------------------------------------------------------
          </Text>

          <Text style={styles.rules}>
            Caso tenha alguma dúvida, entre em contato através do painel de
            agendamentos.
          </Text>

          <Text style={{ marginTop: 20, fontWeight: "semibold", fontSize: 12 }}>
            Equipe Espaço Colabore - Mesquita, 2023
          </Text>
        </View>
      </Page>
    </Document>
  );
}
