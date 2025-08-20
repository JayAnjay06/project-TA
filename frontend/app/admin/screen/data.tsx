import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

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

export default function DataMangroveCRUD() {
  const [dataMangrove, setDataMangrove] = useState<DataMangrove[]>([]);
  const [lokasis, setLokasis] = useState<Lokasi[]>([]);

  const [mode, setMode] = useState<"none" | "create" | "edit">("none");
  const [editId, setEditId] = useState<number | null>(null);

  const [lokasiId, setLokasiId] = useState<number | null>(null);
  const [kerapatan, setKerapatan] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [diameter, setDiameter] = useState("");
  const [kondisi, setKondisi] = useState<"baik" | "sedang" | "buruk">("baik");
  const [tanggal, setTanggal] = useState("");

  const tokenPromise = AsyncStorage.getItem("auth_token");

  // Fetch Lokasi
  const fetchLokasi = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/lokasis", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLokasis(data);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch lokasi");
    }
  };

  // Fetch Data Mangrove
  const fetchData = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDataMangrove(data);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch data mangrove");
    }
  };

  useEffect(() => {
    fetchLokasi();
    fetchData();
  }, []);

  const resetForm = () => {
    setLokasiId(null);
    setKerapatan("");
    setTinggi("");
    setDiameter("");
    setKondisi("baik");
    setTanggal("");
    setEditId(null);
    setMode("none");
  };

  const handleSubmit = async () => {
    if (!lokasiId || !kerapatan || !tinggi || !diameter || !tanggal) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }
    const token = await tokenPromise;
    const url =
      mode === "create"
        ? "http://10.220.239.63:8000/api/data"
        : `http://10.220.239.63:8000/api/data/${editId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lokasi_id: lokasiId,
          kerapatan: parseInt(kerapatan),
          tinggi_rata2: parseFloat(tinggi),
          diameter_rata2: parseFloat(diameter),
          kondisi,
          tanggal_pengamatan: tanggal,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        resetForm();
        fetchData();
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  const handleEdit = (item: DataMangrove) => {
    setMode("edit");
    setEditId(item.data_id || null);
    setLokasiId(item.lokasi_id);
    setKerapatan(item.kerapatan.toString());
    setTinggi(item.tinggi_rata2.toString());
    setDiameter(item.diameter_rata2.toString());
    setKondisi(item.kondisi);
    setTanggal(item.tanggal_pengamatan);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const token = await tokenPromise;
    try {
      const res = await fetch(`http://10.220.239.63:8000/api/data/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        fetchData();
      } else {
        Alert.alert("Gagal", data.message || "Gagal hapus data");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  return (
    <FlatList
      data={dataMangrove}
      keyExtractor={(item) =>
        item.data_id ? item.data_id.toString() : Math.random().toString()
      }
      ListHeaderComponent={
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#2e7d32",
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={() => setMode(mode === "create" ? "none" : "create")}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
              {mode === "create" ? "Tutup Form" : "Tambah Data Mangrove"}
            </Text>
          </TouchableOpacity>

          {mode !== "none" && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
                {mode === "create" ? "Tambah Data Mangrove" : "Edit Data Mangrove"}
              </Text>

              <Text>Lokasi</Text>
              <Picker selectedValue={lokasiId} onValueChange={(v) => setLokasiId(v)}>
                <Picker.Item label="Pilih lokasi" value={null} />
                {lokasis.map((lok) => (
                  <Picker.Item key={lok.lokasi_id} label={lok.nama_lokasi} value={lok.lokasi_id} />
                ))}
              </Picker>

              <Text>Kerapatan</Text>
              <TextInput
                value={kerapatan}
                onChangeText={setKerapatan}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Tinggi Rata-rata</Text>
              <TextInput
                value={tinggi}
                onChangeText={setTinggi}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Diameter Rata-rata</Text>
              <TextInput
                value={diameter}
                onChangeText={setDiameter}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Kondisi</Text>
              <Picker selectedValue={kondisi} onValueChange={(v) => setKondisi(v)}>
                <Picker.Item label="Baik" value="baik" />
                <Picker.Item label="Sedang" value="sedang" />
                <Picker.Item label="Buruk" value="buruk" />
              </Picker>

              <Text>Tanggal Pengamatan</Text>
              <TextInput
                value={tanggal}
                onChangeText={setTanggal}
                placeholder="YYYY-MM-DD"
                style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
              />

              <Button title={mode === "create" ? "Simpan" : "Update"} onPress={handleSubmit} />
            </View>
          )}

          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Daftar Data Mangrove</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 5 }}>
          <Text>Lokasi: {item.lokasi?.nama_lokasi}</Text>
          <Text>Kerapatan: {item.kerapatan}</Text>
          <Text>Tinggi: {item.tinggi_rata2}</Text>
          <Text>Diameter: {item.diameter_rata2}</Text>
          <Text>Kondisi: {item.kondisi}</Text>
          <Text>Tanggal: {item.tanggal_pengamatan}</Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Hapus" color="red" onPress={() => handleDelete(item.data_id)} />
          </View>
        </View>
      )}
    />
  );
}
