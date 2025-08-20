import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface PropsHeader {
  username?: string;
  email?: string;
  onLogout?: () => void;
}

export default function Header({ username, email, onLogout }: PropsHeader) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.logo}>🌱</Text>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username || "User"}</Text>
          <Text style={styles.email}>{email || "email@example.com"}</Text>
        </View>
      </View>

      {/* Logout di kanan */}
      {onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <FontAwesome5 name="sign-out-alt" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#2e7d32",
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
  },
  userInfo: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  email: {
    fontSize: 12,
    color: "#d1f0c1",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#f44336",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
