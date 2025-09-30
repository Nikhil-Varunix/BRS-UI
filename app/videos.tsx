import React, { useState, useCallback } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useVideos } from '@/context/VideosContext';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16; // 16:9 ratio
const INITIAL_LOAD = 10;
const LOAD_MORE_COUNT = 5;

type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login" | "edit-image-generate" | "videos" | "city-prides" | "city-details" | "schemes" | "image-generate" | "scheme-details" | "select-image";
type SchemesProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
  setSelectedSchemeId: (id: string) => void;
};

export default function VideosPage({ setCurrentPage, setSelectedSchemeId }: SchemesProps) {
  const { videos, loading: videosLoading } = useVideos();
  const [displayedVideos, setDisplayedVideos] = useState(videos.slice(0, INITIAL_LOAD));
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreVideos = useCallback(() => {
    if (displayedVideos.length >= videos.length || loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextVideos = videos.slice(displayedVideos.length, displayedVideos.length + LOAD_MORE_COUNT);
      setDisplayedVideos(prev => [...prev, ...nextVideos]);
      setLoadingMore(false);
    }, 1000); // simulate network delay
  }, [displayedVideos, videos, loadingMore]);

  if (videosLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff0066" />
      </View>
    );
  }

  return (
    <FlatList
      data={displayedVideos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.videoCard}>
          <Text style={styles.videoTitle}>{item.name}</Text>
          <WebView
            style={styles.video}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo
            source={{ uri: item.imgurl }}
          />
        </View>
      )}
      contentContainerStyle={styles.scrollContainer}
      onEndReached={loadMoreVideos}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#ff0066" /> : null}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  videoCard: {
    marginVertical: 10,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
