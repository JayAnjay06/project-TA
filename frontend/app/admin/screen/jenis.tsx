import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

interface JenisMangrove {
  jenis_id?: number;
  nama_ilmiah: string;
  nama_lokal: string;
  deskripsi?: string;
  gambar?: string;
}

export default function JenisMangroveCRUD() {
  const [jenisList, setJenisList] = useState<JenisMangrove[]>([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<"none" | "create" | "edit">("none");
  const [editId, setEditId] = useState<number | null>(null);

  const [namaIlmiah, setNamaIlmiah] = useState("");
  const [namaLokal, setNamaLokal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambarUri, setGambarUri] = useState<string | null>(null);
  const [gambarFile, setGambarFile] = useState<any>(null);

  const tokenPromise = AsyncStorage.getItem("auth_token");

  const fetchJenis = async () => {
    const token = await tokenPromise;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/jenis", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJenisList(data || []);
    } catch {
      Alert.alert("Error", "Tidak bisa fetch data jenis mangrove");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJenis();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setGambarUri(result.assets[0].uri);
      setGambarFile(result.assets[0]);
    }
  };

  const resetForm = () => {
    setNamaIlmiah("");
    setNamaLokal("");
    setDeskripsi("");
    setGambarUri(null);
    setGambarFile(null);
    setEditId(null);
    setMode("none");
  };

  const handleSubmit = async () => {
    if (!namaIlmiah || !namaLokal) {
      Alert.alert("Error", "Nama ilmiah dan lokal wajib diisi");
      return;
    }
    const token = await tokenPromise;

    try {
      const formData = new FormData();
      formData.append("nama_ilmiah", namaIlmiah);
      formData.append("nama_lokal", namaLokal);
      if (deskripsi) formData.append("deskripsi", deskripsi);
      if (gambarFile) {
        formData.append("gambar", {
          uri: gambarUri,
          name: "gambar.jpg",
          type: "image/jpeg",
        } as any);
      }

      const url =
        mode === "create"
          ? "http://10.220.239.63:8000/api/jenis"
          : `http://10.220.239.63:8000/api/jenis/${editId}`;
      const method = mode === "create" ? "POST" : "POST";

      if (mode === "edit") formData.append("_method", "PUT");

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Sukses", data.message);
        resetForm();
        fetchJenis();
      } else {
        Alert.alert("Gagal", data.message || "Terjadi kesalahan");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  const handleEdit = (item: JenisMangrove) => {
    setMode("edit");
    setEditId(item.jenis_id || null);
    setNamaIlmiah(item.nama_ilmiah);
    setNamaLokal(item.nama_lokal);
    setDeskripsi(item.deskripsi || "");
    setGambarUri(item.gambar || null);
  };

  const handleDelete = async (jenis_id?: number) => {
    if (!jenis_id) return;
    const token = await tokenPromise;
    try {
      const res = await fetch(`http://10.220.239.63:8000/api/jenis/${jenis_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", data.message);
        fetchJenis();
      } else {
        Alert.alert("Gagal", data.message || "Gagal hapus data");
      }
    } catch {
      Alert.alert("Error", "Tidak bisa konek ke server");
    }
  };

  return (
    <FlatList
      data={jenisList}
      keyExtractor={(item) =>
        item.jenis_id ? item.jenis_id.toString() : Math.random().toString()
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
            onPress={() =>
              setMode(mode === "create" ? "none" : "create")
            }
          >
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
              {mode === "create" ? "Tutup Form" : "Tambah Jenis Mangrove"}
            </Text>
          </TouchableOpacity>

          {mode !== "none" && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
                {mode === "create" ? "Tambah Jenis Mangrove" : "Edit Jenis Mangrove"}
              </Text>

              <Text>Nama Ilmiah</Text>
              <TextInput
                value={namaIlmiah}
                onChangeText={setNamaIlmiah}
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Nama Lokal</Text>
              <TextInput
                value={namaLokal}
                onChangeText={setNamaLokal}
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Text>Deskripsi</Text>
              <TextInput
                value={deskripsi}
                onChangeText={setDeskripsi}
                style={{ borderWidth: 1, padding: 8, marginBottom: 5 }}
              />

              <Button title="Pilih Gambar" onPress={pickImage} />
              {gambarUri && (
                <Image
                  source={{ uri: gambarUri }}
                  style={{ width: 100, height: 100, marginVertical: 10 }}
                />
              )}

              <Button
                title={mode === "create" ? "Simpan" : "Update"}
                onPress={handleSubmit}
              />
            </View>
          )}

          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
            Daftar Jenis Mangrove
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
          <Text style={{ fontWeight: "bold" }}>{item.nama_lokal}</Text>
          <Text>Nama Ilmiah: {item.nama_ilmiah}</Text>
          {item.deskripsi ? <Text>Deskripsi: {item.deskripsi}</Text> : null}
          {item.gambar ? (
            <Image
              source={{ uri: item.gambar }}
              style={{ width: 100, height: 100, marginTop: 5 }}
            />
          ) : null}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 5 }}>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button
              title="Hapus"
              color="red"
              onPress={() => handleDelete(item.jenis_id)}
            />
          </View>
        </View>
      )}
    />
  );
}
