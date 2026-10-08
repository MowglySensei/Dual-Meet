import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { ActivitiesScreen } from '../screens/ActivitiesScreen';
import { TravelScreen } from '../screens/TravelScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { CreateActivityScreen } from '../screens/CreateActivityScreen';
import { ActivityDetailScreen } from '../screens/ActivityDetailScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#0B0F17' },
        headerTitleStyle: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#A855F7',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: { fontWeight: '800', fontSize: 11 },
        tabBarIcon: ({ color, size }) => {
          let icon = '🏠';
          if (route.name === 'Accueil') icon = '🏠';
          else if (route.name === 'Découvrir') icon = '🔎';
          else if (route.name === 'Sorties') icon = '📅';
          else if (route.name === 'Voyager') icon = '✈️';
          else if (route.name === 'Profil') icon = '👤';
          return <Text style={{ fontSize: 18 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Découvrir" component={DiscoverScreen} options={{ title: 'Découvrir' }} />
      <Tab.Screen name="Sorties" component={ActivitiesScreen} options={{ title: 'Activités' }} />
      <Tab.Screen name="Voyager" component={TravelScreen} options={{ title: 'Voyager' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Mon Profil' }} />
    </Tab.Navigator>
  );
}

export const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>✦ DUAL MEET</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0B0F17' },
          headerTitleStyle: { color: '#FFFFFF', fontWeight: '800' },
          headerTintColor: '#A78BFA',
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: 'Modifier mon profil' }}
            />
            <Stack.Screen
              name="CreateActivity"
              component={CreateActivityScreen}
              options={{ title: 'Créer une sortie' }}
            />
            <Stack.Screen
              name="ActivityDetail"
              component={ActivityDetailScreen}
              options={{ title: 'Détails de la sortie' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Inscription' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0F17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#8B5CF6',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
