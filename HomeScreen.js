import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import { Audio } from 'expo-av';
// import { Camera } from "expo-camera";
import UserContext from './UserContext';

const HomeScreen = ({ navigation, route }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { userData, setUserData } = useContext(UserContext);
    // const [permissionAudioResponse, requestPermissionAudio] = Audio.usePermissions();
    // const [permissionPhoto, requestPermissionPhoto] = Camera.useCameraPermissions();
    const users = {
        'LinaJ': 'password1',
        'XavierT': 'password2',
        'admin': 'admin',
    };
    
    // const handleRequestPermission = async () => {
    //     const { statusPhoto} = await requestPermissionPhoto();
    //     if (statusPhoto !== 'granted') {
    //       Alert.alert('Permission de la caméra requise', 'Il faut votre permission afin d\'utiliser la caméra pour votre photo de profil.');
    //     }
    //     const { statusAudio } = await requestPermissionAudio();
    //     if (statusAudio !== 'granted') {
    //       Alert.alert('Permission du microhpone requise', 'Il faut votre permission afin d\'utiliser le microphone pour votre audio.');
    //     }
    // };

    useEffect(() => {
        setUserData(userData);
    }, [userData]);

    const handleLogin = () => {
        const userPassword = users[username];
        if (userPassword && password === userPassword) {            
            setUserData(prevUserData => ({
                ...prevUserData,
                username: username,
            }));
            // handleRequestPermission();
        } else {
            alert('Nom d\'utilisateur ou mot de passe incorrect');
        }
    };

    const handleLogout = () => {
        setUserData({ username: '' });
        setUsername('');
        setPassword('');
    };

    if (userData.username == '') {
        return (
            <View style={styles.container}>
                <Image 
                    source={require('./img/CollegeLionelGroulx.jpg')}
                    style={styles.logo}
                />
                <Text style={styles.title}>GroulxMobile</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                >
                    <Text style={{color: '#fff'}}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image 
                source={require('./img/CollegeLionelGroulx.jpg')}
                style={styles.logo}
            />
            <Text style={styles.title}>GroulixMobile</Text>

            <Text style={styles.welcomeText}>Bienvenue, {userData.username}!</Text>
            <Text style={styles.teamText}>Projet réalisé par</Text>
            <Text style={styles.teamMember}>Xavier Tassy</Text>

            <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
            >
                <Text style={{ color: '#d32f2f' }}>Déconnexion</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#d32f2f',
    },
    welcomeText: {
        fontSize: 22,
        marginBottom: 15,
        color: '#d32f2f',
    },
    teamText: {
        fontSize: 20,
        marginBottom: 15,
        color: '#555',
    },
    teamMember: {
        fontSize: 18,
        color: '#333',
        marginBottom : 15
    },
    input: {
        width: '100%',
        height: 50,
        paddingHorizontal: 15,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#d32f2f',
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 18,
        color: '#333',
    },
    button: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#d32f2f',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;
