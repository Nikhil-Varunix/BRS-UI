import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import { RootStackParamList } from '../components/types'; // import your type
import { useSchemes } from '@/context/SchemesContext';
import { useVideos } from '@/context/VideosContext';
import { useCityPrides } from '@/context/CityPridesContext';
import { useImageGenerate } from '@/context/ImageGenerateContext';
import VideoPopup from '../components/VideoPopup';


type DashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;
type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login" | "edit-image-generate" | "videos" | "city-prides" | "city-details" | "schemes" | "image-generate" | "scheme-details" | "select-image";

type SchemesProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
  setSelectedSchemeId: (id: string) => void;
};

export default function Dashboard({ setCurrentPage, setSelectedSchemeId }: SchemesProps) {

  const { schemes, loading: schemesLoading } = useSchemes();
  const { videos, loading: videosLoading } = useVideos();
  const { cityPrides, loading: cityPridesLoading } = useCityPrides();
  const { images, loading: imagesLoading } = useImageGenerate();


  return (
    <>
      {/* Video Popup */}
      <VideoPopup videoUri="http://dev.servicenxt.in/uploads/ad-video.mp4" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text> Dashboard </Text>

          <View style={styles.flexContainer}>
            <View style={styles.fullPanel} >
              <LinearGradient
                colors={['#FFD484', '#FF5297']} // from left to right
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBox}
              >
                <TouchableNativeFeedback
                  onPress={() => {
                    setSelectedSchemeId('001');
                    setCurrentPage('schemes');
                  }}
                  background={TouchableNativeFeedback.Ripple('#fdcbf0ff', false)}
                >
                  <View style={[styles.boxLeft, styles.rowBetween]}>
                    <Text style={styles.cardHeadding}> Schemes </Text>
                    <Text style={[styles.cardNumberDone, styles.textRight]}>
                      {videosLoading ? '...' : schemes.length}
                    </Text>
                    {/* <Text style={styles.cardtext}> Today calls in quee</Text>                  */}
                  </View>
                </TouchableNativeFeedback>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.flexContainer}>
            <View style={styles.fullPanel} >
              <LinearGradient
                colors={['#80D7FF', '#0A62D4']} // from left to right
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBox}
              >
                <TouchableNativeFeedback

                  onPress={() => {
                    setSelectedSchemeId('001');
                    setCurrentPage('city-prides');
                  }}

                  background={TouchableNativeFeedback.Ripple('#fdcbf0ff', false)}
                >
                  <View style={[styles.boxLeft, styles.rowBetween,]}>
                    <Text style={styles.cardHeadding}> City and Pride </Text>
                    <Text style={[styles.cardNumberDone, styles.textRight]}>
                      {cityPridesLoading ? '...' : cityPrides.length}

                    </Text>
                    {/* <Text style={styles.cardtext}> Today calls in quee</Text>                  */}
                  </View>
                </TouchableNativeFeedback>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.flexContainer}>
            <View style={styles.fullPanel} >
              <LinearGradient
                colors={['#57EFCC', '#12B89D']} // from left to right
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBox}
              >
                <TouchableNativeFeedback

                  onPress={() => {
                    setSelectedSchemeId('001');
                    setCurrentPage('videos');
                  }}

                  background={TouchableNativeFeedback.Ripple('#fdcbf0ff', false)}
                >
                  <View style={[styles.boxLeft, styles.rowBetween,]}>
                    <Text style={styles.cardHeadding}> Videos </Text>
                    <Text style={[styles.cardNumberDone, styles.textRight]}>  {videosLoading ? '...' : videos.length} </Text>
                    {/* <Text style={styles.cardtext}> Today calls in quee</Text> */}
                  </View>
                </TouchableNativeFeedback>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.flexContainer}>
            <View style={styles.fullPanel} >
              <LinearGradient
                colors={['#99E593', '#2CAAEE']} // from left to right
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBox}
              >
                <TouchableNativeFeedback
                  onPress={() => {
                    setSelectedSchemeId('001');
                    setCurrentPage('image-generate');
                  }}

                  background={TouchableNativeFeedback.Ripple('#fdcbf0ff', false)}
                >
                  <View style={[styles.boxLeft, styles.rowBetween,]}>
                    <Text style={styles.cardHeadding}> Generate Images </Text>
                    <Text style={[styles.cardNumberDone, styles.textRight]}>
                      {imagesLoading ? '...' : images.length}
                      <Text style={[styles.textsm]}> Frames </Text>
                    </Text>
                    {/* <Text style={styles.cardtext}> Today calls in quee</Text>                  */}
                  </View>
                </TouchableNativeFeedback>
              </LinearGradient>
            </View>
          </View>


        </View>
      </ScrollView>

    </>
  );
}

const styles = StyleSheet.create({
  textsm: {
    flex: 1,
    fontSize: 10
  },
  gradientBox: {
    // padding: 10,
    borderRadius: 12,      // rounded corners
    elevation: 5,          // shadow for Android
    shadowColor: '#000',   // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes first text left, second text right
    alignItems: 'center',            // aligns vertically in middle
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dflex: {
    flex: 1,
    display: 'flex'
  },
  textRight: {
    textAlign: 'right',
    paddingRight: 30

  },
  scrollContainer: {
    paddingBottom: 60,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardHeadding: { fontSize: 15, color: '#fff', width: '50%' },
  leftPanel: { paddingRight: 10, width: '50%' },
  rightPanel: { paddingLeft: 10, width: '50%', },

  smallLeftPanel: { paddingLeft: 0, width: '33%', },
  smallCenterPanel: { paddingLeft: 5, width: '33%', },
  smallRightPanel: { paddingLeft: 5, width: '33%', },
  fullPanel: { paddingLeft: 0, width: '100%', textAlign: 'center' },

  cardNumberDone: { fontWeight: 'bold', paddingBottom: 5, width: '50%', paddingTop: 5, color: '#fff', fontSize: 35 },
  cardNumberTodo: { fontWeight: 'bold', paddingBottom: 5, paddingTop: 5, color: '#D28AFF', fontSize: 35 },
  cardtext: { fontSize: 14, color: 'grey' },


  boxLeft: {
    // backgroundColor: '#fff',
    padding: 20,
    paddingRight: 10,
    // shadowColor: '#000000',
    borderRadius: 20,
    // elevation: 8,
  },
  boxRight: {
    // backgroundColor: '#fff',
    padding: 10,
    paddingLeft: 10,
    borderRadius: 10,
    elevation: 8,
  },
  flexContainer: {
    flexDirection: 'row',
    marginTop: 10

  }
});
