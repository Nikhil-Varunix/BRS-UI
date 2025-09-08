import React, { useState, useEffect } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login";

type Props = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
};

export default function Login({ setCurrentPage }: Props) {

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("jwtToken"); // JWT token if stored
      const phone = await AsyncStorage.getItem("phoneNumber");

      if (token && phone) {
        // User is already logged in
        setCurrentPage("dashboard");
      }
    };

    checkLogin();
  }, []);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastOpacity] = useState(new Animated.Value(0));

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);

    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setToastMessage(""));
    }, 2500);
  };

  const handleSendOTP = async () => {
    const trimmedNumber = phoneNumber.trim();

    if (trimmedNumber.length !== 10 || !/^\d{10}$/.test(trimmedNumber)) {
      showToast("Phone number must be exactly 10 digits.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: trimmedNumber }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("phoneNumber", trimmedNumber);
        showToast("OTP sent! Check your phone.", "success");
        setTimeout(() => {
          setCurrentPage("otp");
        }, 1000);
      } else {
        showToast(data.message || "Failed to send OTP", "error");
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Something went wrong while sending OTP", "error");
    } finally {
      setLoading(false);
    }
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
          maxLength={10}
          autoFocus={true}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
        </TouchableOpacity>
      </View>

      {/* Toast */}
      {toastMessage ? (
        <Animated.View
          style={[
            styles.toast,
            { backgroundColor: toastType === "success" ? "#4BB543" : "#f44336", opacity: toastOpacity },
          ]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor:"#fff" },
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
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
  background: { flex: 1, width: "100%", height: "100%" },
  toast: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    zIndex: 999,
    elevation: 10,
  },
  toastText: { color: "#fff", textAlign: "center", fontSize: 16 },
});
