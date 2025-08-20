import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import Header from "@/components/header";
import { FontAwesome5 } from "@expo/vector-icons";
import SectionRingkasan from "@/components/sectionRingkasan";
import Maps from "@/components/maps";
import { useRouter } from "expo-router";
import Menu, { NavButton } from "@/components/menu";

export default function AdminHome() {
  const router = useRouter();
  const [summary, setSummary] = useState({ lokasi: 0, jenis: 0, data: 0, laporan: 0 });
  const [lokasiMangrove, setLokasiMangrove] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    router.replace("/login");
  };

  const getToken = async () => await AsyncStorage.getItem("auth_token");

  const fetchProfile = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await fetch("http://10.220.239.63:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (err) {
      console.log("Error fetch profile:", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = await getToken();
      const endpoints = [
        { key: "lokasi", url: "http://10.220.239.63:8000/api/lokasis" },
        { key: "jenis", url: "http://10.220.239.63:8000/api/jenis" },
        { key: "data", url: "http://10.220.239.63:8000/api/data" },
        { key: "laporan", url: "http://10.220.239.63:8000/api/laporan" },
      ];

      const newSummary: any = {};
      for (let ep of endpoints) {
        const res = await fetch(ep.url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        newSummary[ep.key] = Array.isArray(data) ? data.length : 0;
        if (ep.key === "lokasi") setLokasiMangrove(data);
      }
      setSummary(newSummary);
    } catch (err) {
      console.log("Error fetch summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  };

  useEffect(() => {
    fetchProfile();
    fetchSummary();
    fetchCurrentLocation();
  }, []);

  const navButtons: NavButton[] = [
    { label: "Lokasi", route: "/user/screen/lokasi", icon: "map-marker-alt" },
    { label: "Jenis", route: "/user/screen/jenis", icon: "seedling" },
    { label: "Data", route: "/user/screen/data", icon: "database" },
    { label: "Monitoring", route: "/user/screen/monitoring", icon: "tachometer-alt" },
    { label: "Peringatan", route: "/user/screen/peringatan", icon: "exclamation-triangle" },
    { label: "Edukasi", route: "/user/screen/edukasi", icon: "book" },
    { label: "Laporan", route: "/user/screen/laporan", icon: "file-alt" },
  ] as const;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      
      {/* header */}
      <Header username={profile?.username} email={profile?.email} onLogout={logout} />

      {/* ringkasan */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Maps currentLocation={currentLocation} lokasiMangrove={lokasiMangrove} />
        <SectionRingkasan summary={summary} loading={loading} />
      </ScrollView>

      {/* menu */}
      <TouchableOpacity
        style={styles.openMenuButton}
        onPress={() => setMenuVisible(true)}
      >
        <FontAwesome5 name="bars" size={20} color="#fff" />
      </TouchableOpacity>

      <Menu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navButtons={navButtons}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f9f9f9" },
  openMenuButton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
