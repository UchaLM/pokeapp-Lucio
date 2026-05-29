import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const POKEDEX_RED = "#ef5350";
const POKEDEX_DARK = "#2c3e50";

const TYPE_COLORS = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

const STAT_TRANSLATIONS = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "At. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidad",
};

const Home = ({ pokemons, pokemon, getPokemon }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.arriba}>
        <Text>Lista de pokemons</Text>

        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                getPokemon(item.name);
              }}
            >
              <Text>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>

      <View style={styles.abajo}>
        <Text>Detalles del pokemon</Text>

        {pokemon ? (
          <View>
            <Image
              style={{ width: 150, height: 150 }}
              source={{
                uri: pokemon?.sprites?.front_default,
              }}
            />

            <Text>{pokemon.name}</Text>

            <Pressable
              onPress={() => {
                navigation.navigate("Detalles", {
                  name: pokemon.name,
                });
              }}
            >
              <Text>Ver mas detalles</Text>
            </Pressable>
          </View>
        ) : (
          <Text>
            Selecciona un pokemon para ver sus detalles
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const Detalles = ({ route, navigation }) => {
  const { name } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.error("Error al obtener detalles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [name]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={POKEDEX_RED} />
      </View>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const bgColor = TYPE_COLORS[primaryType] || "#ddd";

  return (
    <ScrollView style={styles.detailsContainer} bounces={false}>
      <View style={[styles.detailsHeader, { backgroundColor: bgColor }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← VOLVER</Text>
        </Pressable>
        <Image
          source={{ uri: pokemon.sprites.other["official-artwork"].front_default }}
          style={styles.detailImage}
        />
        <Text style={styles.detailName}>{pokemon.name.toUpperCase()}</Text>
        <View style={styles.typeRow}>
          {pokemon.types.map((t) => (
            <View
              key={t.type.name}
              style={[
                styles.typeBadge,
                { backgroundColor: TYPE_COLORS[t.type.name] },
              ]}
            >
              <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Peso</Text>
            <Text style={styles.statValue}>{pokemon.weight / 10} kg</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Altura</Text>
            <Text style={styles.statValue}>{pokemon.height / 10} m</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estadísticas Base</Text>
        {pokemon.stats.map((s) => (
          <View key={s.stat.name} style={styles.statLine}>
            <Text style={styles.statName}>
              {STAT_TRANSLATIONS[s.stat.name] || s.stat.name}
            </Text>
            <View style={styles.statBarBg}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${Math.min(100, (s.base_stat / 150) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.statNumber}>{s.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const getPokemons = async () => {
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );

        const data = await res.json();

        setPokemons(data.results);
      } catch (error) {
        console.error("error en funcion getPokemons", error);
      }
    };

    getPokemons();
  }, []);

  const getPokemon = async (nombre) => {
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nombre}`
      );

      const data = await res.json();

      setPokemon(data);
    } catch (error) {
      console.error("error en funcion getPokemon", error);
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <Home
                {...props}
                pokemons={pokemons}
                pokemon={pokemon}
                getPokemon={getPokemon}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="Detalles"
            component={Detalles}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  arriba: {
    flex: 0.7,
    backgroundColor: "red",
  },
  abajo: {
    flex: 0.3,
    backgroundColor: "blue",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailsHeader: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  detailImage: {
    width: 250,
    height: 250,
  },
  detailName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  typeRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  typeBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoSection: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: POKEDEX_DARK,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: POKEDEX_DARK,
    marginBottom: 15,
  },
  statLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statName: {
    width: 90,
    fontSize: 12,
    color: "#666",
  },
  statBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    backgroundColor: POKEDEX_RED,
    borderRadius: 5,
  },
  statNumber: {
    width: 35,
    fontSize: 12,
    fontWeight: "bold",
    color: POKEDEX_DARK,
    textAlign: "right",
  },
});
