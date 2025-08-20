import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await AsyncStorage.getItem("auth_token");
      setToken(t);
    };
    fetchToken();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
