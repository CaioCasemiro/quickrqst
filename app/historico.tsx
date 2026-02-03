import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header/header';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import { PedidoHistorico } from '@/models/PedidoHistorico';
import { buscarPedidosHistorico } from '@/services/pedidoService';

const pedidos: PedidoHistorico[] = buscarPedidosHistorico();


export default function HistoricoScreen() {
  const router = useRouter();

  const renderPedido = ({ item }: { item: PedidoHistorico }) => (
    <TouchableOpacity
      style={styles.pedidoCard}
      onPress={() => router.push({
        pathname: '/detalhes-pedido',
        params: { pedidoId: item.id },
      })}
    >
      <View style={styles.pedidoContent}>
        <View style={styles.pedidoLeft}>
          <Text style={styles.mesaLabel}>Mesa {item.mesa}</Text>
          <Text style={styles.itensLabel}>{item.itens} itens</Text>
        </View>

        <View style={styles.pedidoCenter}>
          <Text style={styles.dataLabel}>{item.data}</Text>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.pedidoRight}>
          <Text style={styles.totalValue}>R$ {item.total.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header titulo="Histórico" />


      {/* Lista de Pedidos */}
      <FlatList<PedidoHistorico>
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Text>{item.data}</Text>
          </TouchableOpacity>
        )}
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pedidoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pedidoLeft: {
    minWidth: 70,
  },
  mesaLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C74D4',
    marginBottom: 4,
  },
  itensLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  pedidoCenter: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  pedidoRight: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C74D4',
  },
});
