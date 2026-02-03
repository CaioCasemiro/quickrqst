import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import Header from '@/components/header/header';
import { ItemPedidoModel } from '@/models/ItemPedido';
import ItemPedido from '@/components/ItemPedido/ItemPedido';



export default function ConfirmacaoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mesaNumero = params.mesaNumero;
  const carrinhoJSON = params.carrinho as string;
  const total = params.total as string;

  const carrinho: ItemPedidoModel[] = carrinhoJSON ? JSON.parse(carrinhoJSON) : [];

  const handleFinalizar = () => {
    alert('Pedido finalizado com sucesso!');
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header titulo="Confirmar pedido" />


      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Mesa */}
        <View style={styles.mesaCard}>
          <Text style={styles.mesaLabel}>Mesa</Text>
          <Text style={styles.mesaNumero}>{mesaNumero}</Text>
        </View>

        {/* Itens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens do Pedido</Text>
          {carrinho.map((item) => (
            <ItemPedido key={item.id} item={item} />
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>R$ {total}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>R$ {total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botões */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.editarButton} onPress={() => router.back()}>
          <Text style={styles.editarButtonText}>Editar Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finalizarButton} onPress={handleFinalizar}>
          <Text style={styles.finalizarButtonText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  mesaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  mesaLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  mesaNumero: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1C74D4',
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  totalCard: {
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  finalTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C74D4',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  editarButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  editarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  finalizarButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1C74D4',
    alignItems: 'center',
  },
  finalizarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
