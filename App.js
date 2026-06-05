import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importamos nuestras pantallas
import Home from "./src/screens/HomeScreen";
import DetailsScreen from "./src/screens/DetailsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemon, setPokemon] = useState(null);

  // Cargamos la lista inicial de pokemons
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

  // Función para obtener los datos de un pokemon específico
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
            headerShown: false, // Ocultamos el header por defecto para usar los nuestros
          }}
        >
          {/* Pantalla Principal */}
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

          {/* Pantalla de Detalles */}
          <Stack.Screen
            name="Detalles"
            component={DetailsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

