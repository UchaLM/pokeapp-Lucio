import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/screens/HomeScreen";
import DetailsScreen from "./src/screens/DetailsScreen";

const Stack = createNativeStackNavigator();

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
            component={DetailsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
