// En el mismo archivo Original.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

// Configuración puzzle
const gridSize = 3;
const pieceSize = 70;

// Puzzle tipo slide con espacio vacío (la última pieza en blanco)
function SlidePuzzle({ image }) {
  // Inicializamos el tablero con números del 0 al 8, donde 8 será el espacio vacío
  const initial = [...Array(gridSize * gridSize).keys()];
  const [tiles, setTiles] = useState(shuffle(initial));
  // Guardamos el índice del espacio vacío
  const emptyIndex = tiles.indexOf(gridSize * gridSize - 1);

  // Mezclar tablero aleatoriamente
  function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Intentar mover una ficha al tocarla (solo si está adyacente al espacio vacío)
  const handlePress = (idx) => {
    const emptyIdx = tiles.indexOf(gridSize * gridSize - 1);
    // Obtener coordenadas fila/columna
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    const emptyRow = Math.floor(emptyIdx / gridSize);
    const emptyCol = emptyIdx % gridSize;

    // Revisar si son adyacentes
    if (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    ) {
      const newTiles = [...tiles];
      [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
      setTiles(newTiles);
    }
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: pieceSize * gridSize, height: pieceSize * gridSize }}>
      {tiles.map((val, idx) => {
        if (val === gridSize * gridSize - 1) {
          // Espacio vacío con fondo distinto
          return (
            <View
              key={idx}
              style={{
                width: pieceSize,
                height: pieceSize,
                borderWidth: 1,
                borderColor: "#E60023",
                backgroundColor: "#eee",
              }}
            />
          );
        }
        const row = Math.floor(val / gridSize);
        const col = val % gridSize;
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => handlePress(idx)}
            style={{ width: pieceSize, height: pieceSize, borderWidth: 1, borderColor: '#E60023', overflow: "hidden" }}
          >
            <Image
              source={{ uri: image }}
              style={{
                width: pieceSize * gridSize,
                height: pieceSize * gridSize,
                position: "absolute",
                left: -col * pieceSize,
                top: -row * pieceSize
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Original.js
export default function Original({ route }) {
  const card = route?.params?.card;
  const [uid, setUid] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid);
      if (card) {
        verificarFavorito(user.uid, card.id);
      }
    }
  }, [card]);

  const verificarFavorito = async (userId, cardId) => {
    try {
      const ref = doc(db, "usuarios", userId, "favoritos", String(cardId));
      const snap = await getDoc(ref);
      setEsFavorito(snap.exists());
    } catch (e) { console.log("Error verificando favorito", e); }
  };

  const guardarFavorito = async () => {
    if (!uid || !card) {
      Alert.alert("Error", "No hay usuario o carta seleccionada");
      return;
    }
    setGuardando(true);
    try {
      const ref = doc(db, "usuarios", uid, "favoritos", String(card.id));
      await setDoc(ref, {
        cardId: card.id,
        name: card.name,
        type: card.type,
        race: card.race,
        atk: card.atk ?? null,
        def: card.def ?? null,
        level: card.level ?? null,
        image: card.card_images?.[0]?.image_url || null,
        savedAt: new Date().toISOString(),
      });
      setEsFavorito(true);
      Alert.alert("Listo", "Carta agregada a favoritos");
    } catch (e) { Alert.alert("Error", "No se pudo guardar el favorito"); }
    finally { setGuardando(false); }
  };

  const quitarFavorito = async () => {
    if (!uid || !card) return;
    setGuardando(true);
    try {
      const ref = doc(db, "usuarios", uid, "favoritos", String(card.id));
      await deleteDoc(ref);
      setEsFavorito(false);
      Alert.alert("Listo", "Favorito eliminado");
    } catch (e) { Alert.alert("Error", "No se pudo eliminar el favorito"); }
    finally { setGuardando(false); }
  };

  if (!card) {
    return (
      <View style={styles.center}>
        <Text>No se recibió ninguna carta. Ábrela desde Home.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{card.name}</Text>
      <Image source={{ uri: card.card_images[0].image_url }} style={styles.image} />
      <Text style={styles.text}>Tipo: {card.type}</Text>
      <Text style={styles.text}>Atributo: {card.attribute ?? "N/A"}</Text>
      <Text style={styles.text}>ATK: {card.atk ?? "N/A"} | DEF: {card.def ?? "N/A"}</Text>
      <Text style={styles.text}>Nivel: {card.level ?? "N/A"}</Text>
      <Text style={styles.desc}>{card.desc}</Text>

      {guardando ? (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      ) : esFavorito ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: "#777" }]} onPress={quitarFavorito}>
          <Text style={styles.buttonText}>Quitar de favoritos</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={guardarFavorito}>
          <Text style={styles.buttonText}>Agregar a favoritos</Text>
        </TouchableOpacity>
      )}

      <Text style={{ fontSize: 18, marginVertical: 22, fontWeight: "bold", color: "#E60023" }}>Rompecabezas tipo slide</Text>
      <SlidePuzzle image={card.card_images[0].image_url} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  container: { padding: 16, alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center", color: "#E60023" },
  image: { width: 200, height: 300, borderRadius: 8, marginBottom: 12 },
  text: { fontSize: 14, marginBottom: 4, textAlign: "center" },
  desc: { marginTop: 10, fontSize: 13, textAlign: "justify" },
  button: { backgroundColor: "#E60023", padding: 12, borderRadius: 10, alignItems: "center", marginVertical: 12 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
