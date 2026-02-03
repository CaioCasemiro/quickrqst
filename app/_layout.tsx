import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen name="home" options={{ title: 'Home' }} />
        <Stack.Screen name="mesas" options={{ title: 'Mesas' }} />
        <Stack.Screen name="pedidos" options={{ title: 'Pedidos' }} />
        <Stack.Screen name="novo-pedido" options={{ title: 'Novo Pedido' }} />
        <Stack.Screen name="confirmacao" options={{ title: 'Confirmação' }} />
        <Stack.Screen name="historico" options={{ title: 'Histórico' }} />
        <Stack.Screen name="detalhes-pedido" options={{ title: 'Detalhes' }} />
        <Stack.Screen name="produtos" options={{ title: 'Produtos' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
