import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api, isSupabaseConfigured } from '../lib/supabase';

export const EditProfileScreen = ({ navigation }: any) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState<string>(user?.display_name || '');
  const [city, setCity] = useState<string>(user?.city || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || '');
  const [loading, setLoading] = useState<boolean>(false);

  // Pick Image from Smartphone Gallery
  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showToast('Autorisation d’accès à la galerie nécessaire.', 'error');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      const selectedUri = pickerResult.assets[0].uri;
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          const publicUrl = await api.uploadPhoto(selectedUri, 'avatars');
          setAvatarUrl(publicUrl);
        } else {
          setAvatarUrl(selectedUri);
        }
        showToast('Photo sélectionnée ! Enregistrez pour valider.', 'success');
      } catch (e) {
        showToast('Erreur lors du chargement de la photo.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        display_name: displayName,
        city,
        phone,
        bio,
        avatar_url: avatarUrl,
        phone_verified: true,
      });

      showToast('Profil sauvegardé avec succès !', 'success');
      navigation.goBack();
    } catch (e) {
      showToast('Erreur lors de la sauvegarde.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Édition du Profil</Text>

      {/* Avatar Box */}
      <View style={styles.avatarBox}>
        <Image
          source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' }}
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.pickButton} onPress={handlePickAvatar} disabled={loading}>
          <Text style={styles.pickButtonText}>📷 Choisir dans ma galerie mobile</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Prénom ou Pseudonyme</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Ex: Alex, Sophie..."
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Ville actuelle</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Ex: Perpignan, Toulouse..."
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Numéro de téléphone mobile</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Ex: 06 12 34 56 78"
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Bio / Présentation</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          placeholder="Présentez-vous en quelques mots..."
          placeholderTextColor="#64748B"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>Enregistrer mon profil</Text>
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
    marginBottom: 16,
  },
  avatarBox: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    marginBottom: 12,
  },
  pickButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  pickButtonText: {
    color: '#22D3EE',
    fontSize: 12,
    fontWeight: '800',
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
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
