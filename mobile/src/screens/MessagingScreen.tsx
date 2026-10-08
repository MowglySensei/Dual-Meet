import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const MessagingScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Messagerie & Tchats</Text>
      <Text style={styles.subtitle}>Vos discussions privées et conversations de sorties.</Text>

      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>💬</Text>
        <Text style={styles.emptyTitle}>Aucune conversation en cours</Text>
        <Text style={styles.emptySubtitle}>
          Inscrivez-vous à une sortie ou ajoutez des contacts pour échanger des messages en direct.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F17',
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 20,
  },
  emptyCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
