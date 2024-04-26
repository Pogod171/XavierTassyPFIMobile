import React from 'react';
import { StyleSheet } from 'react-native';
import AppNavigator from './AppNavigator';
import UserContext from './UserContext';


export default function App() {
  const [userData, setUserData] = React.useState({
    username: '',
    photoUri: '',
    audioUri: '',
    audioID: ''
  });
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <AppNavigator />
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
