import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from './app/products/ProductList';
import ProductCreate from './app/products/ProductCreate';
import ProductEdit from './app/products/ProductEdit';
import ProductDetails from './app/products/ProductDetails';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductList">
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="ProductCreate" component={ProductCreate} />
        <Stack.Screen name="ProductEdit" component={ProductEdit} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
