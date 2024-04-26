import React, { useEffect, useState, useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import CameraScreen from "./CameraScreen";
import AudioScreen from "./AudioScreen";
import UserContext from './UserContext';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { userData, setUserData } = useContext(UserContext);
  return (
    <NavigationContainer>
      {userData.username !== '' ? (
        <Tab.Navigator>
          <Tab.Screen name={`Accueil - ${userData.username}`} component={HomeScreen} />
          <Tab.Screen name={`Profil - ${userData.username}`} component={ProfileScreen} />
          <Tab.Screen name={`Caméra - ${userData.username}`} component={CameraScreen} />
          <Tab.Screen name={`Audio - ${userData.username}`} component={AudioScreen} />
        </Tab.Navigator>
      ) : (
        <HomeScreen />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
