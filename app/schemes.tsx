import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import { RootStackParamList } from '../components/types'; // import your type
import { useSchemes } from '@/context/SchemesContext';
type DashboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard',
  'Schemedetails'
>;
type PageKeys = "dashboard" | "otp" | "SplashScreen" | "login" | "edit-image-generate" | "videos" | "city-prides" | "city-details" | "schemes" | "image-generate" | "scheme-details" | "select-image";

type SchemesProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageKeys>>;
  setSelectedSchemeId: (id: string) => void;
};
export default function Schemes({ setCurrentPage, setSelectedSchemeId }: SchemesProps) {
  // const navigation = useNavigation();
  const { schemes, loading: schemesLoading } = useSchemes();

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text> Schemes </Text>

          {schemes.map((scheme) => (
            <View key={scheme.id}>
              <TouchableNativeFeedback
                onPress={() => {
                  setSelectedSchemeId(scheme.id);
                  setCurrentPage('scheme-details');
                }}

                background={TouchableNativeFeedback.Ripple('#fdcbf0ff', false)}
              >
                <View style={styles.gradientBox}>
                  <Text style={styles.cardHeadding}> {scheme.name} </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          ))}

        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardHeadding: { fontSize: 15, color: '#000', padding: 8 },
  gradientBox: {
    padding: 10,
    marginTop: 10,
    borderRadius: 12,      // rounded corners
    elevation: 5,          // shadow for Android
    shadowColor: '#000',   // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#FFE8E8'
    // alignItems: 'center', 
    // justifyContent: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  scrollContainer: {
    paddingBottom: 60,
  },
});
