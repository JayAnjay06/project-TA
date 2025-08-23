import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

type SummaryType = {
  lokasi: number;
  jenis: number;
  data: number;
  laporan: number;
};

export default function AdminHome() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ username: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Halo");
  const [summary, setSummary] = useState<SummaryType>({ lokasi: 0, jenis: 0, data: 0, laporan: 0 });
  const [lokasiMangrove, setLokasiMangrove] = useState<any[]>([]);

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    router.replace("/login");
  };

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) return;
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

  const fetchSummary = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) return;

      const endpoints = [
        { key: "lokasi", url: "http://10.220.239.63:8000/api/lokasis" },
        { key: "jenis", url: "http://10.220.239.63:8000/api/jenis" },
        { key: "data", url: "http://10.220.239.63:8000/api/data" },
        { key: "laporan", url: "http://10.220.239.63:8000/api/laporan" },
      ];

      const newSummary: any = {};
      for (let ep of endpoints) {
        const res = await fetch(ep.url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          newSummary[ep.key] = Array.isArray(data) ? data.length : 0;
          if (ep.key === "lokasi") setLokasiMangrove(data);
        } else {
          newSummary[ep.key] = 0;
        }
      }
      setSummary(newSummary);
    } catch (err) {
      console.log("Error fetch summary:", err);
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Selamat pagi");
    else if (hour >= 12 && hour < 17) setGreeting("Selamat siang");
    else setGreeting("Selamat malam");
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProfile(), fetchSummary()])
      .finally(() => setLoading(false));
    updateGreeting();
  }, []);

  const navButtons = [
    { label: "Lokasi", route: "/admin/screen/lokasi", icon: "map-marker-alt" },
    { label: "Jenis", route: "/admin/screen/jenis", icon: "seedling" },
    { label: "Data", route: "/admin/screen/data", icon: "database" },
    { label: "Laporan", route: "/admin/screen/laporan", icon: "file-alt" },
    { label: "Monitoring", route: "/admin/screen/monitoring", icon: "tachometer-alt" },
    { label: "Edukasi", route: "/admin/screen/edukasi", icon: "book" },
    { label: "Peringatan", route: "/admin/screen/peringatan", icon: "exclamation-triangle" },
  ] as const;

  const showAlert = () => {
    Alert.alert("Info", "Ada laporan baru yang masuk!");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.leftContainer}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logoImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.greeting}>{greeting},</Text>
                <Text style={styles.username}>{profile?.username || "Admin"}</Text>
                <Text style={styles.email}>{profile?.email || "admin@example.com"}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{profile?.role?.toUpperCase() || "ADMIN"}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <FontAwesome5 name="sign-out-alt" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Ringkasan */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Ringkasan Data</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryNumber}>{summary.lokasi}</Text>
                <Text style={styles.summaryLabel}>Lokasi</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryNumber}>{summary.jenis}</Text>
                <Text style={styles.summaryLabel}>Jenis</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryNumber}>{summary.data}</Text>
                <Text style={styles.summaryLabel}>Data</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryNumber}>{summary.laporan}</Text>
                <Text style={styles.summaryLabel}>Laporan</Text>
              </View>
            </View>
          </View>

          {/* Shortcut Buttons */}
          <View style={styles.shortcutContainer}>
            <Text style={styles.summaryTitle}>Navigasi Cepat</Text>
            <View style={styles.shortcutRow}>
              {navButtons.map((btn) => (
                <TouchableOpacity
                  key={btn.label}
                  style={styles.shortcutButton}
                  onPress={() => router.push(btn.route)}
                >
                  <FontAwesome5 name={btn.icon as any} size={22} color="#fff" />
                  <Text style={styles.shortcutLabel}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Contoh notif */}
          <TouchableOpacity style={[styles.alertButton, { marginTop: 15 }]} onPress={showAlert}>
            <Text style={styles.alertText}>Cek Laporan Baru</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.alertButton, { marginTop: 10 }]} onPress={() => router.push('/admin/screen/register')}>
            <Text style={styles.alertText}>Tambah Admin</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {/* Footer fixed */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Copyright © MMIC 2025</Text>
      </View>
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
    backgroundColor: "#2E7D32",
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
  greeting: { fontSize: 14, color: "#d1f0c1", marginBottom: 2 },
  username: { fontSize: 16, fontWeight: "600", color: "#fff" },
  email: { fontSize: 12, color: "#d1f0c1", marginTop: 2 },
  badge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#FFC107",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#000" },
  logoutButton: {
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: { marginTop: 10 },
  summaryTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryBox: {
    flex: 1,
    backgroundColor: "#43A047",
    marginHorizontal: 4,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  summaryNumber: { fontSize: 20, fontWeight: "700", color: "#fff" },
  summaryLabel: { fontSize: 12, color: "#d1f0c1", marginTop: 2 },
  shortcutContainer: { marginTop: 20 },
  shortcutRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  shortcutButton: {
    width: "48%",
    backgroundColor: "#2E7D32",
    marginVertical: 6,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  shortcutLabel: { marginTop: 8, fontSize: 14, color: "#fff", fontWeight: "600" },
  alertButton: {
    backgroundColor: "#FFC107",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  alertText: { color: "#000", fontWeight: "700" },
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
