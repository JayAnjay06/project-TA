import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Lokasi {
  lokasi_id: number;
  nama_lokasi: string;
}

interface Monitoring {
  monitoring_id?: number;
  lokasi_id: number;
  lokasi?: Lokasi;
  parameter: string;
  nilai: number;
  tanggal_monitoring: string;
  sumber_data: string;
}

export default function MonitoringUser() {
  const [monitorings, setMonitorings] = useState<Monitoring[]>([]);
  const [loading, setLoading] = useState(true);

  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchMonitoring = async () => {
    const token = await tokenPromise;
    setLoading(true);
    try {
      const res = await fetch("http://10.220.239.63:8000/api/monitoring", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setMonitorings(data || []);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch monitoring");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" color="#1565c0" style={{ flex:1, justifyContent:"center", alignItems:"center" }} />;

  return (
    <FlatList
      data={monitorings}
      keyExtractor={(item) => (item.monitoring_id ? item.monitoring_id.toString() : Math.random().toString())}
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.listTitle}>Daftar Monitoring</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>Lokasi: {item.lokasi?.nama_lokasi}</Text>
          <Text>Parameter: {item.parameter}</Text>
          <Text>Nilai: {item.nilai}</Text>
          <Text>Tanggal: {item.tanggal_monitoring}</Text>
          <Text>Sumber: {item.sumber_data}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f7f7f7" },
  listTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.03, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, elevation: 1 },
});
