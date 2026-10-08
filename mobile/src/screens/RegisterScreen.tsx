import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterScreen = ({ navigation }: any) => {
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async () => {
    if (!displayName || !email || !password || !phone) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    setLoading(true);
    const result = await signup(displayName, email, '1998-05-14', password, phone);
    setLoading(false);

    if (result.success) {
      if (result.requiresEmailConfirmation) {
        showToast('Lien de confirmation e-mail envoyé par Supabase !', 'info');
      } else {
        showToast('Compte vérifié créé avec succès ! Bienvenue.', 'success');
      }
    } else {
      showToast("Erreur lors de l'inscription.", 'error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logoText}>✦ DUAL MEET</Text>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez la communauté 100% amicale</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Prénom ou Pseudonyme *</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Ex: Camille, Thomas..."
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Adresse e-mail *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="votre.email@exemple.com"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Numéro de téléphone mobile *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="06 12 34 56 78"
            placeholderTextColor="#64748B"
          />
          <Text style={styles.phoneHint}>🛡️ Anti-faux comptes : garantit 100% de membres réels.</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Mot de passe *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#64748B"
          />
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signupButtonText}>Créer mon compte vérifié</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
        <Text style={styles.loginText}>Déjà inscrit ? <Text style={styles.loginHighlight}>Se connecter</Text></Text>
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
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logoText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 6,
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
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0B0F17',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  phoneHint: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  signupButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  loginHighlight: {
    color: '#22D3EE',
    fontWeight: '800',
  },
});
