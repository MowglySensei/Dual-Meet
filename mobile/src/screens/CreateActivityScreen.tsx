import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api, isSupabaseConfigured } from '../lib/supabase';
import { CategoryType } from '../types';

export const CreateActivityScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Randonnée');
  const [city, setCity] = useState<string>(user?.city || '');
  const [maxParticipants, setMaxParticipants] = useState<number>(4);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }

    if (!title || !city) {
      showToast('Veuillez saisir un titre et une ville.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await api.createActivity({
          organizer_id: user.id,
          organizer: user,
          title,
          description,
          category,
          date_time: new Date(Date.now() + 86400000).toISOString(),
          city,
          latitude: 42.6986,
          longitude: 2.8956,
          max_participants: maxParticipants,
          is_spontaneous: false,
          is_two_person: false,
          budget: 'Gratuit',
          fitness_level: 'Tous niveaux',
          status: 'open',
          image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
        });
      }

      showToast('Votre activité a été publiée avec succès !', 'success');
      navigation.goBack();
    } catch (e: any) {
      showToast(e?.message || 'Erreur lors de la création.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Proposer une nouvelle activité</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Titre de l'activité *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Randonnée au lac, Session Bowling..."
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Ville ou secteur *</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Ex: Perpignan, Toulouse, Montpellier..."
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholder="Décrivez votre sortie, le lieu de rendez-vous..."
          placeholderTextColor="#64748B"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Publier la sortie</Text>
        )}
      </TouchableOpacity>
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
    paddingBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
