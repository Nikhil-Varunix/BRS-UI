import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
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

  useEffect(() => {
    const fetchPhone = async () => {
      const storedNumber = await AsyncStorage.getItem("phoneNumber");
      if (storedNumber) setPhoneNumber(storedNumber);
    };
    fetchPhone();
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.trim().length === 0) {
      Alert.alert("Invalid OTP", "Please enter the OTP sent to your phone.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phoneNumber, code: otp }), // send plain number
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("jwtToken", data.token);
        Alert.alert("Success", "OTP verified successfully!");
        setCurrentPage("dashboard");
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Something went wrong while verifying OTP");
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
      />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleVerifyOTP} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: "#f40a92ff", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
});
