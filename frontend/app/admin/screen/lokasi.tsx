import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

interface Lokasi {
  lokasi_id?: number;
  nama_lokasi: string;
  koordinat: string;
  luas_area: number;
  deskripsi?: string;
  tanggal_input?: string;
}

export default function LokasiCRUD() {
  const [lokasis, setLokasis] = useState<Lokasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"create" | "edit" | "none">("none");
  const [editId, setEditId] = useState<number | null>(null);

  const [nama, setNama] = useState("");
  const [koordinat, setKoordinat] = useState("");
  const [luas, setLuas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");

  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchLokasi = async () => {
    const token = await tokenPromise;
    setLoading(true);
    try {
      const res = await fetch("http://10.220.239.63:8000/api/lokasis", {
        headers: { Authorization: `Bearer ${token}` },
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

  const resetForm = () => {
    setNama(""); setKoordinat(""); setLuas(""); setDeskripsi(""); setTanggal("");
    setEditId(null); setMode("none");
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Izinkan akses lokasi untuk fitur ini.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const coords = `${location.coords.latitude},${location.coords.longitude}`;
      setKoordinat(coords);
    } catch (err) {
      Alert.alert("Error", "Tidak bisa mendapatkan lokasi saat ini.");
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (!nama || !koordinat || !luas) {
      Alert.alert("Error", "Nama, koordinat, dan luas wajib diisi");
      return;
    }
    const token = await tokenPromise;
    const url = mode === "create"
      ? "http://10.220.239.63:8000/api/lokasis"
      : `http://10.220.239.63:8000/api/lokasis/${editId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nama_lokasi: nama,
          koordinat,
          luas_area: parseFloat(luas),
          deskripsi,
          tanggal_input: tanggal || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        resetForm();
        fetchLokasi();
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  const handleEdit = (lokasi: Lokasi) => {
    setMode("edit"); setEditId(lokasi.lokasi_id || null);
    setNama(lokasi.nama_lokasi); setKoordinat(lokasi.koordinat);
    setLuas(lokasi.luas_area.toString()); setDeskripsi(lokasi.deskripsi || "");
    setTanggal(lokasi.tanggal_input || "");
  };

  const handleDelete = async (lokasi_id?: number) => {
    if (!lokasi_id) return;
    const token = await tokenPromise;
    try {
      const res = await fetch(`http://10.220.239.63:8000/api/lokasis/${lokasi_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        fetchLokasi();
      } else {
        Alert.alert("Gagal", data.message || "Gagal hapus lokasi");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#2e7d32" style={{ flex:1, justifyContent:"center", alignItems:"center" }} />;

  return (
    <FlatList
      data={lokasis}
      keyExtractor={(item) => (item.lokasi_id ? item.lokasi_id.toString() : Math.random().toString())}
      ListHeaderComponent={
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setMode(mode === "create" ? "none" : "create")}
          >
            <Text style={styles.toggleButtonText}>
              {mode === "create" ? "Tutup Form" : "Tambah Lokasi Baru"}
            </Text>
          </TouchableOpacity>

          {mode !== "none" && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{mode === "create" ? "Tambah Lokasi" : "Edit Lokasi"}</Text>
              <TextInput style={styles.input} placeholder="Nama Lokasi" value={nama} onChangeText={setNama} />
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Koordinat" value={koordinat} onChangeText={setKoordinat} />
                <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                  <Text style={{ color: "#fff" }}>📍</Text>
                </TouchableOpacity>
              </View>
              <TextInput style={styles.input} placeholder="Luas Area (m²)" value={luas} onChangeText={setLuas} keyboardType="numeric"/>
              <TextInput style={styles.input} placeholder="Deskripsi" value={deskripsi} onChangeText={setDeskripsi} />
              <TextInput style={styles.input} placeholder="Tanggal (YYYY-MM-DD)" value={tanggal} onChangeText={setTanggal} />
              <Button title={mode === "create" ? "Simpan" : "Update"} onPress={handleSubmit} color="#2e7d32" />
            </View>
          )}

          <Text style={styles.listTitle}>Daftar Lokasi</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.nama_lokasi}</Text>
          <Text>Koordinat: {item.koordinat}</Text>
          <Text>Luas: {item.luas_area} m²</Text>
          {item.deskripsi ? <Text>Deskripsi: {item.deskripsi}</Text> : null}
          {item.tanggal_input ? <Text>Tanggal: {item.tanggal_input}</Text> : null}

          <View style={styles.cardButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.lokasi_id)}>
              <Text style={styles.buttonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f7f7f7" },
  toggleButton: { backgroundColor: "#2e7d32", padding: 12, borderRadius: 8, marginBottom: 15 },
  toggleButtonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  formCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: "#f9f9f9" },
  locationButton: { marginLeft: 8, backgroundColor: "#2e7d32", padding: 10, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  listTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.03, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, elevation: 1 },
  cardTitle: { fontWeight: "600", fontSize: 16, marginBottom: 5 },
  cardButtons: { flexDirection: "row", marginTop: 10, gap: 10 },
  editButton: { flex: 1, backgroundColor: "#1976d2", padding: 10, borderRadius: 8, alignItems: "center" },
  deleteButton: { flex: 1, backgroundColor: "#d32f2f", padding: 10, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
});
