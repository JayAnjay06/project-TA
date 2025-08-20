import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Lokasi {
  lokasi_id?: number;
  nama_lokasi: string;
  koordinat: string;
  luas_area: number;
  deskripsi?: string;
  tanggal_input?: string;
}

export default function LokasiUser() {
  const [lokasis, setLokasis] = useState<Lokasi[]>([]);
  const [loading, setLoading] = useState(true);

  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchLokasi = async () => {
    const token = await tokenPromise;
    setLoading(true);
    try {
      const res = await fetch("http://10.220.239.63:8000/api/lokasis", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setLokasis(data || []);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch data lokasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLokasi(); }, []);

  if (loading)
    return <ActivityIndicator size="large" color="#2e7d32" style={{ flex:1, justifyContent:"center", alignItems:"center" }} />;

  return (
    <FlatList
      data={lokasis}
      keyExtractor={(item) => (item.lokasi_id ? item.lokasi_id.toString() : Math.random().toString())}
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.listTitle}>Daftar Lokasi Mangrove</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.nama_lokasi}</Text>
          <Text>Koordinat: {item.koordinat}</Text>
          <Text>Luas: {item.luas_area} m²</Text>
          {item.deskripsi ? <Text>Deskripsi: {item.deskripsi}</Text> : null}
          {item.tanggal_input ? <Text>Tanggal: {item.tanggal_input}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f7f7f7" },
  listTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.03, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, elevation: 1 },
  cardTitle: { fontWeight: "600", fontSize: 16, marginBottom: 5 },
});
