import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface PropsRingkasan {
  label: string;
  value: number;
  icon: string;
}

export default function Ringkasan({ label, value, icon }: PropsRingkasan) {
  return (
    <View style={styles.card}>
      <FontAwesome5 name={icon as any} size={20} color="#2e7d32" />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "23%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  value: { fontSize: 16, fontWeight: "700", color: "#2e7d32", marginTop: 4 },
  label: { fontSize: 12, color: "#555", marginTop: 2 },
});
