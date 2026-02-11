// Componentes do React Native para construção de interface e interação
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
// Hook do expo-router para navegação programática
import { useRouter } from 'expo-router';
// Ícones vetoriais usados na lista (seta, relógio, recibo)
import { ChevronLeft, Clock, Receipt } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
// Cliente Supabase para buscar dados do backend/local DB
import { supabase } from '../lib/supabase';

// Tipagem local para representar um pedido vindo do banco
interface Pedido {
  id: string;
  mesa: number;
  status: string;
  total: number;
  criado_em: string;
}

export default function HistoricoScreen() {
  // Router para navegação (voltar, abrir detalhes)
  const router = useRouter();
  // Estado local: lista de pedidos e indicador de carregamento
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  // Função que busca pedidos do Supabase ordenados por data de criação
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      if (data) setPedidos(data);
    } catch (error: any) {
      // Mostra um alerta amigável em caso de erro
      Alert.alert('Erro', 'Erro ao carregar histórico: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Chama a busca ao montar o componente (componenteDidMount)
  useEffect(() => {
    fetchPedidos();
  }, []);

  // Formata a data para o padrão pt-BR com hora minuto
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' - ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Retorna uma cor baseada no status do pedido (usada no badge)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente': return '#F59E0B';
      case 'entregue': return '#10B981';
      case 'cancelado': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Renderiza um item da lista (um pedido) como cartão clicável
  const renderPedido = ({ item }: { item: Pedido }) => (
    <TouchableOpacity
      style={styles.pedidoCard}
      onPress={() => router.push({
        pathname: '/detalhes-pedido',
        params: { pedidoId: item.id }
      })}
    >
      {/* Cabeçalho do cartão: mostra mesa e status */}
      <View style={styles.pedidoHeader}>
        <View style={styles.mesaBadge}>
          <Text style={styles.mesaText}>Mesa {item.mesa}</Text>
        </View>
        {/* Badge de status com cor de fundo semitransparente */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Corpo do cartão: data/hora e valor total */}
      <View style={styles.pedidoBody}>
        <View style={styles.infoRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.dataText}>{formatarData(item.criado_em)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Receipt size={16} color="#1C74D4" />
          <Text style={styles.totalText}>R$ {Number(item.total).toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico</Text>
        <TouchableOpacity onPress={fetchPedidos} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1C74D4" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderPedido}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>}
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
  refreshButton: { padding: 8 },
  refreshText: { color: '#1C74D4', fontWeight: '600' },
  listContainer: { padding: 16 },
  pedidoCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2
  },
  pedidoHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12
  },
  mesaBadge: { backgroundColor: '#1C74D4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  mesaText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },
  pedidoBody: { gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dataText: { color: '#6B7280', fontSize: 14 },
  totalText: { color: '#111827', fontSize: 16, fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6B7280' }
});
