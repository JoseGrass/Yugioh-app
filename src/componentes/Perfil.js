import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';

export default function Perfil() {
  const [usuarioDoc, setUsuarioDoc] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);

  // Campos editables
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState(""); // generalmente no editable pero lo incluyo por tu pedido
  const [fecha, setFecha] = useState("");
  const [telefono, setTelefono] = useState("");

  // Cargar datos y favoritos
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUsuarioDoc(data);
        setNombre(data.nombre || "");
        setCorreo(data.correo || "");
        setFecha(data.fecha || "");
        setTelefono(data.telefono || "");
      }

      const favCol = collection(db, "usuarios", user.uid, "favoritos");
      const favSnap = await getDocs(favCol);
      const lista = [];
      favSnap.forEach((d) => lista.push({ id: d.id, ...d.data() }));
      setFavoritos(lista);
    } catch (e) {
      console.log("Error cargando perfil", e);
    } finally {
      setCargando(false);
    }
  };

  // Recargar datos cada vez que esta pantalla toma el foco
  useFocusEffect(
    React.useCallback(() => {
      cargarDatos();
    }, [])
  );

  const handleGuardarCambios = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, { nombre, correo, fecha, telefono });
      setEditando(false);
      Alert.alert("Perfil actualizado");
      cargarDatos();
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (!usuarioDoc) {
    return (
      <View style={styles.center}>
        <Text>No se encontraron datos de usuario.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>

      {editando ? (
        <>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            placeholder="Correo"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={fecha}
            onChangeText={setFecha}
            placeholder="Fecha de nacimiento"
          />
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.button} onPress={handleGuardarCambios}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditando(false)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>Nombre: {nombre}</Text>
          <Text>Correo: {correo}</Text>
          <Text>Fecha: {fecha}</Text>
          <Text>Teléfono: {telefono}</Text>
          <Text>Ganados: {usuarioDoc.ganados}</Text>
          <Text>Perdidos: {usuarioDoc.perdidos}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
            <Text style={styles.buttonText}>Editar perfil</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={[styles.titulo, { marginTop: 20 }]}>Favoritos</Text>
      {favoritos.length === 0 ? (
        <Text>No tienes cartas favoritas guardadas.</Text>
      ) : (
        favoritos.map((fav) => (
          <View key={fav.cardId} style={styles.cardItem}>
            {fav.image && (
              <Image source={{ uri: fav.image }} style={styles.cardImage} />
            )}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: "bold", color: "#E60023" }}>{fav.name}</Text>
              <Text>{fav.type}</Text>
              <Text>
                ATK: {fav.atk ?? "N/A"} | DEF: {fav.def ?? "N/A"}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16, backgroundColor: "#fff" },
  titulo: { fontSize: 25, fontWeight: "bold", marginBottom: 13, color: "#E60023" },
  input: {
    borderWidth: 1,
    borderColor: "#E60023",
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#E60023",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 17 },
  cancelButton: {
    backgroundColor: "#aaa",
    padding: 10,
    borderRadius: 9,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButtonText: { color: "#fff", fontWeight: "bold" },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    shadowColor: "#E60023",
    shadowOpacity: 0.1,
    shadowRadius: 7,
    marginBottom: 13,
  },
  cardImage: { width: 80, height: 120, borderRadius: 7 },
});
