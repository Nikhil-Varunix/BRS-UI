//otp.tsx
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login"| "edit-image-generate" | "videos" | "city-prides" | "city-details" | "schemes" | "image-generate" | "scheme-details" | "select-image";

type Props = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
};

export default function OTP({ setCurrentPage }: Props) {
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (otp === "1234") { // demo OTP
      await AsyncStorage.setItem("isLoggedIn", "true"); // save login status
      setCurrentPage("dashboard");
    } else {
      Alert.alert("Error", "Invalid OTP");
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
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: { backgroundColor: "#f40a92ff", padding: 15, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
});
