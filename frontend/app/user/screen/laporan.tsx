import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

interface Laporan {
  laporan_id?: number;
  user_id: number;
  lokasi_id: number;
  jenis_laporan: string;
  tanggal_laporan: string;
  isi_laporan: string;
}

interface Lokasi {
  lokasi_id: number;
  nama_lokasi: string;
}

export default function UserLaporan() {
  const [lokasiId, setLokasiId] = useState<number | null>(null);
  const [jenis, setJenis] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [isi, setIsi] = useState("");
  const [lokasis, setLokasis] = useState<Lokasi[]>([]);

  const getToken = async () => await AsyncStorage.getItem("auth_token");

  // Fetch lokasi
  const fetchLokasi = async () => {
    const token = await getToken();
    try {
      const res = await fetch("http://10.220.239.63:8000/api/lokasis", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      setLokasis(data);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch lokasi");
    }
  };

  useEffect(() => {
    fetchLokasi();
  }, []);

  const handleSubmit = async () => {
    const token = await getToken();

    if (!lokasiId || !jenis || !tanggal || !isi) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    try {
      const payload = {
        user_id: 1, // atau ambil dari profil user jika login
        lokasi_id: lokasiId,
        jenis_laporan: jenis,
        tanggal_laporan: tanggal,
        isi_laporan: isi,
      };

      const res = await fetch("http://10.220.239.63:8000/api/laporan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message || "Laporan berhasil dikirim");
        // Reset form
        setLokasiId(null);
        setJenis("");
        setTanggal("");
        setIsi("");
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
        Buat Laporan / Pesan
      </Text>

      <Text>Lokasi</Text>
      <Picker
        selectedValue={lokasiId}
        onValueChange={(v) => setLokasiId(v)}
        style={{ borderWidth: 1, marginBottom: 10 }}
      >
        <Picker.Item label="Pilih lokasi" value={null} />
        {lokasis.map((lok) => (
          <Picker.Item key={lok.lokasi_id} label={lok.nama_lokasi} value={lok.lokasi_id} />
        ))}
      </Picker>

      <Text>Jenis Laporan</Text>
      <TextInput
        value={jenis}
        onChangeText={setJenis}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Text>Tanggal Laporan (YYYY-MM-DD)</Text>
      <TextInput
        value={tanggal}
        onChangeText={setTanggal}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Text>Isi Laporan</Text>
      <TextInput
        value={isi}
        onChangeText={setIsi}
        multiline
        style={{ borderWidth: 1, marginBottom: 10, padding: 5, height: 80 }}
      />

      <Button title="Kirim Laporan" onPress={handleSubmit} />
    </View>
  );
}
