import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username dan password harus diisi");
      return;
    }

    try {
      const res = await fetch("http://10.220.239.63:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem("auth_token", data.token);
        await AsyncStorage.setItem("role", data.user.role);

        if (data.user.role === "admin") router.replace("/admin");
        else router.replace("/user");
      } else {
        Alert.alert("Login gagal", data.message || "Periksa username/password");
      }
    } catch (err) {
      Alert.alert("Error", "Tidak bisa konek ke server");
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
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 40 }}>Login</Text>

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
            paddingRight: 40 // space for icon
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
        onPress={handleLogin}
        style={{
          width: "100%",
          padding: 15,
          backgroundColor: "#4CAF50",
          borderRadius: 8,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Masuk</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 20 }}>
        <Text style={{ color: "#007BFF" }}>Belum punya akun? Daftar</Text>
      </TouchableOpacity>
    </View>
  );
}
