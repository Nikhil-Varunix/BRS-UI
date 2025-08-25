import React, { useState, useEffect } from "react";
import { Alert, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login"| "edit-image-generate" | "videos" | "city-prides" | "city-details" | "schemes" | "image-generate" | "scheme-details" | "select-image";
type Props = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
};

export default function Login({ setCurrentPage }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // Check login status on app start
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setCurrentPage("dashboard");
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (phoneNumber.trim().length !== 10) {
      Alert.alert("Invalid Number", "Phone number must be exactly 10 digits.");
      return;
    }
    // Save phone number if needed
    await AsyncStorage.setItem("phoneNumber", phoneNumber);
    // Navigate to OTP screen
    setCurrentPage("otp");
  };

  return (
    <ImageBackground
      source={require("../assets/images/LoginPage.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: { backgroundColor: "#f40a92ff", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
  background: { flex: 1, width: "100%", height: "100%" },
});
