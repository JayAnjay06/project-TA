import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { API_URL } from "./api";

export function useAuth() {
  const [profile, setProfile] = useState<any>(null);

  const getToken = async () => await AsyncStorage.getItem("auth_token");

  const fetchProfile = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (err) {
      console.log("Error fetch profile:", err);
    }
  };

  const logout = async (router: any) => {
    await AsyncStorage.removeItem("auth_token");
    router.replace("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, logout, getToken };
}

export function useSummary() {
  const [summary, setSummary] = useState({
    lokasi: 0,
    jenis: 0,
    data: 0,
    laporan: 0,
  });
  const [lokasiMangrove, setLokasiMangrove] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async (getToken: () => Promise<string | null>) => {
    try {
      const token = await getToken();
      const endpoints = [
        { key: "lokasi", url: `${API_URL}/lokasis` },
        { key: "jenis", url: `${API_URL}/jenis` },
        { key: "data", url: `${API_URL}/data` },
        { key: "laporan", url: `${API_URL}/laporan` },
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

  return { summary, lokasiMangrove, loading, fetchSummary };
}

export function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  return { currentLocation, fetchCurrentLocation };
}
