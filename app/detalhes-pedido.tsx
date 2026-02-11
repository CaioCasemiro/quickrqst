// Componentes básicos do React Native para estrutura e interação
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// Hooks do expo-router: `useRouter` para navegação e `useLocalSearchParams`
// para acessar parâmetros locais/consulta da rota (ex.: pedidoId)
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
// Componentes personalizados da aplicação
import Header from '@/components/header/header';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import ItemPedido from '@/components/ItemPedido/ItemPedido';
// Serviço que busca um pedido por ID (aqui usado como mock/local)
import { buscarPedidoPorId } from '@/services/pedidoService';



// Tela que exibe os detalhes de um pedido específico
export default function DetalhesPedidoScreen() {
  // Router para navegação programática (voltar, mudar de tela, etc.)
  const router = useRouter();
  // Parâmetros passados para a rota (esperamos `pedidoId` por exemplo)
  const params = useLocalSearchParams();
  const pedidoId = params.pedidoId;

  // Aqui usamos um serviço local/mock `buscarPedidoPorId` para obter os dados
  // do pedido pelo ID. Em um app real, isso faria uma chamada HTTP/async.
  const pedido = buscarPedidoPorId(pedidoId as string);

  // Se não houver pedido com esse ID, mostramos uma mensagem simples.
  if (!pedido) {
    return <Text>Pedido não encontrado</Text>;
  }

  // Handler que simula reenvio do pedido para a cozinha
  const handleReenviar = () => {
    alert('Pedido reenviado para a cozinha!');
  };

  // Handler de cancelamento. Observação: `confirm` é uma função global do
  // navegador; em React Native isso não existe por padrão — aqui está
  // presumido como mock/simple. Em produção, substituir por Alert.alert.
  const handleCancelar = () => {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      alert('Pedido cancelado');
      router.back();
    }
  };
 
  return (
    <View style={styles.container}>
      {/* Header com título */}
      <Header titulo="Detalhes do pedido" />

      {/* Conteúdo principal rolável */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Cartão com informações principais do pedido (ID, mesa, status, hora) */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pedido #</Text>
            <Text style={styles.infoValue}>{pedido.id}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mesa</Text>
            <Text style={styles.infoValue}>{pedido.mesa}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            {/* `StatusBadge` mostra visualmente o status (ex.: Pendente, Pronto) */}
            <StatusBadge status={pedido.status} />
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hora</Text>
            <Text style={styles.infoValue}>{pedido.hora}</Text>
          </View>
        </View>

        {/* Lista de itens do pedido: usamos o componente `ItemPedido` */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens</Text>
          {pedido.itens.map((item, index) => (
            <ItemPedido key={index} item={item} />
          ))}
        </View>

        {/* Observações do pedido, se houver */}
        {pedido.observacoes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <View style={styles.observacoesBox}>
              <Text style={styles.observacoesText}>{pedido.observacoes}</Text>
            </View>
          </View>
        )}

        {/* Resumo do total */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {pedido.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botões de ação no rodapé: reenviar e cancelar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.reenviButton} onPress={handleReenviar}>
          <Text style={styles.reenviButtonText}>Reenviar para Cozinha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
          <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
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
  infoCard: {
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemQtd: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemPreco: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C74D4',
  },
  observacoesBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#1C74D4',
  },
  observacoesText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
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
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
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
  reenviButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1C74D4',
    alignItems: 'center',
  },
  reenviButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
