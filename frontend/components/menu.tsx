import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export interface NavButton {
  label: string;
  route: string;
  icon: string;
}

interface PropsMenu {
  visible: boolean;
  onClose: () => void;
  navButtons: NavButton[];
}

export default function Menu({ visible, onClose, navButtons }: PropsMenu) {
  const router = useRouter();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Menu Navigasi</Text>
          <ScrollView>
            {navButtons.map((btn, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.navButtonMinimal}
                onPress={() => {
                  onClose();
                  router.push(btn.route as any);
                }}
              >
                <FontAwesome5 name={btn.icon as any} size={16} color="#2E7D32" />
                <Text style={styles.navButtonTextMinimal}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButtonMinimal} onPress={onClose}>
            <Text style={styles.closeTextMinimal}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#333" },
  navButtonMinimal: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
  },
  navButtonTextMinimal: { fontSize: 15, marginLeft: 12, color: "#333" },
  closeButtonMinimal: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },
  closeTextMinimal: { color: "#333", fontWeight: "600" },
});
