import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';


import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

import Login from "./src/componentes/Login";
import Registro from "./src/componentes/Registro";
import Home from "./src/componentes/Home";
import Original from "./src/componentes/Original";
import Perfil from "./src/componentes/Perfil";
import Logout from "./src/componentes/Logout";

const Tab = createBottomTabNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            if (route.name === 'Original') iconName = focused ? 'grid' : 'grid-outline';
            if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
            if (route.name === 'Logout') iconName = focused ? 'exit' : 'exit-outline';
            if (route.name === 'Login') iconName = focused ? 'log-in' : 'log-in-outline';
            if (route.name === 'Registro') iconName = focused ? 'person-add' : 'person-add-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#E60023',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        {usuario ? (
          <>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Original" component={Original} />
            <Tab.Screen name="Perfil" component={Perfil} />
            <Tab.Screen name="Logout" component={Logout} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Registro" component={Registro} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
