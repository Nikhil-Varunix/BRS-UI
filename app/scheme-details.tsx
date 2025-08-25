// scheme-details.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

type PageKeys =
  | 'dashboard'
  | 'otp'
  | 'SplashScreen'
  | 'login'
  | 'edit-image-generate'
  | 'videos'
  | 'city-prides'
  | 'city-details'
  | 'schemes'
  | 'image-generate'
  | 'scheme-details'
  | 'select-image';

type SchemeDetailsProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
  setSelectedSchemeId?: (id: string | null) => void;
  selectedSchemeId?: string | null;
};

const { width } = Dimensions.get('window');
const CARD_IMAGE_HEIGHT = Math.round((width - 40) * 9 / 16); // 16:9 card

export default function SchemeDetails({
  setCurrentPage,
  setSelectedSchemeId,
  selectedSchemeId,
}: SchemeDetailsProps) {
  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/schemes/${selectedSchemeId}`);
        setScheme(response.data);
      } catch (err: any) {
        console.error('scheme API error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (selectedSchemeId) fetchScheme();
  }, [selectedSchemeId]);

  if (loading) return <Text style={{ padding: 20 }}>Loading...</Text>;
  if (error) return <Text style={{ padding: 20 }}>Error: {error}</Text>;
  if (!scheme) return <Text style={{ padding: 20 }}>No scheme data found.</Text>;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setCurrentPage('schemes');
            if (setSelectedSchemeId) setSelectedSchemeId(null);
          }}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheme Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.card, styles.content]}>
          <Image source={{ uri: scheme.imgurl }} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{scheme.name}</Text>
            <Text style={styles.cardSubtitle}>{scheme.status}</Text>
          </View>

          <Text style={styles.sectionTitle}>About the Scheme</Text>
          <Text style={styles.paragraph}>{scheme.desc}</Text>

          <Text style={styles.sectionTitle}>How to Apply</Text>
          <Text style={styles.paragraph}>
            Visit the official Telangana government portal for application details or contact the scheme office.
          </Text>
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
  },
  headerBtn: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },

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
  cardTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6, color: '#222' },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 10 },

  content: { marginTop: 6, backgroundColor: '#fff', padding: 14, borderRadius: 10, elevation: 1 },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 6, color: '#111' },
  paragraph: { color: '#444', lineHeight: 20 },
});
