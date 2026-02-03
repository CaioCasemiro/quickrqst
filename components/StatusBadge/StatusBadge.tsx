import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
    status: 'preparando' | 'entregue' | 'cancelado';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const labelMap = {
        preparando: 'Preparando',
        entregue: 'Entregue',
        cancelado: 'Cancelado',
    } as const;

    const colorMap = {
        preparando: '#F59E0B',
        entregue: '#10B981',
        cancelado: '#EF4444',
    } as const;

    return (
        <View style={[styles.badge, { backgroundColor: colorMap[status] }]}>
            <Text style={styles.text}>{labelMap[status]}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
