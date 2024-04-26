import React, { useState, useRef, useEffect, useContext } from "react";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native'; 
import * as MediaLibrary from 'expo-media-library';
import UserContext from './UserContext'; // Import UserContext

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flash, setFlash] = useState(FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const navigation = useNavigation(); 
  const [isPreviewPaused, setIsPreviewPaused] = useState(false);
  const { userData, setUserData } = useContext(UserContext); // Use useContext to access userData

  useEffect(() => {
    // Pause the camera preview when navigating away
    const unsubscribe = navigation.addListener('blur', () => {
      if (cameraRef.current) {
        cameraRef.current.pausePreview();
        setIsPreviewPaused(true);
      }
    });

    // Resume the camera preview when navigating back
    return () => {
      unsubscribe();
      if (cameraRef.current) {
        cameraRef.current.resumePreview();
        setIsPreviewPaused(false);
      }
    };
  }, [navigation]);

  // const toggleCameraPreview = () => {
  //   if (cameraRef.current) {
  //     if (isPreviewPaused) {
  //       cameraRef.current.resumePreview();
  //     } else {
  //       cameraRef.current.pausePreview();
  //     }
  //     setIsPreviewPaused(!isPreviewPaused);
  //   }
  // };

  if (!permission) {
    return (
      <View>
        <Text>Aucune permission</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Il faut votre permission afin d'accéder à la caméra</Text>
        <Button onPress={requestPermission} title="Donner la permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function toggleFlashMode() {
    setFlash((current) =>
      current === FlashMode.off ? FlashMode.torch : FlashMode.off
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        
        // Save the captured image to the device
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('PhotosCLG');
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
        } else {
          const newAlbum = await MediaLibrary.createAlbumAsync('PhotosCLG', asset, false);
          await MediaLibrary.addAssetsToAlbumAsync([asset], newAlbum.id, false);
        }
  
        setUserData(prevData => ({
          ...prevData,
          photoUri: uri
        })); // Update userData with imageUri
      } catch (error) {
        console.error('Error taking picture and saving it', error);
      }
    }
  }

  // Zoom functions
  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 1)); // Increase zoom by 0.1 up to max 1
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0)); // Decrease zoom by 0.1 down to min 0
  };

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={type} 
        flashMode={flash} 
        ref={cameraRef}
        zoom={zoom} // Set zoom level
      >
        <View style={styles.buttonContainer}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Tourner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleFlashMode}>
              <Text style={styles.text}>Flash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Capture</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.button} onPress={zoomIn}>
              <Text style={styles.text}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={zoomOut}>
              <Text style={styles.text}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Take up 80% of the width
    marginBottom: 10,
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%', // Take up 100% of the width
  },
  button: {
    backgroundColor: '#d32f2f',
    borderRadius: 50,
    padding: 15,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});