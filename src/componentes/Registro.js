import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [fecha, setFecha] = useState("");
  const [telefono, setTelefono] = useState("");
  const navigation = useNavigation();

  let ganados = 0;
  let perdidos = 0;

  const handleRegistro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo,
        contrasena
      );
      const user = userCredential.user;
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        ganados,
        perdidos,
      });
      Alert.alert("Éxito", "Usuario registrado correctamente");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error al registrarse", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro</Text>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha de nacimiento"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegistro}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.enlace}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 28, marginBottom: 22, textAlign: "center", color: "#E60023" },
  input: {
    borderWidth: 1, borderColor: "#E60023", padding: 12,
    marginBottom: 18, borderRadius: 12, backgroundColor: "#fafafa"
  },
  button: {
    backgroundColor: "#E60023",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 12,
    shadowOpacity: 0.35,
    shadowRadius: 8
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  enlace: { color: "#E60023", textAlign: "center", marginTop: 16 },
});
