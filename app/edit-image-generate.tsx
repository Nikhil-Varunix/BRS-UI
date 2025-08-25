import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { captureRef } from "react-native-view-shot";

type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login" | "edit-image-generate" | "videos" | "city-prides" | "city-details" | "schemes" | "image-generate" | "scheme-details" | "select-image";

type EditImageGenerateProps = {
  imageUri: string | null;
  imageId: string | null;
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
  setSelectedSchemeId?: (id: string | null) => void;
};

const { width } = Dimensions.get('window');

export default function EditImageGenerate({
  imageUri,
  imageId,
  setCurrentPage,
  setSelectedSchemeId
}: EditImageGenerateProps) {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [label, setLabel] = useState("Your text");

  const scale = useSharedValue(1);
  const imgX = useSharedValue(100);
  const imgY = useSharedValue(100);
  const textX = useSharedValue(50);
  const textY = useSharedValue(50);

  const viewRef = useRef<View>(null);

  // Pick overlay image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setOverlayImage(result.assets[0].uri);
  };

  // Share the edited image
  const onShare = async () => {
    if (!viewRef.current) return;
    try {
      const uri = await captureRef(viewRef, { format: "png", quality: 1 });
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.log(e);
    }
  };

  // Gesture handlers
  const dragImage = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = imgX.value;
      ctx.startY = imgY.value;
    },
    onActive: (event, ctx: any) => {
      imgX.value = ctx.startX + event.translationX;
      imgY.value = ctx.startY + event.translationY;
    },
  });

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx: any) => {
      scale.value = ctx.startScale * event.scale;
    },
  });

  const dragText = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = textX.value;
      ctx.startY = textY.value;
    },
    onActive: (event, ctx: any) => {
      textX.value = ctx.startX + event.translationX;
      textY.value = ctx.startY + event.translationY;
    },
  });

  const imageStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: imgX.value,
    top: imgY.value,
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: textX.value,
    top: textY.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setCurrentPage('select-image');
            if (setSelectedSchemeId) setSelectedSchemeId(null);
          }}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text>Select Images</Text>
      </View>

      <View style={styles.container}>
        <View ref={viewRef} collapsable={false} style={styles.editor}>
          {imageUri || imageId ? (
            <Image
              source={imageUri ? { uri: imageUri } : { uri: imageId! }}
              style={styles.baseImage}
            />
          ) : (
            <View style={[styles.baseImage, { backgroundColor: '#ddd' }]} />
          )}

          {overlayImage && (
            <PanGestureHandler onGestureEvent={dragImage}>
              <Animated.View style={imageStyle}>
                <PinchGestureHandler onGestureEvent={pinchHandler}>
                  <Animated.View>
                    <Image source={{ uri: overlayImage }} style={styles.overlayImage} />
                  </Animated.View>
                </PinchGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          )}

          <PanGestureHandler onGestureEvent={dragText}>
            <Animated.View style={textStyle}>
              <Text style={styles.label}>{label}</Text>
            </Animated.View>
          </PanGestureHandler>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter text"
          value={label}
          onChangeText={setLabel}
        />
        <Button title="Pick Image" onPress={pickImage} />
        <View style={{ marginTop: 10 }}>
          <Button title="Share" onPress={onShare} />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  editor: { flex: 1, borderWidth: 1, borderColor: "gray", marginBottom: 10, overflow: 'hidden' },
  baseImage: { width: "100%", height: "100%", resizeMode: "contain" },
  overlayImage: { width: 150, height: 150, resizeMode: "contain" },
  label: { fontSize: 18, color: "white", backgroundColor: "rgba(0,0,0,0.5)", padding: 5 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  headerBtn: { padding: 8, marginRight: 8 },
});
