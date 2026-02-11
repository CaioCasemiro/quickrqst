// Componentes do React Native usados na tela de login
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// Hook do expo-router para navegação (push, replace, back)
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
// Cliente Supabase para autenticação
import { supabase } from '../lib/supabase'; // Certifique-se de que o caminho está correto

// Tela de login da aplicação
export default function LoginScreen() {
  const router = useRouter();

  // Estados locais para o e-mail, senha e indicador de carregamento
  const [email, setEmail] = useState(''); // Supabase autentica por e-mail
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Função que realiza o login via Supabase
  const handleLogin = async () => {
    // Validação simples: campos obrigatórios
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    
    try {
      // Chamada ao SDK do Supabase para autenticar com e-mail e senha
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) {
        // Mostra mensagem amigável em caso de falha
        Alert.alert('Erro no Login', error.message);
      } else {
        // Login bem-sucedido: substitui a rota atual pela home
        router.replace('/home');
      }
    } catch (err) {
      // Erro inesperado genérico
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao tentar fazer login.');
    } finally {
      setLoading(false);
    }
  };

  // Renderiza o formulário de login
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>QUICKRQST</Text>

        <View style={styles.form}>
          {/* Campo de e-mail */}
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          {/* Campo de senha */}
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />

          {/* Botão de envio: mostra `ActivityIndicator` enquanto carrega */}
          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link/ação para recuperar senha (ainda não implementado) */}
          <TouchableOpacity style={styles.forgotPassword} disabled={loading}>
            <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1C74D4',
    textAlign: 'center',
    marginBottom: 60,
    letterSpacing: 1,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#1C74D4',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#1C74D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 60, // Garante que o ActivityIndicator não mude o tamanho do botão
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
