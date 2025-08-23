import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function UserHome() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Halo");

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    router.replace("/login");
  };

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://10.220.239.63:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.user || null);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.log("Error fetch profile:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Selamat pagi");
    else if (hour >= 12 && hour < 17) setGreeting("Selamat siang");
    else setGreeting("Selamat malam");
  };

  useEffect(() => {
    fetchProfile();
    updateGreeting();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      {loading ? (
        <ActivityIndicator size="large" color="#43A047" style={{ marginTop: 50 }} />
      ) : (
        <View style={[styles.headerContainer, { backgroundColor: "#43A047" }]}>
          <View style={styles.leftContainer}>
            {/* Logo user */}
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logoImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.username}>{profile?.username || "User"}</Text>
              <Text style={styles.email}>{profile?.email || "email@example.com"}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <FontAwesome5 name="sign-out-alt" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f9f9f9" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  leftContainer: { flexDirection: "row", alignItems: "center" },
  logoImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 12,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  userInfo: { marginLeft: 8 },
  greeting: { fontSize: 14, color: "#e0f2f1", marginBottom: 2 },
  username: { fontSize: 18, fontWeight: "700", color: "#fff" },
  email: { fontSize: 12, color: "#d1f0c1", marginTop: 2 },
  logoutButton: {
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
