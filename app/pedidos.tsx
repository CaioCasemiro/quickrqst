import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';


interface Pedido {
  id: string;
  mesa: number;
  itens: string[];
  status: 'preparando' | 'entregue' | 'cancelado';
  total: number;
  hora: string;
}

export default function PedidosScreen() {
  const router = useRouter();
  const [expandido, setExpandido] = useState<string | null>(null);

  const pedidos: Pedido[] = [
    {
      id: '1',
      mesa: 1,
      itens: ['2x Refrigerante', '1x Hambúrguer'],
      status: 'preparando',
      total: 28.0,
      hora: '14:32',
    },
    {
      id: '2',
      mesa: 3,
      itens: ['1x Suco Natural', '2x Batata Frita'],
      status: 'preparando',
      total: 31.0,
      hora: '14:28',
    },
    {
      id: '3',
      mesa: 5,
      itens: ['3x Água', '1x Sanduíche'],
      status: 'entregue',
      total: 22.0,
      hora: '14:15',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparando':
        return '#F59E0B';
      case 'entregue':
        return '#10B981';
      case 'cancelado':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'preparando':
        return 'Preparando';
      case 'entregue':
        return 'Entregue';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const renderPedido = ({ item }: { item: Pedido }) => {
    const isExpanded = expandido === item.id;

    return (
      <TouchableOpacity
        style={styles.pedidoCard}
        onPress={() => setExpandido(isExpanded ? null : item.id)}
      >
        <View style={styles.pedidoHeader}>
          <View style={styles.pedidoInfo}>
            <Text style={styles.mesaLabel}>Mesa</Text>
            <Text style={styles.mesaNumero}>{item.mesa}</Text>
          </View>

          <View style={styles.pedidoDetails}>
            <Text style={styles.pedidoItens}>{item.itens.length} itens</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
            </View>
          </View>

          <View style={styles.pedidoTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {item.total.toFixed(2)}</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.pedidoExpanded}>
            <View style={styles.divider} />
            <View style={styles.itensList}>
              {item.itens.map((itemText, index) => (
                <Text key={index} style={styles.itemText}>
                  • {itemText}
                </Text>
              ))}
            </View>
            <Text style={styles.horaText}>Pedido às {item.hora}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push({
                  pathname: '/detalhes-pedido',
                  params: { pedidoId: item.id },
                })}
              >
                <Text style={styles.actionButtonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Pedidos Ativos</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Lista de Pedidos */}
      <FlatList
        data={pedidos}
        renderItem={renderPedido}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  pedidoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pedidoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  pedidoInfo: {
    alignItems: 'center',
    minWidth: 60,
  },
  mesaLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  mesaNumero: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C74D4',
  },
  pedidoDetails: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  pedidoItens: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pedidoTotal: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C74D4',
  },
  pedidoExpanded: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  itensList: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  horaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1C74D4',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
