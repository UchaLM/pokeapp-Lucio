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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arriba: {
    flex: 0.7,
    backgroundColor: "red",
  },
  abajo: {
    flex: 0.3,
    backgroundColor: "blue",
  },
});

export default Home;
