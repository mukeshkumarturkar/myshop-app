import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import linking from '../config/linking';

// ...existing imports...
// Screens
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import HomePage from '../screens/HomePage';
import ManageShopScreen from '../screens/ManageShopScreen';
import CatalogListScreen from '../screens/CatalogListScreen';
import CatalogDetailScreen from '../screens/CatalogDetailScreen';
import EditShopScreen from '../screens/EditShopScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const CatalogStack = createNativeStackNavigator();
const ShopStack = createNativeStackNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="Home" component={HomePage} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// Catalog Stack
const CatalogStackNavigator = () => (
  <CatalogStack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <CatalogStack.Screen name="CatalogListScreen" component={CatalogListScreen} />
    <CatalogStack.Screen name="CatalogDetail" component={CatalogDetailScreen} />
    <CatalogStack.Screen name="AddCatalog" component={CatalogDetailScreen} />
  </CatalogStack.Navigator>
);

// Shop Stack
const ShopStackNavigator = () => (
  <ShopStack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <ShopStack.Screen name="ManageShopScreen" component={ManageShopScreen} />
    <ShopStack.Screen name="EditShop" component={EditShopScreen} />
    <ShopStack.Screen name="CatalogList" component={CatalogStackNavigator} />
  </ShopStack.Navigator>
);

// Main App Stack with Bottom Tabs
const MainApp = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#6C63FF',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: 5,
        paddingTop: 5,
      },
    }}
  >
    <Tab.Screen
      name="Shop"
      component={ShopStackNavigator}
      options={{
        tabBarLabel: 'My Shop',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="store" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Catalog"
      component={CatalogStackNavigator}
      options={{
        tabBarLabel: 'Catalog',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="list" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);

  console.log('RootNavigator rendering, isSignedIn:', isSignedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isSignedIn ? 'MainApp' : 'Auth'}
      >
        {isSignedIn ? (
          <Stack.Screen
            name="MainApp"
            component={MainApp}
            options={{
              animationEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{
              animationEnabled: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
