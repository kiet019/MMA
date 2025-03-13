import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getDetail } from "../../lib/storage";
import { useQuery } from "@tanstack/react-query";
import { useFavorite } from "../../hooks/useFavorite";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const ProductDetailScreen = () => {
  const { data: product } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const data = await getDetail();
      return data;
    },
  });

  const { addFavorite, removeFavorite, checkFavorite } = useFavorite();
  const router = useRouter();

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading product details...</Text>
      </View>
    );
  }

  const toggleFavorite = () => {
    if (checkFavorite(product)) {
      removeFavorite(product);
    } else {
      addFavorite(product);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hình ảnh sản phẩm */}
      <Image source={{ uri: product.image }} style={styles.productImage} />

      {/* Nút thích/bỏ thích */}
      <TouchableOpacity onPress={toggleFavorite} style={styles.heartIcon}>
        <AntDesign
          name="heart"
          size={28}
          color={checkFavorite(product) ? "red" : "gray"}
        />
      </TouchableOpacity>

      {/* Thông tin sản phẩm */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.artName}</Text>
        <Text style={styles.brand}>Brand: {product.brand}</Text>

        {/* Giá sản phẩm */}
        <Text style={styles.price}>Price: ${product.price}</Text>
        {product.limitedTimeDeal > 0 && (
          <Text style={styles.limitedDeal}>
            Limited Time Deal: $
            {Math.round((1 - product.limitedTimeDeal) * product.price * 100) /
              100}{" "}
            - {product.limitedTimeDeal * 100}%
          </Text>
        )}

        {/* Mô tả sản phẩm */}
        <Text style={styles.description}>{product.description}</Text>

        {/* Sử dụng trên kính */}
        <Text style={styles.glassSurface}>
          Can be used on glass: {product.glassSurface ? "✅ Yes" : "❌ No"}
        </Text>
      </View>

      {/* Nút chuyển sang danh sách yêu thích */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => router.push("/(tabs)/favorite")}
      >
        <Text style={styles.favoriteButtonText}>Go to Favorites</Text>
      </TouchableOpacity>

      {/* Phản hồi từ khách hàng */}
      <Text style={styles.feedbackTitle}>Customer Reviews:</Text>
      <FlatList
        scrollEnabled={false}
        data={product.feedbacks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.feedbackItem}>
            <Text style={styles.feedbackAuthor}>{item.author}</Text>
            <Text style={styles.feedbackRating}>⭐ {item.rating}/5</Text>
            <Text style={styles.feedbackComment}>{item.comment}</Text>
            <Text style={styles.feedbackDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
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
  productImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginBottom: 16,
  },
  productInfo: {
    paddingHorizontal: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  limitedDeal: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
    color: "#555",
  },
  glassSurface: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0066cc",
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  feedbackItem: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  feedbackAuthor: {
    fontWeight: "bold",
  },
  feedbackRating: {
    color: "orange",
    fontWeight: "bold",
  },
  feedbackComment: {
    fontSize: 14,
    marginTop: 4,
  },
  feedbackDate: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    elevation: 3, // Hiệu ứng nổi trên Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favoriteButton: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  favoriteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
