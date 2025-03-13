import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { setDetail } from "../../lib/storage";
import { useFavorite } from "../../hooks/useFavorite";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function FavoriteScreen() {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const router = useRouter();
  const { addFavorite, removeFavorite, checkFavorite, favoriteList } = useFavorite();

  if (!favoriteList || favoriteList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite items yet.</Text>
      </View>
    );
  }

  const brands = ["All", ...new Set(favoriteList.map((p) => p.brand))];

  const filteredProducts =
    selectedBrand === "All"
      ? favoriteList
      : favoriteList.filter((p) => p.brand === selectedBrand);

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
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columnWrapper}
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
                {Math.round((1 - item.limitedTimeDeal) * item.price * 100) / 100}{" "}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
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
  columnWrapper: {
    justifyContent: "space-between",
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

