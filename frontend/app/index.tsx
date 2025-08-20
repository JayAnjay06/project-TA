import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const role = await AsyncStorage.getItem("role");

        if (!token || !role) {
          router.replace("/login");
        } else {
          if (role === "admin") router.replace("/admin");
          else router.replace("/user");
        }
      } catch {
        router.replace("/login");
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
