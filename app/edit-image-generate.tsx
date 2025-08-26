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
  const [editorWidth, setEditorWidth] = useState(0);
  const [editorHeight, setEditorHeight] = useState(0);
  const [imgHeight, setImgHeight] = useState<number | null>(null);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });
  const scale = useSharedValue(1);
  const imgX = useSharedValue(100);
  const imgY = useSharedValue(100);
  const textX = useSharedValue(50);
  const textY = useSharedValue(50);

  const viewRef = useRef<View>(null);

  const [measuredTextSize, setMeasuredTextSize] = useState({ width: 0, height: 0 });
useEffect(() => {
  // re-measure after label changes
  setTextSize(measuredTextSize);
}, [label]);

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

  // Drag handler with boundary check
  const dragText = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = textX.value;
      ctx.startY = textY.value;
    },
    onActive: (event, ctx: any) => {
      const newX = ctx.startX + event.translationX;
      const newY = ctx.startY + event.translationY;

      // Clamp using actual text width/height
      textX.value = Math.max(0, Math.min(newX, editorWidth - textSize.width));
      textY.value = Math.max(0, Math.min(newY, editorHeight - textSize.height));
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
        <View
          ref={viewRef}
          collapsable={false}
          style={[styles.editor, imgHeight ? { height: imgHeight } : { flex: 1 }]}
          onLayout={(e) => {
            setEditorWidth(e.nativeEvent.layout.width);
          }}
        >
          {imageUri || imageId ? (
            <Image
              source={imageUri ? { uri: imageUri } : { uri: imageId! }}
              style={[styles.baseImage, imgHeight ? { height: imgHeight } : {}]}
              resizeMode="contain"
              onLoad={(e) => {
                const { width: imgW, height: imgH } = e.nativeEvent.source;
                const scaledHeight = (editorWidth / imgW) * imgH; // scale by container width
                setImgHeight(scaledHeight);
                setEditorHeight(scaledHeight); // update editor height
              }}
            />
          ) : (
            <View style={[styles.baseImage, { backgroundColor: "#ddd" }]} />
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
              <View
                onLayout={(e) => {
                  setTextSize({
                    width: e.nativeEvent.layout.width,
                    height: e.nativeEvent.layout.height,
                  });
                }}
              >
                <Text style={styles.label}>{label}</Text>
              </View>
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
  editor: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    overflow: "hidden",
    width: "100%",
  },
  baseImage: { width: "100%", height: "100%", resizeMode: "contain" },
  overlayImage: { width: 150, height: 150, resizeMode: "contain" },
  label: { fontSize: 18, color: "white", backgroundColor: "rgba(0,0,0,0.5)", padding: 5 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  headerBtn: { padding: 8, marginRight: 8 },
});
