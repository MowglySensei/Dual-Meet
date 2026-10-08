import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/supabase';
import { UserProfile } from '../types';

export const DiscoverScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadMembers = async () => {
    try {
      const realList = await api.getRealMembers(user?.id);
      setMembers(realList);
    } catch (e) {
      // fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMembers();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#06B6D4" />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Découvrir les membres</Text>
        <Text style={styles.subtitle}>
          Trouvez de vraies personnes qui partagent vos passions et vos centres d'intérêt.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#06B6D4" style={{ marginVertical: 40 }} />
      ) : members.length > 0 ? (
        members.map(member => {
          const common = member.interests?.filter(i => user?.interests?.includes(i)) || [];

          return (
            <View key={member.id} style={styles.memberCard}>
              <Image
                source={{ uri: member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' }}
                style={styles.avatar}
              />

              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.display_name}</Text>
                <Text style={styles.memberCity}>📍 {member.city || 'Ville non renseignée'}</Text>

                {common.length > 0 && (
                  <Text style={styles.commonText}>
                    ✨ {common.length} centre(s) d'intérêt en commun
                  </Text>
                )}

                {member.bio ? (
                  <Text style={styles.bioText} numberOfLines={2}>
                    « {member.bio} »
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('UserProfile', { id: member.id })}
              >
                <Text style={styles.profileButtonText}>Profil</Text>
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🤝</Text>
          <Text style={styles.emptyTitle}>Vous êtes le pionnier de votre région !</Text>
          <Text style={styles.emptySubtitle}>
            Il n'y a pas encore d'autres membres inscrits autour de vous. Invitez vos amis pour démarrer la communauté !
          </Text>
        </View>
      )}

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
  header: {
    marginBottom: 20,
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
    lineHeight: 16,
  },
  memberCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  memberCity: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  commonText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  bioText: {
    color: '#94A3B8',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  profileButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  profileButtonText: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '800',
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
