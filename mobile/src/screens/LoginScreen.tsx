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

export const LoginScreen = ({ navigation }: any) => {
  const { login, authError } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Veuillez remplir votre e-mail et mot de passe.', 'error');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      showToast('Connexion réussie ! Bienvenue.', 'success');
    } else {
      showToast(authError || 'Erreur de connexion.', 'error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logoText}>✦ DUAL MEET</Text>
        <Text style={styles.title}>Connexion Membre</Text>
        <Text style={styles.subtitle}>Moins de matchs. Plus de moments.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Adresse e-mail</Text>
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
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#64748B"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Se connecter</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
        <Text style={styles.registerText}>Pas encore de compte ? <Text style={styles.registerHighlight}>Créer un compte</Text></Text>
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
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
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
  loginButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  registerHighlight: {
    color: '#22D3EE',
    fontWeight: '800',
  },
});
