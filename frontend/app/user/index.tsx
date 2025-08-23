import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

type LokasiType = {
  id: number;
  nama_lokasi: string;
  koordinat: string;
  luas: string;
};

export default function UserHome() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Halo");
  const [lokasiMangrove, setLokasiMangrove] = useState<LokasiType[]>([]);

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
      }
    } catch (err) {
      console.log("Error fetch profile:", err);
    }
  };

  const fetchLokasi = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const res = await fetch("http://10.220.239.63:8000/api/lokasis", {
        headers: { Authorization: `Bearer ${token}` },
      }); if (res.ok) {
        const data = await res.json();
        setLokasiMangrove(data || []);
      }
    } catch (err) {
      console.log("Error fetch lokasi:", err);
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
    fetchLokasi();
    updateGreeting();
  }, []);

  const navButtons = [
    { label: "Lokasi", route: "/user/screen/lokasi", icon: "map-marker-alt" },
    { label: "Jenis", route: "/user/screen/jenis", icon: "seedling" },
    { label: "Edukasi", route: "/user/screen/edukasi", icon: "book-open" },
    { label: "Laporan", route: "/user/screen/laporan", icon: "seedling" },
  ] as const;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      {loading ? (
        <ActivityIndicator size="large" color="#43A047" style={{ marginTop: 50 }} />
      ) : (
        <>
          {/* Header */}
          <View style={[styles.headerContainer, { backgroundColor: "#43A047" }]}>
            <View style={styles.leftContainer}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logoImage} />
              <View style={styles.userInfo}>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.username}>{profile?.username || "User"}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <FontAwesome5 name="sign-out-alt" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Konten Scroll */}
          <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 100 }}>
            {/* Hero / Ringkasan */}
            <View style={styles.hero}>
              <Text style={styles.heroText}>Selamat datang di MMIC</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.liveChatButton, { flex: 1, marginRight: 5 }]}
                  onPress={() => router.push("/user/screen/chat")}
                >
                  <Text style={styles.liveChatText}>Live Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.liveChatButton, { flex: 1, marginLeft: 5 }]}
                  onPress={() => router.push("/user/screen/identifikasi")}
                >
                  <Text style={styles.liveChatText}>Identifikasi</Text>
                </TouchableOpacity>
              </View>
            </View>


            {/* Navigasi Cepat */}
            <View style={styles.navQuick}>
              {navButtons.map((btn) => (
                <TouchableOpacity
                  key={btn.label}
                  style={styles.navButton}
                  onPress={() => router.push(btn.route)}
                >
                  <FontAwesome5 name={btn.icon as any} size={24} color="#fff" />
                  <Text style={styles.navLabel}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Footer fixed */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Copyright © MMIC 2025</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
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
  logoImage: { width: 50, height: 50, borderRadius: 12, marginRight: 10 },
  userInfo: { marginLeft: 8 },
  greeting: { fontSize: 14, color: "#e0f2f1", marginBottom: 2 },
  username: { fontSize: 18, fontWeight: "700", color: "#fff" },
  logoutButton: {
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: { marginVertical: 10, padding: 15, backgroundColor: "#43A047", borderRadius: 12 },
  heroText: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  liveChatButton: { backgroundColor: "#FFC107", padding: 10, borderRadius: 8 },
  liveChatText: { color: "#000", fontWeight: "700", textAlign: "center" },
  navQuick: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  navButton: {
    flex: 1,
    margin: 4,
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  navLabel: { color: "#fff", marginTop: 6, fontWeight: "700", fontSize: 12 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: "#333", fontSize: 8 },
});
