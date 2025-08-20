import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Lokasi {
  lokasi_id: number;
  nama_lokasi: string;
}

interface DataMangrove {
  data_id?: number;
  lokasi_id: number;
  lokasi?: Lokasi;
  kerapatan: number;
  tinggi_rata2: number;
  diameter_rata2: number;
  kondisi: "baik" | "sedang" | "buruk";
  tanggal_pengamatan: string;
}

export default function DataMangroveUser() {
  const [dataMangrove, setDataMangrove] = useState<DataMangrove[]>([]);
  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchData = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/data", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setDataMangrove(data);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch data mangrove");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FlatList
      data={dataMangrove}
      keyExtractor={(item) => (item.data_id ? item.data_id.toString() : Math.random().toString())}
      ListHeaderComponent={
        <View style={{ padding: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
            Data Mangrove
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 5 }}>
          <Text>Lokasi: {item.lokasi?.nama_lokasi || item.lokasi_id}</Text>
          <Text>Kerapatan: {item.kerapatan}</Text>
          <Text>Tinggi Rata-rata: {item.tinggi_rata2}</Text>
          <Text>Diameter Rata-rata: {item.diameter_rata2}</Text>
          <Text>Kondisi: {item.kondisi}</Text>
          <Text>Tanggal Pengamatan: {item.tanggal_pengamatan}</Text>
        </View>
      )}
    />
  );
}
