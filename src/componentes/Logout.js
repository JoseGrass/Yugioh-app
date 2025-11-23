import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

export default function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente");
    } catch (error) {
      Alert.alert("Error al cerrar sesión", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¿Deseas cerrar sesión?</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { marginBottom: 18, fontSize: 20, color: "#E60023", fontWeight: "bold" },
  button: {
    backgroundColor: "#E60023",
    padding: 14,
    borderRadius: 12,
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
