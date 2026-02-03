import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';


export default function MesasScreen() {
  const router = useRouter();

  const mesas = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    numero: i + 1,
    status: Math.random() > 0.5 ? 'livre' : 'ocupada',
  }));

  return (
    <View style={styles.container}>
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1C74D4" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Mesas</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.gridContainer}>
        {mesas.map((mesa) => (
          <TouchableOpacity
            key={mesa.id}
            style={[
              styles.mesaCard,
              mesa.status === 'ocupada' && styles.mesaOcupada,
            ]}
            onPress={() => {
              if (mesa.status === 'livre') {
                router.push({
                  pathname: '/novo-pedido',
                  params: { mesaId: mesa.id, mesaNumero: mesa.numero },
                });
              }
            }}
          >
            <View
              style={[
                styles.statusBadge,
                mesa.status === 'ocupada' && styles.statusOcupada,
              ]}
            >
              <Text style={styles.mesaNumero}>{mesa.numero}</Text>
            </View>
            <Text style={styles.mesaStatus}>
              {mesa.status === 'livre' ? 'Livre' : 'Ocupada'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mesaCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  mesaOcupada: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  statusBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusOcupada: {
    backgroundColor: '#FECACA',
  },
  mesaNumero: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C74D4',
  },
  mesaStatus: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
