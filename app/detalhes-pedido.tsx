import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Clock, MapPin, ClipboardList } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ItemPedido {
  nome: string;
  quantidade: number;
  preco_unitario: number;
}

interface Pedido {
  id: string;
  mesa: number;
  status: string;
  total: number;
  criado_em: string;
  itens_json?: string;
}

export default function DetalhesPedidoScreen() {
  const router = useRouter();
  const { pedidoId } = useLocalSearchParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPedido = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', pedidoId)
        .single();

      if (error) throw error;
      setPedido(data);
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pedidoId) fetchPedido();
  }, [pedidoId]);

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar Pedido',
      'Tem certeza que deseja cancelar este pedido permanentemente?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('pedidos')
                .update({ status: 'cancelado' })
                .eq('id', pedidoId);

              if (error) throw error;
              Alert.alert('Sucesso', 'Pedido cancelado.');
              router.back();
            } catch (error: any) {
              Alert.alert('Erro', error.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C74D4" />
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Pedido não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: '#1C74D4' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const itens: ItemPedido[] = pedido.itens_json ? JSON.parse(pedido.itens_json) : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Pedido</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconInfo}>
              <MapPin size={20} color="#1C74D4" />
              <Text style={styles.infoLabel}>Mesa</Text>
            </View>
            <Text style={styles.infoValue}>{pedido.mesa}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconInfo}>
              <Clock size={20} color="#1C74D4" />
              <Text style={styles.infoLabel}>Horário</Text>
            </View>
            <Text style={styles.infoValue}>
              {new Date(pedido.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconInfo}>
              <ClipboardList size={20} color="#1C74D4" />
              <Text style={styles.infoLabel}>Status</Text>
            </View>
            <View style={[styles.badge, pedido.status === 'pronto' ? styles.badgePronto : styles.badgePendente]}>
              <Text style={styles.badgeText}>{pedido.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens</Text>
          {itens.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemMain}>
                <Text style={styles.itemQtd}>{item.quantidade}x</Text>
                <Text style={styles.itemNome}>{item.nome}</Text>
              </View>
              <Text style={styles.itemPreco}>R$ {(item.preco_unitario * item.quantidade).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {Number(pedido.total).toFixed(2)}</Text>
          </View>
        </View>

        {pedido.status !== 'entregue' && pedido.status !== 'cancelado' && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
            <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  content: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  iconInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  infoValue: { fontSize: 16, fontWeight: '700', color: '#111827' },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgePendente: { backgroundColor: '#FEF3C7' },
  badgePronto: { backgroundColor: '#D1FAE5' },
  badgeText: { fontSize: 12, fontWeight: '800', color: '#92400E' },
  section: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemQtd: { fontSize: 16, fontWeight: '800', color: '#1C74D4' },
  itemNome: { fontSize: 16, color: '#111827', fontWeight: '500' },
  itemPreco: { fontSize: 16, color: '#6B7280' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#111827' },
  totalValue: { fontSize: 22, fontWeight: '800', color: '#1C74D4' },
  cancelButton: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginTop: 10
  },
  cancelButtonText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
  backBtn: { marginTop: 20, padding: 10 }
});
