import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { RootStackParamList } from '../components/types'; // import your type
import { useVideos } from '@/context/VideosContext';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16; // 16:9 ratio


type VideosNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VideosPage'
>;
type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login" | "edit-image-generate" | "videos" | "city-prides" | "city-details" | "schemes" | "image-generate" | "scheme-details" | "select-image";
type SchemesProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
  setSelectedSchemeId: (id: string) => void;
};


export default function VideosPage({ setCurrentPage, setSelectedSchemeId }: SchemesProps) {
  const { videos, loading: videosLoading } = useVideos();


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* <Text style={styles.pageTitle}>🎥 Featured Videos</Text> */}
      <View  >
        <Text> Videos </Text>
        {videos.map((video) => (
          <View key={video.id} style={styles.videoCard}>
            <Text style={styles.videoTitle}>{video.name}</Text>
            <WebView
              style={styles.video}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo
              source={{ uri: video.imgurl }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'left',
    backgroundColor: '#ff0066',
    color: '#fff',
  },
  videoCard: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'left',
  },
  video: {
    width: '100%',
    height: VIDEO_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
