import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import UserContext from './UserContext'; // Import UserContext

const ProfileScreen = () => {
  const { userData } = useContext(UserContext); // Use useContext to access userData
  const { username, photoUri, audioID } = userData; // Destructure userData
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false); // State to track if audio is available

  useEffect(() => {
    const loadSound = async () => {
      try {
        if (!audioID) {
          setHasAudio(false);
          return;
        }

        const assetInfo = await MediaLibrary.getAssetInfoAsync(audioID);
        const { sound } = await Audio.Sound.createAsync({ uri: assetInfo.uri }, { shouldPlay: false });
        setSound(sound);
        setHasAudio(true); // Set hasAudio to true when audio is loaded

        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) {
            if (status.didJustFinish && !status.isLooping) {
              stopSound();
            }
          }
        });
      } catch (error) {
        console.error('Error loading sound', error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioID]);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error stopping sound', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.welcomeText}>Bienvenue, {username}!</Text>
      </View>
  
      <View style={styles.imageContainer}>
        <Image 
          source={photoUri ? { uri: photoUri } : require('./img/Default_pfp.jpg')} 
          style={styles.image}
        />
      </View>
      
      {hasAudio ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isPlaying ? '#d9534f' : '#5cb85c' }]}
            onPress={isPlaying ? stopSound : playSound}
          >
            <Text style={styles.buttonText}>
              {isPlaying ? 'Arrêter Audio' : 'Lire Audio'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noAudioContainer}>
          <Text style={styles.noAudioText}>Aucun audio enregistré.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 5,
    borderColor: '#d32f2f',
  },
  noAudioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noAudioText: {
    fontSize: 20,
    color: '#555',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
