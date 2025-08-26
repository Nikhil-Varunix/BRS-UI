import React, { useState } from "react";
import { Alert, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login";

type Props = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
};

export default function Login({ setCurrentPage }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    const trimmedNumber = phoneNumber.trim();

    if (trimmedNumber.length !== 10 || !/^\d{10}$/.test(trimmedNumber)) {
      Alert.alert("Invalid Number", "Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: trimmedNumber }), // no +91 here
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("phoneNumber", trimmedNumber);
        Alert.alert("OTP Sent", "Please check your phone for OTP.");
        setCurrentPage("otp");
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../assets/images/LoginPage.jpg")} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSendOTP} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
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
  button: {
    backgroundColor: "#f40a92ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
  background: { flex: 1, width: "100%", height: "100%" },
});
