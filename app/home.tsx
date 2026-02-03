import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Utensils, ClipboardList, Plus, History, Settings } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>QUICKRQST</Text>
          <Text style={styles.subtitle}>Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/produtos')}
        >
          <Settings size={24} color="#1C74D4" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/mesas')}
        >
          <View style={styles.iconContainer}>
            <Utensils size={40} color="#1C74D4" strokeWidth={2} />
          </View>
          <Text style={styles.cardTitle}>Mesas</Text>
          <Text style={styles.cardDescription}>Gerenciar mesas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/pedidos')}
        >
          <View style={styles.iconContainer}>
            <ClipboardList size={40} color="#1C74D4" strokeWidth={2} />
          </View>
          <Text style={styles.cardTitle}>Pedidos</Text>
          <Text style={styles.cardDescription}>Ver pedidos ativos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.primaryCard]}
          onPress={() => router.push({
            pathname: '/novo-pedido',
            params: { mesaNumero: '1' },
          })}
        >
          <View style={styles.iconContainerPrimary}>
            <Plus size={40} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.cardTitlePrimary}>Novo Pedido</Text>
          <Text style={styles.cardDescriptionPrimary}>Criar pedido rápido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/historico')}
        >
          <View style={styles.iconContainer}>
            <History size={40} color="#1C74D4" strokeWidth={2} />
          </View>
          <Text style={styles.cardTitle}>Histórico</Text>
          <Text style={styles.cardDescription}>Pedidos anteriores</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C74D4',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  grid: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryCard: {
    backgroundColor: '#1C74D4',
    borderColor: '#1C74D4',
    shadowColor: '#1C74D4',
    shadowOpacity: 0.25,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconContainerPrimary: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  cardTitlePrimary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  cardDescriptionPrimary: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
  },
});
