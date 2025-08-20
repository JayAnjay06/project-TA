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

interface Monitoring {
  monitoring_id?: number;
  lokasi_id: number;
  lokasi?: Lokasi;
  parameter: string;
  nilai: number;
  tanggal_monitoring: string;
  sumber_data: string;
}

export default function MonitoringCRUD() {
  const [monitorings, setMonitorings] = useState<Monitoring[]>([]);
  const [lokasis, setLokasis] = useState<Lokasi[]>([]);

  const [mode, setMode] = useState<"none" | "create" | "edit">("none");
  const [editId, setEditId] = useState<number | null>(null);

  const [lokasiId, setLokasiId] = useState<number | null>(null);
  const [parameter, setParameter] = useState("");
  const [nilai, setNilai] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [sumber, setSumber] = useState("");

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

  // Fetch Monitoring
  const fetchMonitoring = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/monitoring", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMonitorings(data);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch monitoring");
    }
  };

  useEffect(() => {
    fetchLokasi();
    fetchMonitoring();
  }, []);

  const resetForm = () => {
    setLokasiId(null);
    setParameter("");
    setNilai("");
    setTanggal("");
    setSumber("");
    setEditId(null);
    setMode("none");
  };

  const handleSubmit = async () => {
    if (!lokasiId || !parameter || !nilai || !tanggal || !sumber) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }
    const token = await tokenPromise;
    const url =
      mode === "create"
        ? "http://10.220.239.63:8000/api/monitoring"
        : `http://10.220.239.63:8000/api/monitoring/${editId}`;
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
          parameter,
          nilai: parseFloat(nilai),
          tanggal_monitoring: tanggal,
          sumber_data: sumber,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        resetForm();
        fetchMonitoring();
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  const handleEdit = (item: Monitoring) => {
    setMode("edit");
    setEditId(item.monitoring_id || null);
    setLokasiId(item.lokasi_id);
    setParameter(item.parameter);
    setNilai(item.nilai.toString());
    setTanggal(item.tanggal_monitoring);
    setSumber(item.sumber_data);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const token = await tokenPromise;
    try {
      const res = await fetch(`http://10.220.239.63:8000/api/monitoring/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        fetchMonitoring();
      } else {
        Alert.alert("Gagal", data.message || "Gagal hapus monitoring");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  return (
    <FlatList
      data={monitorings}
      keyExtractor={(item) =>
        item.monitoring_id ? item.monitoring_id.toString() : Math.random().toString()
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
              {mode === "create" ? "Tutup Form" : "Tambah Monitoring"}
            </Text>
          </TouchableOpacity>

          {mode !== "none" && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
                {mode === "create" ? "Tambah Monitoring" : "Edit Monitoring"}
              </Text>

              <Text>Lokasi</Text>
              <Picker selectedValue={lokasiId} onValueChange={(v) => setLokasiId(v)}>
                <Picker.Item label="Pilih lokasi" value={null} />
                {lokasis.map((lok) => (
                  <Picker.Item key={lok.lokasi_id} label={lok.nama_lokasi} value={lok.lokasi_id} />
                ))}
              </Picker>

              <Text>Parameter</Text>
              <TextInput
                value={parameter}
                onChangeText={setParameter}
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Nilai</Text>
              <TextInput
                value={nilai}
                onChangeText={setNilai}
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Tanggal Monitoring</Text>
              <TextInput
                value={tanggal}
                onChangeText={setTanggal}
                placeholder="YYYY-MM-DD"
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Sumber Data</Text>
              <TextInput
                value={sumber}
                onChangeText={setSumber}
                style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
              />

              <Button title={mode === "create" ? "Simpan" : "Update"} onPress={handleSubmit} />
            </View>
          )}

          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Daftar Monitoring</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 5 }}>
          <Text>Lokasi: {item.lokasi?.nama_lokasi}</Text>
          <Text>Parameter: {item.parameter}</Text>
          <Text>Nilai: {item.nilai}</Text>
          <Text>Tanggal: {item.tanggal_monitoring}</Text>
          <Text>Sumber: {item.sumber_data}</Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Hapus" color="red" onPress={() => handleDelete(item.monitoring_id)} />
          </View>
        </View>
      )}
    />
  );
}
