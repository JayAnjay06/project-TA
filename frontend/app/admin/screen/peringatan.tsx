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
interface Peringatan {
  peringatan_id?: number;
  lokasi_id: number;
  jenis_kerusakan: string;
  tanggal_kejadian: string;
  deskripsi: string;
  status: "aktif" | "ditangani" | "selesai";
}

export default function PeringatanCRUD() {
  const [peringatans, setPeringatans] = useState<Peringatan[]>([]);
  const [lokasis, setLokasis] = useState<Lokasi[]>([]);

  const [mode, setMode] = useState<"none" | "create" | "edit">("none");
  const [editId, setEditId] = useState<number | null>(null);

  const [lokasiId, setLokasiId] = useState("");
  const [jenisKerusakan, setJenisKerusakan] = useState("");
  const [tanggalKejadian, setTanggalKejadian] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [status, setStatus] = useState<"aktif" | "ditangani" | "selesai">("aktif");

  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchPeringatan = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/peringatan", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setPeringatans(data);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch peringatan");
    }
  };

  const fetchLokasi = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/lokasis", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setLokasis(data);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch lokasi");
    }
  };

  useEffect(() => {
    fetchPeringatan();
    fetchLokasi();
  }, []);

  const resetForm = () => {
    setLokasiId("");
    setJenisKerusakan("");
    setTanggalKejadian("");
    setDeskripsi("");
    setStatus("aktif");
    setEditId(null);
    setMode("none");
  };

  const handleSubmit = async () => {
    if (!lokasiId || !jenisKerusakan || !tanggalKejadian || !deskripsi) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    const token = await tokenPromise;
    const urlApi =
      mode === "create"
        ? "http://10.220.239.63:8000/api/peringatan"
        : `http://10.220.239.63:8000/api/peringatan/${editId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(urlApi, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lokasi_id: parseInt(lokasiId),
          jenis_kerusakan: jenisKerusakan,
          tanggal_kejadian: tanggalKejadian,
          deskripsi,
          status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        resetForm();
        fetchPeringatan();
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  const handleEdit = (item: Peringatan) => {
    setMode("edit");
    setEditId(item.peringatan_id || null);
    setLokasiId(item.lokasi_id.toString());
    setJenisKerusakan(item.jenis_kerusakan);
    setTanggalKejadian(item.tanggal_kejadian);
    setDeskripsi(item.deskripsi);
    setStatus(item.status);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const token = await tokenPromise;
    try {
      const res = await fetch(`http://10.220.239.63:8000/api/peringatan/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        fetchPeringatan();
      } else {
        Alert.alert("Gagal", data.message || "Gagal hapus peringatan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  return (
    <FlatList
      data={peringatans}
      keyExtractor={(item) =>
        item.peringatan_id ? item.peringatan_id.toString() : Math.random().toString()
      }
      ListHeaderComponent={
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#1565c0",
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={() => setMode(mode === "create" ? "none" : "create")}
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
              {mode === "create" ? "Tutup Form" : "Tambah Peringatan"}
            </Text>
          </TouchableOpacity>

          {mode !== "none" && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
                {mode === "create" ? "Tambah Peringatan" : "Edit Peringatan"}
              </Text>

              <Text>Lokasi</Text>
              <Picker selectedValue={lokasiId} onValueChange={(v) => setLokasiId(v)}>
                <Picker.Item label="Pilih lokasi" value={null} />
                {lokasis.map((lok) => (
                  <Picker.Item key={lok.lokasi_id} label={lok.nama_lokasi} value={lok.lokasi_id} />
                ))}
              </Picker>

              <Text>Jenis Kerusakan</Text>
              <TextInput
                value={jenisKerusakan}
                onChangeText={setJenisKerusakan}
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Tanggal Kejadian (YYYY-MM-DD)</Text>
              <TextInput
                value={tanggalKejadian}
                onChangeText={setTanggalKejadian}
                placeholder="2025-08-20"
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Deskripsi</Text>
              <TextInput
                value={deskripsi}
                onChangeText={setDeskripsi}
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Status</Text>
              <Picker
                selectedValue={status}
                onValueChange={(v) => setStatus(v)}
                style={{ borderWidth: 1, marginBottom: 10 }}
              >
                <Picker.Item label="Aktif" value="aktif" />
                <Picker.Item label="Ditangani" value="ditangani" />
                <Picker.Item label="Selesai" value="selesai" />
              </Picker>

              <Button title={mode === "create" ? "Simpan" : "Update"} onPress={handleSubmit} />
            </View>
          )}

          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Daftar Peringatan</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 5 }}>
          <Text>
            Lokasi:{" "}
            {lokasis.find((l) => l.lokasi_id === item.lokasi_id)?.nama_lokasi ||
              `ID ${item.lokasi_id}`}
          </Text>
          <Text>Jenis Kerusakan: {item.jenis_kerusakan}</Text>
          <Text>Tanggal: {item.tanggal_kejadian}</Text>
          <Text>Deskripsi: {item.deskripsi}</Text>
          <Text>Status: {item.status}</Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Hapus" color="red" onPress={() => handleDelete(item.peringatan_id)} />
          </View>
        </View>
      )}
    />
  );
}
