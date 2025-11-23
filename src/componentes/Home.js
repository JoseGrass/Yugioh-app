import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const obtenerCartas = async () => {
    try {
      const res = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
      const json = await res.json();
      setCards(json.data.slice(0, 50)); 
    } catch (e) {
      console.log("Error al obtener cartas", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCartas();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando cartas...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.lista}>
      {cards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={styles.item}
          onPress={() => navigation.navigate("Original", { card })}
        >
          <Image
            source={{ uri: card.card_images[0].image_url }}
            style={styles.imagen}
          />
          <Text style={styles.nombre}>{card.name}</Text>
          <Text style={styles.tipo}>{card.type}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  lista: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  item: {
    backgroundColor: "#fff",
    width: "47%",
    padding: 10,
    marginBottom: 14,
    borderRadius: 18,
    shadowColor: "#E60023",
    shadowOpacity: 0.15,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 8,
    elevation: 7,
    alignItems: "center",
  },
  imagen: { width: 120, height: 180, borderRadius: 12 },
  nombre: { marginTop: 10, fontWeight: "bold", fontSize: 15, textAlign: "center", color: "#E60023" },
  tipo: { fontSize: 12, color: "#555", textAlign: "center" },
});
