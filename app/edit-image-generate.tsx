import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import { Button, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
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

  const overlayPanRef = useRef(null);
  const overlayPinchRef = useRef(null);
  const overlayTapRef = useRef(null);

  const textPanRef = useRef(null);
  const textPinchRef = useRef(null);
  const textTapRef = useRef(null);

  const inputRef = useRef<TextInput>(null);

  const [overlayShape, setOverlayShape] = useState<"original" | "square" | "rounded" | "circle">("original");
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [label, setLabel] = useState("Your text");
  const [editorWidth, setEditorWidth] = useState(0);
  const [editorHeight, setEditorHeight] = useState(0);
  const [imgHeight, setImgHeight] = useState<number | null>(null);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });
  const [isEditingText, setIsEditingText] = useState(false);

  const scale = useSharedValue(1);
  const imgX = useSharedValue(0);
  const imgY = useSharedValue(0);

  const textX = useSharedValue(0);
  const textY = useSharedValue(0);
  const textScale = useSharedValue(1);

  const viewRef = useRef<View>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setOverlayImage(result.assets[0].uri);
  };

  const onShare = async () => {
    if (!viewRef.current) return;
    try {
      const uri = await captureRef(viewRef, { format: "png", quality: 1 });
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.log(e);
    }
  };

  // --- Overlay Image Drag Handler ---
  const dragImage = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = imgX.value;
      ctx.startY = imgY.value;
    },
    onActive: (event, ctx: any) => {
      let newX = ctx.startX + event.translationX;
      let newY = ctx.startY + event.translationY;

      // Clamp within editor boundaries (150x150 cropWrapper size)
      const boxSize = 150 * scale.value;
      newX = Math.min(Math.max(newX, 0), editorWidth - boxSize);
      newY = Math.min(Math.max(newY, 0), editorHeight - boxSize);

      imgX.value = newX;
      imgY.value = newY;
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

  // --- Text Drag Handler ---
  const dragText = useAnimatedGestureHandler({
    
    onStart: (_, ctx: any) => {
      ctx.startX = textX.value;
      ctx.startY = textY.value;
    },
    onActive: (event, ctx: any) => {
      let newX = ctx.startX + event.translationX;
      let newY = ctx.startY + event.translationY;

      const boxW = textSize.width * textScale.value + 20; // padding buffer
      const boxH = textSize.height * textScale.value + 20;

      newX = Math.min(Math.max(newX, 0), editorWidth - boxW);
      newY = Math.min(Math.max(newY, 0), editorHeight - boxH);

      textX.value = newX;
      textY.value = newY;
    },
    
  });

  const pinchTextHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startScale = textScale.value;
    },
    onActive: (event, ctx: any) => {
      textScale.value = Math.max(0.5, Math.min(ctx.startScale * event.scale, 5));
    },
  });

  const imageStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: imgX.value,
    top: imgY.value,
    transform: [{ scale: scale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: textX.value,
    top: textY.value,
    transform: [{ scale: textScale.value }],
    // backgroundColor: isEditingText ? "rgba(26, 24, 24, 0.25)" : "transparent",
    backgroundColor: isEditingText ? "transparent" : "transparent",
    paddingHorizontal: isEditingText ? 5 : 0,
  }));

  const onTextTap = () => {
    setIsEditingText(true);

    textX.value = withTiming((editorWidth - textSize.width * textScale.value) / 2, { duration: 300 });
    textY.value = withTiming((editorHeight - textSize.height * textScale.value) / 2, { duration: 300 });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const onTextInputBlur = () => {
    setIsEditingText(false);
  };

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
        <Animated.Text>Edit Image</Animated.Text>
      </View>

      <View style={styles.container}>
        <View
          ref={viewRef}
          collapsable={false}
          style={[styles.editor, imgHeight ? { height: imgHeight } : ""]}
          onLayout={(e) => setEditorWidth(e.nativeEvent.layout.width)}
        >
          {imageUri || imageId ? (
            <Image
              source={imageUri ? { uri: imageUri } : { uri: imageId! }}
              style={[styles.baseImage, imgHeight ? { height: imgHeight } : {}]}
              resizeMode="contain"
              onLoad={(e) => {
                const { width: imgW, height: imgH } = e.nativeEvent.source;
                const scaledHeight = (editorWidth / imgW) * imgH;
                setImgHeight(scaledHeight);
                setEditorHeight(scaledHeight);

                textX.value = withTiming(0, { duration: 500 });
                textY.value = withTiming(scaledHeight - 60, { duration: 500 });
              }}
            />
          ) : (
            <View style={[styles.baseImage, { backgroundColor: "#ddd" }]} />
          )}

          {overlayImage && (
            <PanGestureHandler ref={overlayPanRef} simultaneousHandlers={[overlayPinchRef, overlayTapRef]} onGestureEvent={dragImage}>
              <Animated.View style={imageStyle}>
                <PinchGestureHandler ref={overlayPinchRef} simultaneousHandlers={[overlayPanRef, overlayTapRef]} onGestureEvent={pinchHandler}>
                  <Animated.View>
                    <TapGestureHandler
                      ref={overlayTapRef}
                      numberOfTaps={2}
                      onActivated={() => {
                        setOverlayShape((prev) => {
                          if (prev === "original") return "square";
                          if (prev === "square") return "rounded";
                          if (prev === "rounded") return "circle";
                          return "original";
                        });
                      }}
                      simultaneousHandlers={[overlayPanRef, overlayPinchRef]}
                    >
                      <Animated.View>
                        <View
                          style={[
                            styles.cropWrapper,
                            overlayShape === "circle" && { borderRadius: 75 },
                            overlayShape === "rounded" && { borderRadius: 20 },
                            overlayShape === "square" && { borderRadius: 0 },
                            overlayShape === "original" && { borderRadius: 0, overflow: "visible" },
                          ]}
                        >
                          <Image source={{ uri: overlayImage }} style={styles.overlayImage} />
                        </View>
                      </Animated.View>
                    </TapGestureHandler>
                  </Animated.View>
                </PinchGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          )}

          <PanGestureHandler
            ref={textPanRef}
            simultaneousHandlers={[textPinchRef, textTapRef]}
            onGestureEvent={dragText}
          >
            <Animated.View style={textAnimatedStyle}>
              <PinchGestureHandler
                ref={textPinchRef}
                simultaneousHandlers={[textPanRef, textTapRef]}
                onGestureEvent={pinchTextHandler}
              >
                <Animated.View style={{ padding: isEditingText ? 0 : 15, }}>
                  <TapGestureHandler
                    ref={textTapRef}
                    numberOfTaps={1}
                    onActivated={onTextTap}
                    simultaneousHandlers={[textPanRef, textPinchRef]}
                  >
                    <Animated.View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                      <Animated.Text
                        style={[styles.label]}
                        onLayout={(e) => {
                          setTextSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });
                        }}
                      >
                        {label}
                      </Animated.Text>
                    </Animated.View>
                  </TapGestureHandler>
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </View>

        <TextInput
          style={styles.input}
          ref={inputRef}
          value={label}
          onChangeText={setLabel}
          placeholder="Enter text here..."
          onFocus={onTextTap}
          onBlur={onTextInputBlur}
        />

        <View style={styles.buttonContainer}>
          <View style={[styles.buttonWrapper, styles.addButtonWrapper]}>
            <Button title="+ Add Image" onPress={pickImage} color="success" />
          </View>
          <View style={[styles.buttonWrapper, styles.shareButtonWrapper]}>
            <Button title="Share" onPress={onShare} color="#2196F3" />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 0, backgroundColor: "#fff", flex: 1 },
  editor: { alignSelf: "center", borderWidth: 1, borderColor: "gray", marginBottom: 10, overflow: "hidden", width: "100%" },
  baseImage: { width: "100%", height: "100%", resizeMode: "contain" },
  label: { color: "white", textAlign: "center", fontSize: 20 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10 },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: "#fff", },
  headerBtn: { padding: 8, marginRight: 8 },
  cropWrapper: { width: 150, height: 150, overflow: "hidden", justifyContent: "center", alignItems: "center" },
  overlayImage: { width: "100%", height: "100%", resizeMode: "cover" },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonWrapper: {
    marginRight: 10,
  },
  shareButtonWrapper: {},
});