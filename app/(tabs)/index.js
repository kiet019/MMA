import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { setDetail } from "../../lib/storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFavorite } from "../../hooks/useFavorite";

export default function HomeScreen() {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const router = useRouter();
  const { addFavorite, removeFavorite, checkFavorite, favoriteList } =
    useFavorite();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log('hello')
      const res = await fetch(
        "https://67d04103825945773eb02e2f.mockapi.io/api/assgnment/art"
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data;
    },
  });
  
  
  if (!products || !favoriteList) {
    return <View></View>;
  }
  
  const brands = ["All", ...new Set(products.map((p) => p.brand))];

  const filteredProducts =
    selectedBrand === "All"
      ? products
      : products.filter((p) => p.brand === selectedBrand);

  const handleViewDetail = async (data) => {
    await setDetail(data);
    router.push(`/detail`);
  };

  const toggleFavorite = (item) => {
    if (checkFavorite(item)) {
      removeFavorite(item);
    } else {
      addFavorite(item);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.filterTitle}>Filter by Brand:</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={brands}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedBrand(item)}
            style={[
              styles.filterButton,
              selectedBrand === item && styles.selectedFilterButton,
            ]}
          >
            <Text style={styles.filterButtonText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={filteredProducts}
        style={{ marginVertical: 20 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleViewDetail(item)}
            style={styles.productCard}
          >
            <Text style={styles.productName}>{item.artName}</Text>
            <Text style={styles.productPrice}>Price: ${item.price}</Text>
            {item.limitedTimeDeal > 0 && (
              <Text style={styles.limitedDeal}>
                Limited Time Deal: $
                {Math.round((1 - item.limitedTimeDeal) * item.price * 100) /
                  100}{" "}
                - {item.limitedTimeDeal * 100}%
              </Text>
            )}
            <TouchableOpacity
              onPress={() => toggleFavorite(item)}
              style={styles.heartIcon}
            >
              <AntDesign
                name="heart"
                size={24}
                color={checkFavorite(item) ? "red" : "gray"}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  filterButton: {
    padding: 8,
    minWidth: 80,
    height: 40,
    marginRight: 10,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  selectedFilterButton: {
    backgroundColor: "blue",
  },
  filterButtonText: {
    color: "white",
    textAlign: "center",
  },
  productCard: {
    flex: 1,
    margin: 8,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    position: "relative",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
  },
  limitedDeal: {
    color: "red",
    fontWeight: "bold",
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
