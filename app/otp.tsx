import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text, View, ActivityIndicator, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login";

type Props = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
};

export default function OTP({ setCurrentPage }: Props) {
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchPhone = async () => {
      const storedNumber = await AsyncStorage.getItem("phoneNumber");
      if (storedNumber) setPhoneNumber(storedNumber);
    };
    fetchPhone();
  }, []);

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

const handleVerifyOTP = async () => {
  if (otp.trim().length === 0) {
    showToast("Please enter the OTP sent to your phone.", "error");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phoneNumber, code: otp }),
    });

    const data = await response.json();

    if (data.success) {
      await AsyncStorage.setItem("jwtToken", data.token);
      await AsyncStorage.setItem("phoneNumber", phoneNumber);
      showToast("OTP verified successfully!", "success");

      setTimeout(() => {
        setCurrentPage("dashboard");
      }, 1000); // wait for toast to show
    } else {
      showToast(data.message || "Invalid OTP", "error");
    }
  } catch (error: any) {
    console.error(error);
    showToast(error.message || "Something went wrong while verifying OTP", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
         autoFocus={true}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
      </TouchableOpacity>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor:"#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: "#f40a92ff", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
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
