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
// Importamos las constantes del tema para los colores de tipos y estadísticas
import {
  TYPE_COLORS,
  STAT_TRANSLATIONS,
  POKEDEX_RED,
  POKEDEX_DARK,
} from "../constants/theme";

const DetailsScreen = ({ route, navigation }) => {
  // Obtenemos el nombre del pokemon desde los parámetros de navegación
  const { name } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hook para cargar los detalles cuando se entra a la pantalla
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

  // Pantalla de carga mientras esperamos la API
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={POKEDEX_RED} />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );
  }

  // Determinamos el color de fondo basado en el primer tipo del pokemon
  const primaryType = pokemon.types[0].type.name;
  const bgColor = TYPE_COLORS[primaryType] || "#ddd";

  return (
    <ScrollView style={styles.detailsContainer} bounces={false}>
      {/* Cabecera con imagen y nombre */}
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
        
        {/* Etiquetas de tipos */}
        <View style={styles.typeRow}>
          {pokemon.types.map((t) => (
            <View
              key={t.type.name}
              style={[
                styles.typeBadge,
                { backgroundColor: TYPE_COLORS[t.type.name] || "#777" },
              ]}
            >
              <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Sección de información y estadísticas */}
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
        
        <View style={styles.statsContainer}>
          {pokemon.stats.map((s) => (
            <View key={s.stat.name} style={styles.statLine}>
              <Text style={styles.statName}>
                {STAT_TRANSLATIONS[s.stat.name] || s.stat.name}
              </Text>
              
              <View style={styles.statBarBg}>
                <View
                  style={[
                    styles.statBarFill,
                    { 
                      width: `${Math.min(100, (s.base_stat / 150) * 100)}%`,
                      backgroundColor: bgColor // Usamos el color del tipo para la barra
                    },
                  ]}
                />
              </View>
              
              <Text style={styles.statNumber}>{s.base_stat}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailsHeader: {
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  detailImage: {
    width: 220,
    height: 220,
  },
  detailName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  typeRow: {
    flexDirection: "row",
    marginTop: 15,
  },
  typeBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  infoSection: {
    padding: 25,
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
    fontSize: 22,
    fontWeight: "bold",
    color: POKEDEX_DARK,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  statsContainer: {
    marginTop: 5,
  },
  statLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statName: {
    width: 100,
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  statBarBg: {
    flex: 1,
    height: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  statNumber: {
    width: 35,
    fontSize: 14,
    fontWeight: "bold",
    color: POKEDEX_DARK,
    textAlign: "right",
  },
});

export default DetailsScreen;
