// Componentes do React Native para estrutura e interação
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
// Hook do expo-router para navegação programática
import { useRouter } from 'expo-router';
// Ícones usados na tela (voltar, confirmar, cancelar, relógio)
import { ChevronLeft, CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
// Cliente Supabase para operações nas tabelas `pedidos` e `mesas`
import { supabase } from '../lib/supabase';

// Tipagem local para representar os pedidos retornados do banco
interface Pedido {
  id: string;
  mesa: number;
  status: string;
  total: number;
  criado_em: string;
}

// Componente que lista pedidos ativos (pendentes / em preparo)
export default function PedidosAtivosScreen() {
  // Router para ações de navegação (voltar, etc.)
  const router = useRouter();
  // Estado com lista de pedidos e flag de carregamento
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca pedidos ativos no Supabase (status pendente ou em preparo)
  const fetchPedidosAtivos = async () => {
    try {
      setLoading(true);
      // Buscamos apenas pedidos que NÃO foram finalizados (entregue/cancelado)
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .in('status', ['pendente', 'em preparo'])
        .order('criado_em', { ascending: true });

      if (error) throw error;
      if (data) setPedidos(data);
    } catch (error: any) {
      // Mostra alerta amigável em caso de falha na requisição
      Alert.alert('Erro', 'Erro ao carregar pedidos ativos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os pedidos ao montar o componente
  useEffect(() => {
    fetchPedidosAtivos();
  }, []);

  // Atualiza o status de um pedido e, se for finalizado, libera a mesa
  const atualizarStatus = async (pedido: Pedido, novoStatus: string) => {
    try {
      // 1) Atualiza o status do pedido na tabela `pedidos`
      const { error: erroPedido } = await supabase
        .from('pedidos')
        .update({ status: novoStatus })
        .eq('id', pedido.id);

      if (erroPedido) throw erroPedido;

      // 2) Se o pedido terminou (entregue ou cancelado), atualiza a mesa para `ativa=true`
      if (novoStatus === 'entregue' || novoStatus === 'cancelado') {
        const { error: erroMesa } = await supabase
          .from('mesas')
          .update({ ativa: true })
          .eq('numero', pedido.mesa); // Usando o número da mesa como referência

        if (erroMesa) throw erroMesa;
      }

      // Notifica o usuário e recarrega a lista de pedidos
      Alert.alert('Sucesso', `Pedido da Mesa ${pedido.mesa} marcado como ${novoStatus}.`);
      fetchPedidosAtivos();
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível atualizar: ' + error.message);
    }
  };

  // Renderiza o cartão de cada pedido na lista
  const renderPedido = ({ item }: { item: Pedido }) => (
    <View style={styles.pedidoCard}>
      <View style={styles.pedidoHeader}>
        <View style={styles.mesaInfo}>
          {/* Número da mesa e horário do pedido */}
          <Text style={styles.mesaLabel}>Mesa {item.mesa}</Text>
          <View style={styles.timeRow}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.timeText}>
              {new Date(item.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        {/* Valor total do pedido */}
        <Text style={styles.totalText}>R$ {Number(item.total).toFixed(2)}</Text>
      </View>

      {/* Botões de ação: cancelar ou marcar como entregue */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.cancelBtn]} 
          onPress={() => atualizarStatus(item, 'cancelado')}
        >
          <XCircle size={20} color="#EF4444" />
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.doneBtn]} 
          onPress={() => atualizarStatus(item, 'entregue')}
        >
          <CheckCircle2 size={20} color="#FFF" />
          <Text style={styles.doneText}>Entregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render principal do componente
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" />
        </TouchableOpacity>
        <Text style={styles.title}>Pedidos Ativos</Text>
        <TouchableOpacity onPress={fetchPedidosAtivos} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </TouchableOpacity>
      </View>

      {/* Se estiver carregando, mostra indicador; caso contrário exibe a lista */}
      {loading ? (
        <ActivityIndicator size="large" color="#1C74D4" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderPedido}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Não há pedidos pendentes no momento. ☕</Text>
            </View>
          }
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
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  pedidoHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12
  },
  mesaInfo: { gap: 4 },
  mesaLabel: { fontSize: 22, fontWeight: '800', color: '#1C74D4' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 14, color: '#6B7280' },
  totalText: { fontSize: 20, fontWeight: '700', color: '#111827' },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    borderRadius: 10,
    gap: 8
  },
  cancelBtn: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  cancelText: { color: '#EF4444', fontWeight: '700' },
  doneBtn: { backgroundColor: '#10B981' },
  doneText: { color: '#FFF', fontWeight: '700' },
  emptyContainer: { marginTop: 60, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center' }
});
