import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Lokasi {
  lokasi_id: number;
  nama_lokasi: string;
}

interface Peringatan {
  peringatan_id?: number;
  lokasi_id: number;
  jenis_kerusakan: string;
  tanggal_kejadian: string;
  deskripsi: string;
  status: "aktif" | "ditangani" | "selesai";
  lokasi?: Lokasi; // relasi lokasi
}

export default function PeringatanUser() {
  const [peringatans, setPeringatans] = useState<Peringatan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPeringatan = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    setLoading(true);
    try {
      const res = await fetch("http://10.220.239.63:8000/api/peringatan", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setPeringatans(data || []);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch peringatan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeringatan();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#1565c0"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  return (
    <FlatList
      data={peringatans}
      keyExtractor={(item) =>
        item.peringatan_id ? item.peringatan_id.toString() : Math.random().toString()
      }
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.listTitle}>Daftar Peringatan</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>
            Lokasi: {item.lokasi?.nama_lokasi || `ID ${item.lokasi_id}`}
          </Text>
          <Text>Jenis Kerusakan: {item.jenis_kerusakan}</Text>
          <Text>Tanggal: {item.tanggal_kejadian}</Text>
          <Text>Deskripsi: {item.deskripsi}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f7f7f7" },
  listTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
});
