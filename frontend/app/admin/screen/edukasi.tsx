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

interface Edukasi {
  edukasi_id?: number;
  judul: string;
  konten: string;
  jenis_media: "artikel" | "video" | "gambar" | "game";
  url?: string;
}

export default function EdukasiCRUD() {
  const [edukasies, setEdukasi] = useState<Edukasi[]>([]);

  const [mode, setMode] = useState<"none" | "create" | "edit">("none");
  const [editId, setEditId] = useState<number | null>(null);

  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [jenisMedia, setJenisMedia] = useState<"artikel" | "video" | "gambar" | "game">("artikel");
  const [url, setUrl] = useState("");

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

  const resetForm = () => {
    setJudul("");
    setKonten("");
    setJenisMedia("artikel");
    setUrl("");
    setEditId(null);
    setMode("none");
  };

  const handleSubmit = async () => {
    if (!judul || !konten || !jenisMedia) {
      Alert.alert("Error", "Judul, konten, dan jenis media wajib diisi");
      return;
    }
    const token = await tokenPromise;
    const urlApi =
      mode === "create"
        ? "http://10.220.239.63:8000/api/edukasi"
        : `http://10.220.239.63:8000/api/edukasi/${editId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(urlApi, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ judul, konten, jenis_media: jenisMedia, url: url || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        resetForm();
        fetchEdukasi();
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  const handleEdit = (item: Edukasi) => {
    setMode("edit");
    setEditId(item.edukasi_id || null);
    setJudul(item.judul);
    setKonten(item.konten);
    setJenisMedia(item.jenis_media);
    setUrl(item.url || "");
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const token = await tokenPromise;
    try {
      const res = await fetch(`http://10.220.239.63:8000/api/edukasi/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        fetchEdukasi();
      } else {
        Alert.alert("Gagal", data.message || "Gagal hapus edukasi");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  return (
    <FlatList
      data={edukasies}
      keyExtractor={(item) =>
        item.edukasi_id ? item.edukasi_id.toString() : Math.random().toString()
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
              {mode === "create" ? "Tutup Form" : "Tambah Edukasi"}
            </Text>
          </TouchableOpacity>

          {mode !== "none" && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
                {mode === "create" ? "Tambah Edukasi" : "Edit Edukasi"}
              </Text>

              <Text>Judul</Text>
              <TextInput value={judul} onChangeText={setJudul} style={{ borderWidth: 1, padding: 8, marginBottom: 5 }} />

              <Text>Konten</Text>
              <TextInput value={konten} onChangeText={setKonten} style={{ borderWidth: 1, padding: 8, marginBottom: 5 }} />

              <Text>Jenis Media</Text>
              <Picker selectedValue={jenisMedia} onValueChange={(v) => setJenisMedia(v)} style={{ borderWidth: 1, marginBottom: 5 }}>
                <Picker.Item label="Artikel" value="artikel" />
                <Picker.Item label="Video" value="video" />
                <Picker.Item label="Gambar" value="gambar" />
                <Picker.Item label="Game" value="game" />
              </Picker>

              <Text>URL (Opsional)</Text>
              <TextInput value={url} onChangeText={setUrl} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />

              <Button title={mode === "create" ? "Simpan" : "Update"} onPress={handleSubmit} />
            </View>
          )}

          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Daftar Edukasi</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 5 }}>
          <Text>Judul: {item.judul}</Text>
          <Text>Konten: {item.konten}</Text>
          <Text>Jenis: {item.jenis_media}</Text>
          {item.url ? <Text>URL: {item.url}</Text> : null}

          <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Hapus" color="red" onPress={() => handleDelete(item.edukasi_id)} />
          </View>
        </View>
      )}
    />
  );
}
