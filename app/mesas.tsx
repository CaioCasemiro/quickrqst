import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, Plus, Trash2 } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Mesa {
  id: string;
  numero: number;
  ativa: boolean;
}

export default function MesasScreen() {
  const router = useRouter();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoNumero, setNovoNumero] = useState('');

  const fetchMesas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mesas')
        .select('*')
        .order('numero', { ascending: true });

      if (error) throw error;
      if (data) setMesas(data);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar mesas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  // FUNÇÃO PARA ADICIONAR NOVA MESA (CREATE)
  const handleAdicionarMesa = async () => {
  if (!novoNumero) {
    Alert.alert('Aviso', 'Digite o número da mesa.');
    return;
  }

  try {
    console.log('Tentando adicionar mesa:', novoNumero);
    
    const { data, error } = await supabase
      .from('mesas')
      .insert([
        { 
          numero: parseInt(novoNumero), 
          ativa: true 
          // Se o seu ID não for automático, teríamos que gerar um aqui
        }
      ])
      .select();

    if (error) {
      console.error('Erro do Supabase:', error);
      throw error;
    }

    console.log('Mesa adicionada com sucesso:', data);
    setModalVisible(false);
    setNovoNumero('');
    fetchMesas();
    Alert.alert('Sucesso', `Mesa ${novoNumero} adicionada!`);
  } catch (error: any) {
    // Isso vai nos mostrar o erro real (ex: duplicata, falta de coluna, etc)
    Alert.alert('Erro ao adicionar', error.message || 'Erro desconhecido');
  }
};


  // FUNÇÃO PARA EXCLUIR MESA (DELETE)
  const handleExcluirMesa = (id: string, numero: number) => {
    Alert.alert('Excluir Mesa', `Deseja realmente remover a Mesa ${numero}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive', 
        onPress: async () => {
          const { error } = await supabase.from('mesas').delete().eq('id', id);
          if (error) Alert.alert('Erro', error.message);
          else fetchMesas();
        }
      }
    ]);
  };

  const renderMesa = ({ item }: { item: Mesa }) => (
    <TouchableOpacity
      style={[styles.mesaCard, !item.ativa && styles.mesaInativa]}
      onLongPress={() => handleExcluirMesa(item.id, item.numero)} // Exclui ao segurar o dedo
      onPress={() => {
        if (item.ativa) {
          router.push({
            pathname: '/novo-pedido',
            params: { mesaId: item.id, mesaNumero: item.numero }
          });
        } else {
          Alert.alert('Mesa Ocupada', 'Esta mesa já possui um pedido em aberto.');
        }
      }}
    >
      <View style={styles.mesaIcon}>
        <Users size={24} color={item.ativa ? '#1C74D4' : '#9CA3AF'} />
      </View>
      <Text style={[styles.mesaNumero, !item.ativa && styles.textInativo]}>Mesa {item.numero}</Text>
      <View style={[styles.statusBadge, { backgroundColor: item.ativa ? '#D1FAE5' : '#FEE2E2' }]}>
        <Text style={[styles.statusText, { color: item.ativa ? '#059669' : '#EF4444' }]}>
          {item.ativa ? 'Livre' : 'Ocupada'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" />
        </TouchableOpacity>
        <Text style={styles.title}>Mesas</Text>
        
        {/* BOTÃO DE ADICIONAR MESA */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1C74D4" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={mesas}
          renderItem={renderMesa}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma mesa cadastrada.</Text>}
        />
      )}

      {/* MODAL PARA NOVA MESA */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Mesa</Text>
            <TextInput
              style={styles.input}
              placeholder="Número da Mesa"
              keyboardType="numeric"
              value={novoNumero}
              onChangeText={setNovoNumero}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdicionarMesa} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: { backgroundColor: '#1C74D4', padding: 8, borderRadius: 8 },
  listContainer: { padding: 16 },
  columnWrapper: { justifyContent: 'space-between' },
  mesaCard: { 
    backgroundColor: '#FFF', 
    width: '48%', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2
  },
  mesaInativa: { backgroundColor: '#F3F4F6', borderColor: '#D1D5DB' },
  mesaIcon: { marginBottom: 12 },
  mesaNumero: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  textInativo: { color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#6B7280' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 16 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 14, alignItems: 'center' },
  cancelBtnText: { color: '#6B7280', fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#1C74D4', padding: 14, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '600' }
});
