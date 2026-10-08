import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Se déconnecter', 'Êtes-vous sûr de vouloir vous déconnecter de Dual Meet ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile Box */}
      <View style={styles.profileBox}>
        <Image
          source={{ uri: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' }}
          style={styles.avatar}
        />

        <Text style={styles.displayName}>{user?.display_name || 'Membre'}</Text>
        <Text style={styles.cityText}>📍 {user?.city || 'Ville non renseignée'}</Text>

        {user?.bio ? (
          <Text style={styles.bioText}>« {user.bio} »</Text>
        ) : null}

        {/* Trust Badges Bar */}
        <View style={styles.trustBar}>
          <View style={[styles.badgeItem, user?.email_verified && styles.badgeActive]}>
            <Text style={styles.badgeText}>{user?.email_verified ? '✓ Email Vérifié' : '✕ Email non vérifié'}</Text>
          </View>

          <View style={[styles.badgeItem, (user?.phone_verified || (user?.phone && user.phone.length >= 8)) && styles.badgeActive]}>
            <Text style={styles.badgeText}>
              {user?.phone_verified || (user?.phone && user.phone.length >= 8) ? '✓ Téléphone Vérifié' : '✕ Téléphone non vérifié'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>⚙️ Éditer mon profil & photos</Text>
        </TouchableOpacity>
      </View>

      {/* Interests Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Centres d'intérêt</Text>
        <View style={styles.tagContainer}>
          {user?.interests && user.interests.length > 0 ? (
            user.interests.map(interest => (
              <View key={interest} style={styles.tagChip}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucun centre d'intérêt renseigné.</Text>
          )}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
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
  profileBox: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    marginBottom: 12,
  },
  displayName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  cityText: {
    color: '#22D3EE',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  bioText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  trustBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badgeItem: {
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  badgeText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '800',
  },
  editButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tagText: {
    color: '#F1F5F9',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 12,
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.4)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FB7185',
    fontWeight: '800',
    fontSize: 13,
  },
});
