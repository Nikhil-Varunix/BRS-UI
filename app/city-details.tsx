// scheme-details.tsx
import { ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from "../config";

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

type CityDetailsProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
  setSelectedSchemeId?: (id: string | null) => void;
  selectedSchemeId?: string | null;
};

const { width } = Dimensions.get('window');
const CARD_IMAGE_HEIGHT = Math.round((width - 40) * 9 / 16);

export default function CityDetails({
  setCurrentPage,
  setSelectedSchemeId,
  selectedSchemeId,
}: CityDetailsProps) {

  const [city, setCity] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cities/${selectedSchemeId}`);
        setCity(response.data);
      } catch (err: any) {
        console.error("City API error:", err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [selectedSchemeId]);

    if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f40a92" />
        <Text style={{ marginTop: 10, color: '#555' }}>Loading...</Text>
      </View>
    );
  }

  if (error) return <Text style={{ padding: 20 }}>Error: {error}</Text>;
  if (!city) return <Text style={{ padding: 20 }}>No city data found.</Text>;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setCurrentPage('city-prides');
            if (setSelectedSchemeId) setSelectedSchemeId(null);
          }}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{city.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Image
            source={{ uri: city.imgurl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{city.name}</Text>
            <Text style={styles.cardSubtitle}>{city.extract}</Text>

            {/* <Text style={styles.sectionTitle}>Description</Text> */}
            {city.description.map((item: any, index: number) => (
              <View key={index} style={{ marginBottom: 32 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, marginBottom: 4 }}>{item.name}</Text>
                {item.imgurl ? (
                  <Image
                    source={{ uri: item.imgurl }}
                    style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 6 }}
                    resizeMode="cover"
                  />
                ) : null}
                <Text style={styles.paragraph}>{item.description}</Text>
              </View>
            ))}

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    height: 60,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerBtn: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#222' },

  container: { padding: 20, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardImage: { width: '100%', height: CARD_IMAGE_HEIGHT, backgroundColor: '#ddd' },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 22, fontWeight: '800', marginBottom: 6, color: '#222' },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 10 },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  paragraph: { color: '#444', lineHeight: 20 },
});
