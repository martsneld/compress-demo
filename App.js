/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef } from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Video, getRealPath } from 'react-native-compressor';
import CameraRoll from '@react-native-community/cameraroll';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const cancellationIdRef = useRef<string>('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const selectVideo = async () => {
    try {
      ImagePicker.launchImageLibrary(
        {
          mediaType: 'video',
        },
        async (result) => {
          if (result.didCancel) {
          } else if (result.errorCode) {
            Alert.alert('Failed selecting video');
          } else {
            if (result.assets) {
              const source = result.assets[0];
              let uri = source.uri;
              if (Platform.OS === 'android' && uri.includes('content://')) {
                const realPath = await getRealPath(uri, 'video');
                console.log('old path==>', uri, 'realPath ==>', realPath);
                uri = realPath;
              }
              console.log("~~~original~~~: ", uri);
              try {
                const dstUrl = await Video.compress(
                  uri,
                  {
                    compressionMethod: 'auto',
                    minimumFileSizeForCompress: 0,
                    getCancellationId: (cancellationId) =>
                      (cancellationIdRef.current = cancellationId),
                  },
                  (progress) => {
                    console.log('Compression Progress: ', progress);
                  }
                );
                console.log({ dstUrl }, 'compression result');

                await CameraRoll.save(dstUrl);
              } catch (error) {
                console.log('compression error', error);
              }
            }
          }
        }
      );
    } catch (error) {
      console.log('Failed to select video', error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View>
          <Button
            onPress={selectVideo}
            title="Learn More"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#ececec',
  },
  highlight: {
    fontWeight: '700',
  }
});

export default App;
