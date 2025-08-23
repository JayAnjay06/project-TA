import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface PropsHeader {
  username?: string;
  email?: string;
  greeting?: string;
  onLogout?: () => void;
  logo?: any; // path image
}

export default function Header({ username, email, greeting, onLogout, logo }: PropsHeader) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {logo && <Image source={logo} style={styles.logoImage} />}
        <View style={styles.userInfo}>
          {greeting && <Text style={styles.greeting}>{greeting},</Text>}
          {username && <Text style={styles.username}>{username}</Text>}
          {email && <Text style={styles.email}>{email}</Text>}
        </View>
      </View>

      {onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <FontAwesome5 name="sign-out-alt" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  logoImage: { width: 50, height: 50, resizeMode: "contain", borderRadius: 12, marginRight: 10 },
  userInfo: { marginLeft: 8 },
  greeting: { fontSize: 14, color: "#d1f0c1", marginBottom: 2 },
  username: { fontSize: 16, fontWeight: "600", color: "#fff" },
  email: { fontSize: 12, color: "#d1f0c1", marginTop: 2 },
  logoutButton: {
    padding: 10,
    backgroundColor: "#f44336",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
