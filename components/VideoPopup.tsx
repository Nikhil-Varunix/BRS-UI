import React, { useEffect, useState, useRef } from "react";
import { Modal, View, Dimensions, StyleSheet, Animated, Text, TouchableOpacity } from "react-native";
import { Video } from "expo-av";

const SCREEN_WIDTH = Dimensions.get("window").width;
// const SKIP_DURATION = 15000; 
const SKIP_DURATION = 0; 

type VideoPopupProps = {
  videoUri: string;
};

export default function VideoPopup({ videoUri }: VideoPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [remaining, setRemaining] = useState(SKIP_DURATION / 1000);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show popup every time component mounts
    setShowPopup(true);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SKIP_DURATION,
      useNativeDriver: false,
    }).start(() => {
      setShowButton(true);
    });

    // Countdown timer
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowButton(false);
    progressAnim.setValue(0);
    setRemaining(SKIP_DURATION / 1000);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal visible={showPopup} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            shouldPlay
            isLooping={false}
            isMuted={false}
          />
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
          </View>

          {!showButton && (
            <Text style={styles.countdownText}>
              Skip video in {remaining < 10 ? `0${remaining}` : remaining} seconds
            </Text>
          )}

          {showButton && (
            <TouchableOpacity style={styles.skipButton} onPress={handleClosePopup}>
              <Text style={styles.skipText}>Close / Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  progressContainer: {
    width: "100%",
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#f40a92",
  },
  countdownText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  skipButton: {
    backgroundColor: "#f40a92",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  skipText: {
    color: "#fff",
    fontWeight: "bold",
    
  },
});
