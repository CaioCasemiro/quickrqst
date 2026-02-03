import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ItemPedidoModel as ItemPedidoModel } from '@/models/ItemPedido';

interface ItemPedidoProps {
    item: ItemPedidoModel;
}

export default function ItemPedido({ item }: ItemPedidoProps) {
    return (
        <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemQtd}>Quantidade: {item.quantidade}</Text>
            </View>
            <Text style={styles.itemPreco}>
                R$ {(item.preco * item.quantidade).toFixed(2)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
});
