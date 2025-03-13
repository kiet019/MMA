import AsyncStorage from "@react-native-async-storage/async-storage";

export const DETAIL = "detail";
export const FAVORITE = "favorite";
export const setDetail = async (data) => {
  const stringData = JSON.stringify(data);
  return await AsyncStorage.setItem(DETAIL, stringData);
};
export const getDetail = async () => {
  const data = await AsyncStorage.getItem(DETAIL);
  return JSON.parse(data);
};

export const getFavorite = async () => {
  const data = await AsyncStorage.getItem(FAVORITE);
  if (!data){
    return []
  }
  return JSON.parse(data);
};
export const setFavorite = async (data) => {
  const stringData = JSON.stringify(data);
  return await AsyncStorage.setItem(FAVORITE, stringData);
};
