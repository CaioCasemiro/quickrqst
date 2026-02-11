// Componentes básicos do React Native usados para estruturar a UI
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// Hooks do expo-router: `useRouter` para navegar e `useLocalSearchParams`
// para obter parâmetros passados via rota (query params / params locais).
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
// Header customizado da aplicação
import Header from '@/components/header/header';
// Modelo (tipo) do item de pedido — usado para tipagem do carrinho
import { ItemPedidoModel } from '@/models/ItemPedido';
// Componente que renderiza cada item do pedido na lista
import ItemPedido from '@/components/ItemPedido/ItemPedido';



// Tela de confirmação de pedido — exibe mesa, itens e total antes de finalizar.
export default function ConfirmacaoScreen() {
  // Router para navegação programática
  const router = useRouter();
  // Obtém parâmetros passados para esta rota (ex.: mesaNumero, carrinho, total)
  const params = useLocalSearchParams();

  // Parâmetros esperados (vêm como strings via rota). Use nomes iguais
  // aos definidos onde a rota é chamada.
  const mesaNumero = params.mesaNumero;
  const carrinhoJSON = params.carrinho as string;
  const total = params.total as string;

  // Converte o JSON do carrinho em um array de `ItemPedidoModel`.
  // Se não existir `carrinho`, inicia como array vazio.
  const carrinho: ItemPedidoModel[] = carrinhoJSON ? JSON.parse(carrinhoJSON) : [];

  // Função chamada ao finalizar o pedido: notifica e navega para a home.
  const handleFinalizar = () => {
    alert('Pedido finalizado com sucesso!');
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      {/* Header da tela com título personalizado */}
      <Header titulo="Confirmar pedido" />

      {/* Conteúdo rolável: mesa, itens e resumo de preços */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Cartão com número da mesa */}
        <View style={styles.mesaCard}>
          <Text style={styles.mesaLabel}>Mesa</Text>
          <Text style={styles.mesaNumero}>{mesaNumero}</Text>
        </View>

        {/* Lista de itens do pedido — usa o componente `ItemPedido` para cada item */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens do Pedido</Text>
          {carrinho.map((item) => (
            <ItemPedido key={item.id} item={item} />
          ))}
        </View>

        {/* Resumo de valores: subtotal e total */}
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

      {/* Área de ações (rodapé) com botões para editar ou finalizar o pedido */}
      <View style={styles.footer}>
        {/* Volta para a tela anterior para editar o pedido */}
        <TouchableOpacity style={styles.editarButton} onPress={() => router.back()}>
          <Text style={styles.editarButtonText}>Editar Pedido</Text>
        </TouchableOpacity>

        {/* Finaliza o pedido e navega para a home */}
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
