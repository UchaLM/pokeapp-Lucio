import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
// Importamos los colores del tema
import { POKEDEX_RED, POKEDEX_DARK } from "../constants/theme";

const Home = ({ pokemons, pokemon, getPokemon }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Sección superior: Lista de nombres */}
      <View style={styles.seccionLista}>
        <Text style={styles.titulo}>Lista de Pokémons</Text>
        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Pressable
              style={styles.itemLista}
              onPress={() => getPokemon(item.name)}
            >
              <Text style={styles.nombrePokemon}>{item.name.toUpperCase()}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Sección inferior: Vista previa de detalles */}
      <View style={styles.seccionDetalle}>
        <Text style={styles.tituloSecundario}>Vista Previa</Text>

        {pokemon ? (
          <View style={styles.previewContainer}>
            <Image
              style={styles.imagenPreview}
              source={{
                uri: pokemon?.sprites?.front_default,
              }}
            />
            <Text style={styles.nombreDetalle}>{pokemon.name.toUpperCase()}</Text>

            <Pressable
              style={styles.botonMas}
              onPress={() => {
                navigation.navigate("Detalles", {
                  name: pokemon.name,
                });
              }}
            >
              <Text style={styles.textoBoton}>Ver más detalles</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.vacioContainer}>
            <Text style={styles.textoVacio}>
              Toca un Pokémon de la lista para ver su imagen
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  seccionLista: {
    flex: 0.7,
    backgroundColor: POKEDEX_RED, // Mantenemos el color rojo arriba
    padding: 20,
  },
  seccionDetalle: {
    flex: 0.3,
    backgroundColor: "white", // Cambiamos el azul fuerte por algo más limpio pero manteniendo la separación
    borderTopWidth: 5,
    borderTopColor: POKEDEX_DARK,
    padding: 15,
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  tituloSecundario: {
    fontSize: 18,
    fontWeight: "bold",
    color: POKEDEX_DARK,
    marginBottom: 5,
  },
  itemLista: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  nombrePokemon: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  previewContainer: {
    alignItems: "center",
    width: "100%",
  },
  imagenPreview: {
    width: 100,
    height: 100,
  },
  nombreDetalle: {
    fontSize: 20,
    fontWeight: "bold",
    color: POKEDEX_DARK,
    marginBottom: 5,
  },
  botonMas: {
    backgroundColor: POKEDEX_RED,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
  },
  vacioContainer: {
    flex: 1,
    justifyContent: "center",
  },
  textoVacio: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default Home;

