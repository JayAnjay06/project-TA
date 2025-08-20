import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Ringkasan from "./ringkasan";

interface PropsSection {
  summary: { lokasi: number; jenis: number; data: number; laporan: number };
  loading: boolean;
}

export default function SectionRingkasan({ summary, loading }: PropsSection) {
  const [expanded, setExpanded] = useState(true);

  const items = [
    { label: "Lokasi", value: summary.lokasi, icon: "map-marker-alt" },
    { label: "Jenis", value: summary.jenis, icon: "seedling" },
    { label: "Data", value: summary.data, icon: "database" },
    { label: "Laporan", value: summary.laporan, icon: "file-alt" },
  ];

  return (
    <>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.title}>Ringkasan</Text>
        <FontAwesome5 name={expanded ? "chevron-up" : "chevron-down"} size={16} color="#333" />
      </TouchableOpacity>

      {expanded && (
        loading ? (
          <ActivityIndicator size="large" color="#2e7d32" />
        ) : (
          <View style={styles.container}>
            {items.map((item, idx) => (
              <Ringkasan key={idx} label={item.label} value={item.value} icon={item.icon} />
            ))}
          </View>
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    padding: 15,
  },
  title: { fontSize: 15, fontWeight: "600", color: "#333" },
  container: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15, padding: 10 },
});
