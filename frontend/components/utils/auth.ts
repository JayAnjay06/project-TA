import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAuth = async (token: string, role: string) => {
  try {
    await AsyncStorage.setItem("@token", token);
    await AsyncStorage.setItem("@role", role);
  } catch (e) {
    console.log("Error saving auth", e);
  }
};

export const getAuth = async () => {
  try {
    const token = await AsyncStorage.getItem("@token");
    const role = await AsyncStorage.getItem("@role");
    return { token, role };
  } catch (e) {
    console.log("Error getting auth", e);
    return { token: null, role: null };
  }
};

export const clearAuth = async () => {
  try {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@role");
  } catch (e) {
    console.log("Error clearing auth", e);
  }
};
