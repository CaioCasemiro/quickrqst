import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Plus, Minus, ShoppingCart } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  ativo: boolean;
}

interface ItemPedido {
  produto_id: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
}

export default function NovoPedidoScreen() {
  const router = useRouter();
  const { mesaId, mesaNumero } = useLocalSearchParams();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<ItemPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      if (data) setProdutos(data);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar cardápio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.produto_id === produto.id);
      if (itemExistente) {
        return prev.map(item =>
          item.produto_id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, {
        produto_id: produto.id,
        nome: produto.nome,
        quantidade: 1,
        preco_unitario: produto.preco
      }];
    });
  };

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho(prev => {
      const item = prev.find(i => i.produto_id === produtoId);
      if (item && item.quantidade > 1) {
        return prev.map(i => i.produto_id === produtoId ? { ...i, quantidade: i.quantidade - 1 } : i);
      }
      return prev.filter(i => i.produto_id !== produtoId);
    });
  };

  const totalPedido = carrinho.reduce((acc, item) => acc + (item.preco_unitario * item.quantidade), 0);

  const handleFinalizarPedido = async () => {
    if (carrinho.length === 0) {
      Alert.alert('Carrinho Vazio', 'Adicione pelo menos um item ao pedido.');
      return;
    }

    setEnviando(true);
    try {
      // 1. Criar o pedido na tabela 'pedidos'
      // Adicionamos o campo 'itens_json' para salvar a lista de itens de forma simples
      const { data: pedidoCriado, error: erroPedido } = await supabase
        .from('pedidos')
        .insert({
          mesa: Number(mesaNumero),
          status: 'pendente',
          total: totalPedido,
          itens_json: JSON.stringify(carrinho) // Salvando os itens como JSON
        })
        .select()
        .single();

      if (erroPedido) throw erroPedido;

      // 2. Atualizar a mesa para ocupada
      const { error: erroMesa } = await supabase
        .from('mesas')
        .update({ ativa: false })
        .eq('id', mesaId);

      if (erroMesa) throw erroMesa;

      Alert.alert('Sucesso', 'Pedido enviado para a cozinha!', [
        { text: 'OK', onPress: () => router.replace('/home') }
      ]);
    } catch (error: any) {
      Alert.alert('Erro ao finalizar', error.message);
    } finally {
      setEnviando(false);
    }
  };

  const renderProduto = ({ item }: { item: Produto }) => {
    const qtdNoCarrinho = carrinho.find(i => i.produto_id === item.id)?.quantidade || 0;

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoPreco}>R$ {Number(item.preco).toFixed(2)}</Text>
        </View>

        <View style={styles.controles}>
          {qtdNoCarrinho > 0 && (
            <>
              <TouchableOpacity onPress={() => removerDoCarrinho(item.id)} style={styles.btnMinus}>
                <Minus size={20} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.qtdText}>{qtdNoCarrinho}</Text>
            </>
          )}
          <TouchableOpacity onPress={() => adicionarAoCarrinho(item)} style={styles.btnAdd}>
            <Plus size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" />
        </TouchableOpacity>
        <Text style={styles.title}>Mesa {mesaNumero}</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1C74D4" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={produtos}
          renderItem={renderProduto}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto disponível.</Text>}
        />
      )}

      {carrinho.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {totalPedido.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.finalizarBtn, enviando && { opacity: 0.7 }]}
            onPress={handleFinalizarPedido}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <ShoppingCart size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.finalizarText}>Confirmar Pedido</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  listContainer: { padding: 16, paddingBottom: 120 },
  produtoCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  produtoInfo: { flex: 1 },
  produtoNome: { fontSize: 16, fontWeight: '600', color: '#111827' },
  produtoPreco: { fontSize: 14, color: '#1C74D4', fontWeight: '700', marginTop: 4 },
  controles: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnAdd: { backgroundColor: '#1C74D4', padding: 8, borderRadius: 8 },
  btnMinus: { backgroundColor: '#FEE2E2', padding: 8, borderRadius: 8 },
  qtdText: { fontSize: 16, fontWeight: '700', color: '#111827', minWidth: 20, textAlign: 'center' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 10
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 16, color: '#6B7280' },
  totalValue: { fontSize: 22, fontWeight: '700', color: '#1C74D4' },
  finalizarBtn: {
    backgroundColor: '#1C74D4',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  finalizarText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6B7280' }
});
