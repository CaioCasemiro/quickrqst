// Componentes do React Native usados para construir a UI de produtos
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
// Hook para navegação programática
import { useRouter } from 'expo-router';
// Ícones para ações (voltar, adicionar, excluir, editar)
import { ChevronLeft, Plus, Trash2, Edit } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
// Cliente Supabase para operações CRUD na tabela `produtos`
import { supabase } from '../lib/supabase'; // Ajuste o caminho se necessário

// Tipagem local representando a estrutura de um produto
interface Produto {
  id: string;
  nome: string;
  preco: number;
  ativo: boolean; // true = disponível, false = escondido/inativo
}

// Tela de gerenciamento de produtos: lista, criar, editar, excluir e ativar/desativar
export default function ProdutosScreen() {
  const router = useRouter();
  // Estado local: lista de produtos e flags de UI
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  // `editando` guarda o produto atual em edição (ou null para criar novo)
  const [editando, setEditando] = useState<Produto | null>(null);
  // Formulário local para nome/preço (strings para facilitar input)
  const [form, setForm] = useState({
    nome: '',
    preco: '',
  });

  // 1) Buscar produtos do banco (READ)
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      if (data) setProdutos(data);
    } catch (error: any) {
      // Alerta amigável caso a requisição falhe
      Alert.alert(
        'Erro',
        'Não foi possível carregar os produtos: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Carrega produtos ao montar o componente
  useEffect(() => {
    fetchProdutos();
  }, []);

  // Abre modal para criar novo produto ou editar existente
  const handleAbrirModal = (produto?: Produto) => {
    if (produto) {
      setEditando(produto);
      setForm({
        nome: produto.nome,
        preco: produto.preco.toString(),
      });
    } else {
      setEditando(null);
      setForm({ nome: '', preco: '' });
    }
    setModalVisible(true);
  };

  // 2) Salvar ou editar produto (CREATE / UPDATE)
  const handleSalvar = async () => {
    if (!form.nome || !form.preco) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      // Prepara payload com conversão de preço para number
      const payload: any = {
        nome: form.nome,
        preco: parseFloat(form.preco.replace(',', '.')),
        ativo: editando ? editando.ativo : true,
      };

      // Se estivermos editando, inclui o id para upsert
      if (editando) {
        payload.id = editando.id;
      }

      // `upsert` cria ou atualiza com base na presença do id
      const { error } = await supabase.from('produtos').upsert(payload);

      if (error) throw error;

      Alert.alert(
        'Sucesso',
        `Produto ${editando ? 'atualizado' : 'criado'} com sucesso!`
      );
      setModalVisible(false);
      fetchProdutos(); // Recarrega lista
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error.message);
    }
  };

  // 3) Excluir produto (DELETE) com confirmação
  const handleExcluir = async (id: string) => {
    Alert.alert('Confirmar', 'Deseja realmente excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', id);

          if (error) Alert.alert('Erro', error.message);
          else fetchProdutos();
        },
      },
    ]);
  };

  // 4) Alterna se o produto está ativo/visível (UPDATE)
  const toggleAtivo = async (produto: Produto) => {
    const { error } = await supabase
      .from('produtos')
      .update({ ativo: !produto.ativo })
      .eq('id', produto.id);

    if (error) Alert.alert('Erro', error.message);
    else fetchProdutos();
  };

  // Renderiza cada produto na lista com ações rápidas
  const renderProduto = ({ item }: { item: Produto }) => (
    <View style={styles.produtoCard}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoPreco}>
          R$ {Number(item.preco).toFixed(2)}
        </Text>
      </View>

      <View style={styles.actions}>
        {/* Botão para alternar disponibilidade */}
        <TouchableOpacity
          style={[
            styles.statusBadge,
            { backgroundColor: item.ativo ? '#D1FAE5' : '#F3F4F6' },
          ]}
          onPress={() => toggleAtivo(item)}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.ativo ? '#059669' : '#6B7280' },
            ]}
          >
            {item.ativo ? 'Ativo' : 'Inativo'}
          </Text>
        </TouchableOpacity>

        {/* Editar */}
        <TouchableOpacity
          onPress={() => handleAbrirModal(item)}
          style={styles.iconButton}
        >
          <Edit size={20} color="#1C74D4" />
        </TouchableOpacity>

        {/* Excluir */}
        <TouchableOpacity
          onPress={() => handleExcluir(item.id)}
          style={styles.iconButton}
        >
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // JSX da tela: header, lista de produtos e modal para criar/editar
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={28} color="#1C74D4" />
        </TouchableOpacity>

        <Text style={styles.title}>Produtos</Text>

        {/* Botão para abrir modal de criação */}
        <TouchableOpacity
          onPress={() => handleAbrirModal()}
          style={styles.addButton}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Indicador de carregamento ou lista de produtos */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1C74D4"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={produtos}
          renderItem={renderProduto}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum produto cadastrado.
            </Text>
          }
        />
      )}

      {/* Modal para criar/editar produto */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editando ? 'Editar Produto' : 'Novo Produto'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do Produto"
              value={form.nome}
              onChangeText={(t) => setForm({ ...form, nome: t })}
            />

            <TextInput
              style={styles.input}
              placeholder="Preço (ex: 15.50)"
              value={form.preco}
              onChangeText={(t) => setForm({ ...form, preco: t })}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSalvar}
                style={styles.saveButton}
              >
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
    backgroundColor: '#F9FAFB'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 50,
  },
  backButton: {
    padding: 8
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827'
  },
  addButton: {
    backgroundColor: '#1C74D4',
    padding: 8,
    borderRadius: 8
  },
  listContainer: {
    padding: 16
  },
  produtoCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  produtoInfo: {
    flex: 1
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827'
  },
  produtoPreco: {
    fontSize: 14,
    color: '#1C74D4',
    fontWeight: '700',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  iconButton: {
    padding: 4
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600'
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1C74D4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600'
  },
});
