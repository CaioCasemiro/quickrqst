import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, Trash2, Edit } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  ativo: boolean;
}

export default function ProdutosScreen() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([
    { id: '1', nome: 'Refrigerante', categoria: 'Bebidas', preco: 5.0, ativo: true },
    { id: '2', nome: 'Suco Natural', categoria: 'Bebidas', preco: 7.0, ativo: true },
    { id: '3', nome: 'Hambúrguer', categoria: 'Lanches', preco: 18.0, ativo: false },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [form, setForm] = useState({
    nome: '',
    categoria: 'Bebidas',
    preco: '',
  });

  const categorias = ['Bebidas', 'Porções', 'Lanches', 'Pratos'];

  const handleAbrirModal = (produto?: Produto) => {
    if (produto) {
      setEditando(produto);
      setForm({
        nome: produto.nome,
        categoria: produto.categoria,
        preco: produto.preco.toString(),
      });
    } else {
      setEditando(null);
      setForm({ nome: '', categoria: 'Bebidas', preco: '' });
    }
    setModalVisible(true);
  };

  const handleSalvar = () => {
    if (!form.nome || !form.preco) {
      alert('Preencha todos os campos');
      return;
    }

    if (editando) {
      setProdutos(
        produtos.map((p) =>
          p.id === editando.id
            ? {
                ...p,
                nome: form.nome,
                categoria: form.categoria,
                preco: parseFloat(form.preco),
              }
            : p
        )
      );
    } else {
      const novoProduto: Produto = {
        id: Date.now().toString(),
        nome: form.nome,
        categoria: form.categoria,
        preco: parseFloat(form.preco),
        ativo: true,
      };
      setProdutos([...produtos, novoProduto]);
    }

    setModalVisible(false);
  };

  const handleDeletar = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      setProdutos(produtos.filter((p) => p.id !== id));
    }
  };

  const handleToggleAtivo = (id: string) => {
    setProdutos(
      produtos.map((p) =>
        p.id === id ? { ...p, ativo: !p.ativo } : p
      )
    );
  };

  const renderProduto = ({ item }: { item: Produto }) => (
    <View style={styles.produtoCard}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <View style={styles.produtoMeta}>
          <Text style={styles.categoria}>{item.categoria}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.ativo ? '#DBEAFE' : '#FEE2E2' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.ativo ? '#1C74D4' : '#EF4444' },
              ]}
            >
              {item.ativo ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.produtoPreco}>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
      </View>

      <View style={styles.produtoActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleAtivo(item.id)}
        >
          <View
            style={[
              styles.toggleButton,
              { backgroundColor: item.ativo ? '#10B981' : '#9CA3AF' },
            ]}
          >
            <Text style={styles.toggleText}>{item.ativo ? '✓' : '✕'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAbrirModal(item)}
        >
          <Edit size={20} color="#1C74D4" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeletar(item.id)}
        >
          <Trash2 size={20} color="#EF4444" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Produtos</Text>
        <TouchableOpacity
          onPress={() => handleAbrirModal()}
          style={styles.addButton}
        >
          <Plus size={28} color="#1C74D4" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Lista de Produtos */}
      <FlatList
        data={produtos}
        renderItem={renderProduto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={true}
      />

      {/* Modal de Edição */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editando ? 'Editar Produto' : 'Novo Produto'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome do produto"
                value={form.nome}
                onChangeText={(text) => setForm({ ...form, nome: text })}
              />

              <Text style={styles.label}>Categoria</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriasScroll}
              >
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoriaOption,
                      form.categoria === cat && styles.categoriaOptionActive,
                    ]}
                    onPress={() => setForm({ ...form, categoria: cat })}
                  >
                    <Text
                      style={[
                        styles.categoriaOptionText,
                        form.categoria === cat && styles.categoriaOptionTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Preço</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={form.preco}
                onChangeText={(text) => setForm({ ...form, preco: text })}
                keyboardType="decimal-pad"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    padding: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  produtoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  produtoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoria: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  produtoPreco: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  preco: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C74D4',
  },
  produtoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    fontSize: 28,
    color: '#6B7280',
  },
  modalForm: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriasScroll: {
    gap: 8,
    paddingBottom: 8,
  },
  categoriaOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriaOptionActive: {
    backgroundColor: '#1C74D4',
    borderColor: '#1C74D4',
  },
  categoriaOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoriaOptionTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1C74D4',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
