// scheme-details.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login"| "edit-image-generate" | "videos" |  "city-prides" | "city-details" | "schemes" | "image-generate" | "scheme-details" | "select-image";
 
type SchemeDetailsProps = {
  setSelectedImageId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedImageUri: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentPage: (page: PageKeys) => void;
};

const { width } = Dimensions.get('window');
const CARD_IMAGE_HEIGHT = Math.round((width - 40) * 9 / 16); // 16:9 card
const images = [
    {
      id: "img1",
      src: "https://dev.servicenxt.in/frameImages/srikrishnajanmaastimitwo.jpeg",
    },
    {
      id: "img2",
      src: "https://images.indianexpress.com/2024/07/KCR.jpg",
    },
    {
      id: "img3",
      src: "https://placekitten.com/500/300",
    },
  ];

export default function SelectImage({ setCurrentPage, setSelectedImageId }: SchemeDetailsProps) {
  // pick scheme by id or fallback
  // const scheme = selectedSchemeId ? MOCK_SCHEMES[selectedSchemeId] ?? Object.values(MOCK_SCHEMES)[0] : Object.values(MOCK_SCHEMES)[0];
  return (
      <ScrollView style={{ padding: 10 }}>
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
            <Text> Select Image  </Text> 
        </View>
      {images.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            setSelectedImageId(item.src);
            setCurrentPage("edit-image-generate");
          }}  
        >
        <View style={{ width: "100%", aspectRatio: 1, marginBottom: 10 }}>
          <Image source={{ uri: item.src }} style={styles.image} />
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
    height: "100%",
    aspectRatio: 1,
    resizeMode: "cover", // or "contain"
    borderRadius: 10,
  }, 
  header: {
    // height: 60,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:5,
    marginBottom: 15
  },
  headerBtn: {
    // padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  container: {
    // padding: 20,
    paddingBottom: 10,
  },

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
  cardImage: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    backgroundColor: '#ddd',
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },

  marqueeContainer: {
    height: 28,
    overflow: 'hidden',
    backgroundColor: '#fff7f9',
    justifyContent: 'center',
    borderRadius: 6,
    paddingLeft: 6,
  },
  marqueeText: {
    fontSize: 13,
    color: '#ff3b82',
    fontWeight: '600',
    position: 'absolute',
    left: 0,
  },

  content: {
    // marginTop: 6,
    backgroundColor: '#fff',
    // padding: 14,
    borderRadius: 10,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
    color: '#111',
  },
  paragraph: {
    color: '#444',
    lineHeight: 20,
  },
  bulletList: {
    marginLeft: 6,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    marginVertical: 4,
    color: '#333',
  },

  applyBtn: {
    marginTop: 16,
    backgroundColor: '#ff0066',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
