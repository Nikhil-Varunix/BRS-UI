import { API_BASE_URL, IMG_BASE_URL } from '@/config';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
  setSelectedImageUri?: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSchemeId?: string | null;
  setCurrentPage: (page: PageKeys) => void;
};

const { width } = Dimensions.get('window');

// Component for dynamically sized image
const DynamicImage = ({ uri }: { uri: string }) => {
  const [height, setHeight] = useState(200); // fallback height

  useEffect(() => {
    Image.getSize(uri, (w, h) => {
      const scaledHeight = (width * h) / w;
      setHeight(scaledHeight);
    }, (err) => console.error("Image getSize error:", err));
  }, [uri]);

  return <Image source={{ uri }} style={[styles.image, { height }]} />;
};

export default function SelectImage({ setCurrentPage, selectedSchemeId, setSelectedImageId }: SchemeDetailsProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedSchemeId) return;

    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/images/month/${selectedSchemeId}`);
        setImages(response.data);
      } catch (err) {
        console.error("Images API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedSchemeId]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setCurrentPage('image-generate');
            setSelectedImageId(null);
          }}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Select Image</Text>
      </View>

      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#f40a92" style={{ marginTop: 20 }} />
        ) : images.length === 0 ? (
          <Text>No images available for {selectedSchemeId}</Text>
        ) : (
          images.map(item => {
            const uri = `${IMG_BASE_URL}/uploads/${selectedSchemeId}/${item.imgurl}`;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedImageId(uri);
                  setCurrentPage("edit-image-generate");
                }}
              >
                <View style={{ width: "100%" }}>
                  <DynamicImage uri={uri} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fafafa' },
  image: {
    width: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15
  },
  headerBtn: {
    marginRight: 8,
  },
  scrollContainer: {
    minHeight: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
});
