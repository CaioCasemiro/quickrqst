import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
    titulo: string;
}

export default function Header({ titulo }: HeaderProps) {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={router.back} style={styles.backButton}>
                <ChevronLeft size={28} color="#1C74D4" strokeWidth={2} />
            </TouchableOpacity>

            <Text style={styles.title}>{titulo}</Text>

            <View style={{ width: 44 }} />
        </View>
    );
}

const styles = StyleSheet.create({
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
});
