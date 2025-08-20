import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterAdminScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !namaLengkap || !password) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    try {
      const res = await fetch("http://10.220.239.63:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          nama_lengkap: namaLengkap,
          role: "admin",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sukses", "Registrasi admin berhasil");
        router.push("/login");
      } else {
        Alert.alert("Gagal", data.message || "Registrasi gagal");
      }
    } catch (err) {
      Alert.alert("Error", "Terjadi kesalahan");
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#f7f7f7"
    }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 40 }}>Daftar Admin</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={{
          width: "100%",
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 16,
          backgroundColor: "#fff"
        }}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        style={{
          width: "100%",
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 16,
          backgroundColor: "#fff"
        }}
      />

      <TextInput
        value={namaLengkap}
        onChangeText={setNamaLengkap}
        placeholder="Nama Lengkap"
        style={{
          width: "100%",
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 16,
          backgroundColor: "#fff"
        }}
      />

      <View style={{ width: "100%", position: "relative", marginBottom: 24 }}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={{
            width: "100%",
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            backgroundColor: "#fff",
            paddingRight: 40
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: 12 }}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          width: "100%",
          padding: 15,
          backgroundColor: "#4CAF50",
          borderRadius: 8,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Daftar Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')} style={{ marginTop: 20 }}>
        <Text style={{ color: '#007BFF' }}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
