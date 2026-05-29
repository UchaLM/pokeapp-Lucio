import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  TYPE_COLORS,
  STAT_TRANSLATIONS,
  POKEDEX_RED,
  POKEDEX_DARK,
} from "../constants/theme";

const DetailsScreen = ({ route, navigation }) => {
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default DetailsScreen;
