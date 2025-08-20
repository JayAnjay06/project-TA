import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface JenisMangrove {
  jenis_id?: number;
  nama_ilmiah: string;
  nama_lokal: string;
  deskripsi?: string;
  gambar?: string;
}

export default function JenisMangroveUser() {
  const [jenisList, setJenisList] = useState<JenisMangrove[]>([]);
  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchJenis = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/jenis", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setJenisList(data || []);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch data jenis mangrove");
    }
  };

  useEffect(() => {
    fetchJenis();
  }, []);

  return (
    <FlatList
      data={jenisList}
      keyExtractor={(item) =>
        item.jenis_id ? item.jenis_id.toString() : Math.random().toString()
      }
      ListHeaderComponent={
        <View style={{ padding: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
            Jenis Mangrove
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            marginBottom: 5,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.nama_lokal}</Text>
          <Text>Nama Ilmiah: {item.nama_ilmiah}</Text>
          {item.deskripsi ? <Text>Deskripsi: {item.deskripsi}</Text> : null}
          {item.gambar ? (
            <Image
              source={{ uri: item.gambar }}
              style={{ width: 100, height: 100, marginTop: 5 }}
            />
          ) : null}
        </View>
      )}
    />
  );
}
