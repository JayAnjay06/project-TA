import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Laporan {
  laporan_id?: number;
  user_id: number;
  lokasi_id: number;
  jenis_laporan: string;
  tanggal_laporan: string;
  isi_laporan: string;
  status?: "baru" | "diproses" | "selesai";
  lokasi?: { nama_lokasi: string };
}

export default function LaporanAdmin() {
  const [laporans, setLaporans] = useState<Laporan[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [jenis, setJenis] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [isi, setIsi] = useState("");

  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchLaporan = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/laporan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Laporan[] = await res.json();
      const dataWithStatus = data.map((lap) => ({
        ...lap,
        status: lap.status || "baru",
      }));
      setLaporans(dataWithStatus);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch laporan");
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setJenis("");
    setTanggal("");
    setIsi("");
  };

  const handleEdit = (laporan: Laporan) => {
    setEditId(laporan.laporan_id || null);
    setJenis(laporan.jenis_laporan);
    setTanggal(laporan.tanggal_laporan);
    setIsi(laporan.isi_laporan);
  };

  const handleUpdate = async () => {
    if (!editId || !jenis || !tanggal || !isi) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    const token = await tokenPromise;
    try {
      const res = await fetch(`http://10.220.239.63:8000/api/laporan/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jenis_laporan: jenis,
          tanggal_laporan: tanggal,
          isi_laporan: isi,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        resetForm();
        fetchLaporan();
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  const getStatusColor = (status?: "baru" | "diproses" | "selesai") => {
    switch (status) {
      case "diproses":
        return "#fff4b2";
      case "selesai":
        return "#c8f7c5";
      case "baru":
      default:
        return "#f8d7da";
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {/* Form Edit */}
      {editId && (
        <View style={{ padding: 20, borderWidth: 1, borderColor: "#ccc", marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Edit Laporan</Text>

          <Text>Jenis Laporan</Text>
          <TextInput value={jenis} onChangeText={setJenis} style={{ borderWidth: 1, padding: 8, marginBottom: 5 }} />

          <Text>Tanggal Laporan (YYYY-MM-DD)</Text>
          <TextInput value={tanggal} onChangeText={setTanggal} style={{ borderWidth: 1, padding: 8, marginBottom: 5 }} />

          <Text>Isi Laporan</Text>
          <TextInput
            value={isi}
            onChangeText={setIsi}
            multiline
            style={{ borderWidth: 1, padding: 8, marginBottom: 10, height: 80 }}
          />

          <Button title="Update" onPress={handleUpdate} />
          <View style={{ height: 10 }} />
          <Button title="Batal" color="gray" onPress={resetForm} />
        </View>
      )}

      {/* List Laporan */}
      {laporans.map((item) => (
        <View
          key={item.laporan_id}
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            marginBottom: 5,
            backgroundColor: getStatusColor(item.status),
          }}
        >
          <Text>Lokasi: {item.lokasi?.nama_lokasi || item.lokasi_id}</Text>
          <Text>Jenis: {item.jenis_laporan}</Text>
          <Text>Tanggal: {item.tanggal_laporan}</Text>
          <Text>Isi: {item.isi_laporan}</Text>
          <Text>Status: {item.status}</Text>

          <View style={{ marginTop: 5 }}>
            <Button title="Edit" onPress={() => handleEdit(item)} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
