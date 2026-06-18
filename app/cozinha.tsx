import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle2, Clock, UtensilsCrossed } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Pedido {
    id: string;
    mesa: number;
    status: string;
    total: number;
    criado_em: string;
}

export default function CozinhaScreen() {
    const router = useRouter();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPedidosCozinha = async () => {
        try {
            setLoading(true);
            // Na cozinha, focamos em pedidos 'pendentes' (novos) e 'em preparo'
            const { data, error } = await supabase
                .from('pedidos')
                .select('*')
                .in('status', ['pendente', 'em preparo'])
                .order('criado_em', { ascending: true });

            if (error) throw error;
            if (data) setPedidos(data);
        } catch (error: any) {
            Alert.alert('Erro', 'Erro ao carregar pedidos da cozinha: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPedidosCozinha();

        // Configura um canal de realtime para atualizar a tela automaticamente
        const channel = supabase
            .channel('pedidos_cozinha')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, () => {
                fetchPedidosCozinha();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const atualizarStatus = async (id: string, novoStatus: string) => {
        try {
            const { error } = await supabase
                .from('pedidos')
                .update({ status: novoStatus })
                .eq('id', id);

            if (error) throw error;

            // A atualização da lista local será feita pelo canal de realtime ou pelo fetch abaixo
            fetchPedidosCozinha();
        } catch (error: any) {
            Alert.alert('Erro', 'Não foi possível atualizar o status: ' + error.message);
        }
    };

    const renderPedido = ({ item }: { item: Pedido }) => (
        <View style={[
            styles.pedidoCard,
            item.status === 'em preparo' ? styles.preparandoCard : styles.pendenteCard
        ]}>
            <View style={styles.pedidoHeader}>
                <View>
                    <Text style={styles.mesaLabel}>Mesa {item.mesa}</Text>
                    <View style={styles.timeRow}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.timeText}>
                            {new Date(item.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>
                <View style={[
                    styles.statusBadge,
                    item.status === 'em preparo' ? styles.statusBadgePreparo : styles.statusBadgePendente
                ]}>
                    <Text style={styles.statusBadgeText}>
                        {item.status === 'em preparo' ? 'EM PREPARO' : 'NOVO'}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Como o app atual não salva os itens individualmente no banco (apenas total e mesa), 
          exibimos o resumo do pedido. Em uma versão futura, aqui listariam os itens. */}
            <View style={styles.resumoContainer}>
                <Text style={styles.resumoTitle}>Resumo do Pedido:</Text>
                <Text style={styles.resumoText}>Valor Total: R$ {Number(item.total).toFixed(2)}</Text>
                <Text style={styles.infoAviso}>* Itens do pedido devem ser conferidos no sistema do garçom ou ticket impresso.</Text>
            </View>

            <View style={styles.actions}>
                {item.status === 'pendente' ? (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.prepararBtn]}
                        onPress={() => atualizarStatus(item.id, 'em preparo')}
                    >
                        <UtensilsCrossed size={20} color="#FFF" />
                        <Text style={styles.btnText}>Começar Preparo</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.concluirBtn]}
                        onPress={() => atualizarStatus(item.id, 'entregue')}
                    >
                        <CheckCircle2 size={20} color="#FFF" />
                        <Text style={styles.btnText}>Pedido Pronto</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={28} color="#1C74D4" />
                </TouchableOpacity>
                <Text style={styles.title}>Monitor da Cozinha</Text>
                <TouchableOpacity onPress={fetchPedidosCozinha} style={styles.refreshButton}>
                    <Text style={styles.refreshText}>Atualizar</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1C74D4" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={pedidos}
                    renderItem={renderPedido}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum pedido pendente. Cozinha em dia! 👨‍🍳</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
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
    refreshButton: { padding: 8 },
    refreshText: { color: '#1C74D4', fontWeight: '600' },
    listContainer: { padding: 16 },
    pedidoCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6
    },
    pendenteCard: { borderColor: '#E5E7EB' },
    preparandoCard: { borderColor: '#1C74D4' },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    mesaLabel: { fontSize: 24, fontWeight: '900', color: '#111827' },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    timeText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusBadgePendente: { backgroundColor: '#FEF3C7' },
    statusBadgePreparo: { backgroundColor: '#DBEAFE' },
    statusBadgeText: { fontSize: 12, fontWeight: '800', color: '#92400E' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
    resumoContainer: { marginBottom: 16 },
    resumoTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 4 },
    resumoText: { fontSize: 18, color: '#1C74D4', fontWeight: '800' },
    infoAviso: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', marginTop: 8 },
    actions: { marginTop: 8 },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 10
    },
    prepararBtn: { backgroundColor: '#1C74D4' },
    concluirBtn: { backgroundColor: '#10B981' },
    btnText: { color: '#FFF', fontSize: 16, fontWeight: '800', textTransform: 'uppercase' },
    emptyContainer: { marginTop: 100, alignItems: 'center' },
    emptyText: { fontSize: 18, color: '#6B7280', textAlign: 'center', fontWeight: '600' }
});
