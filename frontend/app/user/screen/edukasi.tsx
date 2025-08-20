import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Edukasi {
  edukasi_id?: number;
  judul: string;
  konten: string;
  jenis_media: "artikel" | "video" | "gambar" | "game";
  url?: string;
}

export default function EdukasiUser() {
  const [edukasies, setEdukasi] = useState<Edukasi[]>([]);
  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchEdukasi = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/edukasi", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setEdukasi(data);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch edukasi");
    }
  };

  useEffect(() => {
    fetchEdukasi();
  }, []);

  return (
    <FlatList
      data={edukasies}
      keyExtractor={(item) => (item.edukasi_id ? item.edukasi_id.toString() : Math.random().toString())}
      ListHeaderComponent={
        <View style={{ padding: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
            Edukasi Mangrove
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 5 }}>
          <Text>Judul: {item.judul}</Text>
          <Text>Konten: {item.konten}</Text>
          <Text>Jenis: {item.jenis_media}</Text>
          {item.url ? <Text>URL: {item.url}</Text> : null}
        </View>
      )}
    />
  );
}
