import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';



interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export default function NovoPedidoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mesaNumero = params.mesaNumero;

  const [categoria, setCategoria] = useState('bebidas');
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);

  const categorias = [
    { id: 'bebidas', nome: 'Bebidas' },
    { id: 'porcoes', nome: 'Porções' },
    { id: 'lanches', nome: 'Lanches' },
    { id: 'pratos', nome: 'Pratos' },
  ];

  const produtos: Record<string, Array<{ id: string; nome: string; preco: number }>> = {
    bebidas: [
      { id: '1', nome: 'Refrigerante', preco: 5.0 },
      { id: '2', nome: 'Suco Natural', preco: 7.0 },
      { id: '3', nome: 'Água', preco: 2.0 },
    ],
    porcoes: [
      { id: '4', nome: 'Batata Frita', preco: 12.0 },
      { id: '5', nome: 'Onion Rings', preco: 14.0 },
    ],
    lanches: [
      { id: '6', nome: 'Hambúrguer', preco: 18.0 },
      { id: '7', nome: 'Sanduíche', preco: 16.0 },
    ],
    pratos: [
      { id: '8', nome: 'Frango Grelhado', preco: 35.0 },
      { id: '9', nome: 'Peixe à Milanesa', preco: 38.0 },
    ],
  };

  const adicionarAoCarrinho = (produto: { id: string; nome: string; preco: number }) => {
    const itemExistente = carrinho.find((item) => item.id === produto.id);

    if (itemExistente) {
      setCarrinho(
        carrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([
        ...carrinho,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
        },
      ]);
    }
  };

  const removerDoCarrinho = (id: string) => {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  };

  const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  const handleConfirmar = () => {
    if (carrinho.length === 0) {
      alert('Adicione itens ao carrinho');
      return;
    }
    router.push({
      pathname: '/confirmacao',
      params: {
        mesaNumero,
        carrinho: JSON.stringify(carrinho),
        total: total.toFixed(2),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Mesa {mesaNumero}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriasScroll}
        contentContainerStyle={styles.categoriasContainer}
      >
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoriaButton,
              categoria === cat.id && styles.categoriaButtonActive,
            ]}
            onPress={() => setCategoria(cat.id)}
          >
            <Text
              style={[
                styles.categoriaText,
                categoria === cat.id && styles.categoriaTextActive,
              ]}
            >
              {cat.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Produtos */}
      <FlatList
        data={produtos[categoria]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.produtoCard}
            onPress={() => adicionarAoCarrinho(item)}
          >
            <View style={styles.produtoInfo}>
              <Text style={styles.produtoNome}>{item.nome}</Text>
              <Text style={styles.produtoPreco}>R$ {item.preco.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => adicionarAoCarrinho(item)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
        style={styles.produtosList}
      />

      {/* Carrinho Fixo */}
      <View style={styles.carrinhoFooter}>
        {carrinho.length > 0 && (
          <View style={styles.carrinhoPreview}>
            <ScrollView style={styles.carrinhoItems} showsVerticalScrollIndicator={false}>
              {carrinho.map((item) => (
                <View key={item.id} style={styles.carrinhoItem}>
                  <View style={styles.carrinhoItemInfo}>
                    <Text style={styles.carrinhoItemNome}>
                      {item.quantidade}x {item.nome}
                    </Text>
                    <Text style={styles.carrinhoItemPreco}>
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removerDoCarrinho(item.id)}>
                    <Text style={styles.removerButton}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.carrinhoTotal}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{carrinho.length} itens</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmarButton, carrinho.length === 0 && styles.buttonDisabled]}
              onPress={handleConfirmar}
              disabled={carrinho.length === 0}
            >
              <Text style={styles.confirmarButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  categoriasScroll: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriasContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoriaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriaButtonActive: {
    backgroundColor: '#1C74D4',
    borderColor: '#1C74D4',
  },
  categoriaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoriaTextActive: {
    color: '#FFFFFF',
  },
  produtosList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  produtoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  produtoPreco: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C74D4',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C74D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  carrinhoFooter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  carrinhoPreview: {
    maxHeight: 100,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  carrinhoItems: {
    padding: 8,
  },
  carrinhoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  carrinhoItemInfo: {
    flex: 1,
  },
  carrinhoItemNome: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  carrinhoItemPreco: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  removerButton: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '700',
    marginLeft: 8,
  },
  carrinhoTotal: {
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C74D4',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmarButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1C74D4',
    alignItems: 'center',
  },
  confirmarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
