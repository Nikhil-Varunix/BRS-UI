import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Pressable } from 'react-native';
export default function Dashboard() {
  return (
    <>
       <Stack.Screen
        options={{
          title: 'SATYA',
          headerLeft: () => (
            <Pressable style={{ marginTop: Constants.statusBarHeight, marginLeft: 16 }}>
              <Ionicons name="menu" size={24} color="white" />
            </Pressable>
          ),
          headerStyle: { backgroundColor: 'tomato' },
          headerTintColor: 'red',
        }}
      />
      <ThemedView style={styles.container}>
        {/* <ThemedText type="title">Dashboard</ThemedText> */}
        <Link href="/dashboard" style={styles.link}>
          <ThemedText type="link">Go to home screen 1!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
