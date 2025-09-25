import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import { Alert, BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import CityDetails from './city-details';
import CityPrides from './city-prides';
import Dashboard from './dashboard';
import EditImageGenerate from './edit-image-generate';
import ImageGenerate from './image-generate';
import Login from './login';
import OTP from './otp';
import SchemeDetails from './scheme-details';
import Schemes from './schemes';
import SelectImage from './select-image';
import SplashScreen from './SplashScreen';
import VideosPage from './videos';

// Import contexts
import { SchemesProvider } from '../context/SchemesContext';
import { VideosProvider } from '../context/VideosContext';
import { CityPridesProvider } from '../context/CityPridesContext';
import { ImageGenerateProvider } from '../context/ImageGenerateContext';

type PageKeys =
  | 'dashboard'
  | 'city-prides'
  | 'schemes'
  | 'videos'
  | 'image-generate'
  | 'scheme-details'
  | 'city-details'
  | 'select-image'
  | 'login'
  | 'SplashScreen'
  | 'edit-image-generate'
  | 'otp';

export default function LayoutWrapper() {
  return (
    <SchemesProvider>
      <VideosProvider>
        <CityPridesProvider>
          <ImageGenerateProvider>
            <Layout />
          </ImageGenerateProvider>
        </CityPridesProvider>
      </VideosProvider>
    </SchemesProvider>
  );
}

function Layout() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageKeys>('dashboard');
  const [history, setHistory] = useState<PageKeys[]>([]); // navigation history
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  // --- Navigation helper functions ---
  const navigateTo = (page: PageKeys) => {
    if (page !== currentPage) {
      setHistory((prev) => [...prev, currentPage]); // push current page to history
      setCurrentPage(page);
    }
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setCurrentPage(last);
      return prev.slice(0, -1); // remove last
    });
  };

  // --- Back button handler ---
  useEffect(() => {
    const backAction = () => {
      if (drawerOpen) {
        setDrawerOpen(false);
        return true; // prevent app exit
      }

      if (history.length > 0) {
        goBack();
        return true;
      }

      // If at dashboard, show exit alert
      if (currentPage === 'dashboard') {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
        );
        return true;
      }

      return false; // default behavior for login/otp or root pages
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [currentPage, history, drawerOpen]);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          setShowSplash(false);
          setCurrentPage('dashboard');
        }}
      />
    );
  }

  const Logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('phoneNumber');

    Alert.alert('Success', 'Logged out successfully');
    setHistory([]); // clear history
    setCurrentPage('login');
  };

  const clearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Local storage cleared');
    } catch (error) {
      console.log('Error clearing local storage:', error);
    }
  };

  return (
    <>
      <View style={{ paddingTop: insets.top, backgroundColor: '#f04a8cff' }} />
      <View style={{ flex: 1 }}>
        {/* Header */}
        {currentPage !== 'login' && currentPage !== 'otp' && (
          <View style={[styles.header, { backgroundColor: '#f866beff' }]}>
            <TouchableOpacity onPress={() => setDrawerOpen(!drawerOpen)}>
              <Text style={styles.menu}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.title}>BRS Photo Creator</Text>
          </View>
        )}

        {/* Page Content */}
        <View style={{ flex: 1 }}>
          {currentPage === 'SplashScreen' && <SplashScreen onFinish={() => navigateTo('login')} />}
          {currentPage === 'otp' && <OTP setCurrentPage={setCurrentPage} />}

          {currentPage === 'dashboard' && (
            <Dashboard setCurrentPage={navigateTo} setSelectedSchemeId={setSelectedSchemeId} />
          )}
          {currentPage === 'city-prides' && (
            <CityPrides setCurrentPage={navigateTo} setSelectedSchemeId={setSelectedSchemeId} />
          )}
          {currentPage === 'schemes' && (
            <Schemes setCurrentPage={navigateTo} setSelectedSchemeId={setSelectedSchemeId} />
          )}
          {currentPage === 'videos' && (
            <VideosPage setCurrentPage={navigateTo} setSelectedSchemeId={setSelectedSchemeId} />
          )}
          {currentPage === 'image-generate' && (
            <ImageGenerate setCurrentPage={navigateTo} setSelectedSchemeId={setSelectedSchemeId} />
          )}
          {currentPage === 'scheme-details' && (
            <SchemeDetails
              selectedSchemeId={selectedSchemeId}
              setCurrentPage={navigateTo}
              setSelectedSchemeId={setSelectedSchemeId}
            />
          )}
          {currentPage === 'city-details' && (
            <CityDetails
              setCurrentPage={navigateTo}
              setSelectedSchemeId={setSelectedSchemeId}
              selectedSchemeId={selectedSchemeId}
            />
          )}
          {currentPage === 'select-image' && (
            <SelectImage
              setSelectedImageId={setSelectedImageId}
              setSelectedImageUri={setSelectedImageUri}
              setCurrentPage={navigateTo}
            />
          )}
          {currentPage === 'edit-image-generate' && (
            <EditImageGenerate
              imageId={selectedImageId}
              imageUri={selectedImageUri}
              setCurrentPage={navigateTo}
              setSelectedImageId={setSelectedImageId}
              setSelectedSchemeId={setSelectedSchemeId}
            />
          )}
          {currentPage === 'login' && <Login setCurrentPage={navigateTo} />}
        </View>

        {/* Bottom Tabs */}
        {currentPage !== 'login' && currentPage !== 'otp' && (
          <View style={styles.bottomTabs}>
            {[
              { key: 'dashboard', label: 'Home', icon: 'home-outline' },
              { key: 'city-prides', label: "City's Pride", icon: 'business-outline' },
              { key: 'schemes', label: 'Schemes', icon: 'grid-outline' },
              { key: 'videos', label: 'Videos', icon: 'play-circle-outline' },
              { key: 'image-generate', label: 'Generate Image', icon: 'images-outline' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabButton}
                onPress={() => navigateTo(tab.key as PageKeys)}
              >
                <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons
                    name={tab.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={currentPage === tab.key ? '#f40a92ff' : '#9c9b9b'}
                  />
                </View>
                <Text style={[styles.tabItem, currentPage === tab.key && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Left Drawer Menu */}
      {drawerOpen && (
        <View style={styles.drawerOverlay}>
          <View style={styles.drawer}>
            <TouchableOpacity onPress={() => { navigateTo('dashboard'); setDrawerOpen(false); }}>
              <Text style={styles.drawerItem}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigateTo('city-prides'); setDrawerOpen(false); }}>
              <Text style={styles.drawerItem}>City's Pride</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigateTo('schemes'); setDrawerOpen(false); }}>
              <Text style={styles.drawerItem}>Schemes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigateTo('videos'); setDrawerOpen(false); }}>
              <Text style={styles.drawerItem}>Videos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigateTo('image-generate'); setDrawerOpen(false); }}>
              <Text style={styles.drawerItem}>Generate Image</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.drawerBackdrop}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, zIndex: 9 },
  title: { fontSize: 18, marginLeft: 10, fontWeight: 'bold', color: '#fff' },
  menu: { fontSize: 24, padding: 15, color: '#fff' },
  bottomTabs: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderTopWidth: 1, borderTopColor: '#ddd' },
  tabItem: { fontSize: 10 },
  tabButton: { alignItems: 'center', justifyContent: 'center', padding: 10 },
  activeTabText: { color: '#f40a92ff' },
  drawerOverlay: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', zIndex: 1 },
  drawer: { marginTop: 98, width: 250, backgroundColor: '#fff', padding: 20, shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  drawerItem: { fontSize: 16, marginVertical: 15, color: '#333' },
  drawerBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
});
