import { ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import React from "react";

type PageKeys =
  | "dashboard"
  | "otp"
  | "SplashScreen"
  | "login"
  | "edit-image-generate"
  | "videos"
  | "city-prides"
  | "city-details"
  | "schemes"
  | "image-generate"
  | "scheme-details"
  | "select-image";

type SchemesProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
  setSelectedSchemeId: (id: string) => void;
};

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

export default function ImageGenerate({ setCurrentPage, setSelectedSchemeId }: SchemesProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={{ marginBottom: 10 }}> Select Images month wise </Text>

        {months.map((month, index) => (
          <View key={month}>
            <TouchableNativeFeedback
              onPress={() => {
                setSelectedSchemeId(month); 
                setCurrentPage("select-image");
              }}
              background={TouchableNativeFeedback.Ripple("#3e9bf3ff", false)}
            >
              <View style={styles.gradientBox}>
                <Text style={styles.cardHeadding}>{month}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    minHeight: "100%",
    backgroundColor: "#fff",
  },
  container: {
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  cardHeadding: { fontSize: 15, color: "#000", padding: 8 },
  gradientBox: {
    padding: 10,
    marginTop: 10,
    borderRadius: 12,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#c1e8f3ff",
  },
});
