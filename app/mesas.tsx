// Componentes básicos do React Native usados para construir a UI
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
// Hook do expo-router para navegação programática entre telas
import { useRouter } from 'expo-router';
// Ícones vetoriais (seta para voltar, ícone de usuários/mesas)
import { ChevronLeft, Users } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
// Cliente Supabase para acessar dados (tabela `mesas`)
import { supabase } from '../lib/supabase';

// Tipagem local para representar uma mesa vinda do banco de dados
interface Mesa {
  id: string;
  numero: number;
  ativa: boolean; // true = livre, false = ocupada
}

export default function MesasScreen() {
  // Router para navegação (ex.: abrir novo pedido, voltar)
  const router = useRouter();
  // Estado local: lista de mesas e indicador de loading enquanto busca dados
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);

  // Função que busca as mesas da tabela `mesas` no Supabase, ordenando
  // pelo número da mesa. Em caso de erro, exibe alerta.
  const fetchMesas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mesas')
        .select('*')
        .order('numero', { ascending: true });

      if (error) throw error;
      if (data) setMesas(data);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar mesas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Carrega as mesas ao montar o componente
  useEffect(() => {
    fetchMesas();
  }, []);

  // Renderiza cada cartão de mesa. Se a mesa estiver `ativa` (livre), ao
  // tocar navega para a tela de novo pedido passando o id e número da mesa.
  // Se não estiver ativa, exibe um alerta informando que já há pedido.
  const renderMesa = ({ item }: { item: Mesa }) => (
    <TouchableOpacity
      style={[styles.mesaCard, !item.ativa && styles.mesaInativa]}
      onPress={() => {
        if (item.ativa) {
          router.push({
            pathname: '/novo-pedido',
            params: { mesaId: item.id, mesaNumero: item.numero }
          });
        } else {
          Alert.alert('Mesa Ocupada', 'Esta mesa já possui um pedido em aberto.');
        }
      }}
    >
      {/* Ícone representando a mesa; cor muda conforme status */}
      <View style={styles.mesaIcon}>
        <Users size={24} color={item.ativa ? '#1C74D4' : '#9CA3AF'} />
      </View>

      {/* Número da mesa; estilo muda se inativa */}
      <Text style={[styles.mesaNumero, !item.ativa && styles.textInativo]}>Mesa {item.numero}</Text>

      {/* Badge visual indicando se a mesa está livre ou ocupada */}
      <View style={[styles.statusBadge, { backgroundColor: item.ativa ? '#D1FAE5' : '#FEE2E2' }]}>
        <Text style={[styles.statusText, { color: item.ativa ? '#059669' : '#EF4444' }]}>
          {item.ativa ? 'Livre' : 'Ocupada'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" />
        </TouchableOpacity>
        <Text style={styles.title}>Mesas</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1C74D4" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={mesas}
          renderItem={renderMesa}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma mesa cadastrada no banco.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 50
  },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  listContainer: { padding: 16 },
  columnWrapper: { justifyContent: 'space-between' },
  mesaCard: { 
    backgroundColor: '#FFF', 
    width: '48%', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2
  },
  mesaInativa: { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' },
  mesaIcon: { marginBottom: 12 },
  mesaNumero: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  textInativo: { color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6B7280' }
});
