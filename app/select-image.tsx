import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type PageKeys =
  | "dashboard" | "otp" | "SplashScreen" | "login"
  | "edit-image-generate" | "videos" | "city-prides"
  | "city-details" | "schemes" | "image-generate"
  | "scheme-details" | "select-image";

type SchemeDetailsProps = {
  setSelectedImageId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedImageUri: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentPage: (page: PageKeys) => void;
};

const { width } = Dimensions.get('window');
const images = [
  {
    id: "img1",
    src: "https://dev.servicenxt.in/frameImages/srikrishnajanmaastimitwo.jpeg",
  },
  {
    id: "img2",
    src: "https://images.indianexpress.com/2024/07/KCR.jpg",
  }
];

export default function SelectImage({ setCurrentPage, setSelectedImageId }: SchemeDetailsProps) {
  const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    images.forEach((item) => {
      Image.getSize(item.src, (w, h) => {
        const scaledHeight = (width * h) / w; // scale height based on device width
        setImageHeights((prev) => ({ ...prev, [item.id]: scaledHeight }));
      });
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setCurrentPage('image-generate');
            if (setSelectedImageId) setSelectedImageId(null);
          }}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text> Select Image </Text>
      </View>

      {images.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            setSelectedImageId(item.src);
            setCurrentPage("edit-image-generate");
          }}
        >
          <View style={{ width: "100%", marginBottom: 10 }}>
            <Image
              source={{ uri: item.src }}
              style={[
                styles.image,
                { height: imageHeights[item.id] || 200 }, // fallback height until loaded
              ]}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fafafa' },
  image: {
    width: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  header: {
    // paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15
  },
  headerBtn: {
    marginRight: 8,
  },
  scrollContainer: {
    // flexGrow: 1,
    minHeight: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  container: {
    // flex: 1,
    // justifyContent: "center",
    // padding: 20,
    backgroundColor: "#fff",
  },

});
