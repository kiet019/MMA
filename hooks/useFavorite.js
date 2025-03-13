import { useQuery } from "@tanstack/react-query";
import { getFavorite, setFavorite } from "../lib/storage";

export const useFavorite = () => {
  const { data: favoriteList, refetch } = useQuery({
    queryKey: ["favoriteList"],
    queryFn: async () => {
      let data  = await getFavorite();
      return data || [];
    },
  });

  const checkFavorite = (data) => {
    return (
      Array.isArray(favoriteList) && favoriteList.some((e) => e.id === data.id)
    );
  };

  const addFavorite = async (data) => {
    if (!favoriteList) return;

    if (!checkFavorite(data)) {
      const newFavoriteList = [...favoriteList, data];
      await setFavorite(newFavoriteList);
      await refetch();
    }
  };

  const removeFavorite = async (data) => {
    if (!favoriteList) return;

    const newFavoriteList = favoriteList.filter((e) => e.id !== data.id);
    await setFavorite(newFavoriteList);
    await refetch();
  };

  return {
    checkFavorite,
    favoriteList,
    addFavorite,
    removeFavorite,
  };
};
