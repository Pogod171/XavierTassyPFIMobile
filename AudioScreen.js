import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';
import UserContext from './UserContext'; // Import UserContext

const AudioScreen = () => {
  const { userData, setUserData } = useContext(UserContext);
  const { audioUri } = userData;
  const [recording, setRecording] = useState();
  const [audioPath, setAudioPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const navigation = useNavigation(); 
  const [buttonText, setButtonText] = useState('Enregistrer');

  const handleRequestPermission = async () => {
    const { status } = await requestPermission();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Audio recording permission is required to use this feature.');
    }
  };

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        await handleRequestPermission();
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setButtonText('Arrêter');
    } catch (err) {
      console.error('Échec de démarrage de l\'enregistrement', err);
      alert('Échec de démarrage de l\'enregistrement');
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }
    
    setLoading(true);
    
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
  
      const asset = await MediaLibrary.createAssetAsync(recording.getURI());
      setAudioPath(asset.uri);
      setUserData(prevData => ({ ...prevData, audioUri: asset.uri, audioID: asset.id }));
      setRecording(null);
      setAudioPath('');
      setButtonText('Enregistrer');
    } catch (err) {
      console.error('Échec d\'arrêt de l\'enregistrement', err);
      alert('Échec d\'arrêt de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enregistrement d'audio</Text>
      <Text style={styles.subtitle}>
        Appuyez sur "Enregistrer" pour commencer l'enregistrement.
        Appuyez sur "Arrêter" pour terminer et sauvegarder l'enregistrement.
      </Text>
      <Text style={styles.audioPath}>Chemin du fichier audio : {audioUri ? audioUri : 'Aucun fichier enregistré'}</Text>
      <Button
        title={buttonText}
        onPress={recording ? stopRecording : startRecording}
        disabled={loading}
        color="#d32f2f" // Button color
      />
      {loading && <ActivityIndicator size="large" color="#d32f2f" style={styles.loader} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d32f2f', // Red color
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  audioPath: {
    marginBottom: 30,
    fontSize: 16,
    color: '#777',
  },
  loader: {
    marginTop: 30,
  },
});

export default AudioScreen;
