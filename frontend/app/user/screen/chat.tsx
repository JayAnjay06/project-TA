import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatbotScreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("auth_token"); // jika endpoint perlu auth
      const res = await fetch("http://10.220.239.63:8000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data.success) {
        setChat((prev) => [...prev, { question: data.question, answer: data.answer }]);
        setMessage("");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.log(err);
      alert("Tidak bisa konek ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {chat.map((item, index) => (
          <View key={index} style={styles.chatItem}>
            <Text style={styles.question}>User: {item.question}</Text>
            <Text style={styles.answer}>Bot: {item.answer}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title={loading ? "..." : "Kirim"} onPress={handleSend} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f9f9f9" },
  chatContainer: { flex: 1, marginBottom: 10 },
  chatItem: { marginBottom: 12, padding: 8, backgroundColor: "#fff", borderRadius: 8 },
  question: { fontWeight: "bold", color: "#2e7d32" },
  answer: { marginTop: 4, color: "#555" },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, marginRight: 8 },
});
