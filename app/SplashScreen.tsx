import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

type SplashProps = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3500); // splash duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/kaleshwaram.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.centered}>
        {/* You can add a logo/text here */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
