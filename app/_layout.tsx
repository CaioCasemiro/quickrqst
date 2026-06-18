// Importa o componente de navegação `Stack` do expo-router.
// O `Stack` é usado para definir as telas (rotas) da aplicação.
import { Stack } from 'expo-router';
import React from 'react';
// `StatusBar` permite controlar a aparência da barra de status do dispositivo.
import { StatusBar } from 'expo-status-bar';
// Hook customizado que aguarda o framework (Expo/Router) ficar pronto antes de renderizar.
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Componente raiz do layout da aplicação. O expo-router espera um layout
// que envolva as rotas/containers principais da app.
export default function RootLayout() {
  // Garante que qualquer inicialização necessária do framework ocorra
  // (por exemplo, aguardando readiness do expo-router ou inicializações globais).
  useFrameworkReady();

  // Retorna um fragmento que contém a pilha de navegação (`Stack`) com
  // cada tela/rota registrada. `screenOptions={{ headerShown: false }}`
  // desabilita o cabeçalho padrão do stack para todas as telas; cada
  // tela pode ter seu próprio header se necessário.
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Rota de entrada/login da aplicação */}
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        {/* Tela principal após login */}
        <Stack.Screen name="home" options={{ title: 'Home' }} />
        {/* Lista/visualização de mesas */}
        <Stack.Screen name="mesas" options={{ title: 'Mesas' }} />
        {/* Lista de pedidos */}
        <Stack.Screen name="pedidos" options={{ title: 'Pedidos' }} />
        {/* Tela para criar um novo pedido */}
        <Stack.Screen name="novo-pedido" options={{ title: 'Novo Pedido' }} />
        {/* Tela de confirmação de ação/pedido */}
        <Stack.Screen name="confirmacao" options={{ title: 'Confirmação' }} />
        {/* Histórico de pedidos */}
        <Stack.Screen name="historico" options={{ title: 'Histórico' }} />
        {/* Detalhes de um pedido específico */}
        <Stack.Screen name="detalhes-pedido" options={{ title: 'Detalhes' }} />
        {/* Catálogo de produtos */}
        <Stack.Screen name="produtos" options={{ title: 'Produtos' }} />
        {/* Monitor da Cozinha (Novo) */}
        <Stack.Screen name="cozinha" options={{ title: 'Cozinha' }} />
        {/* Rota especial do expo-router exibida quando a rota não é encontrada */}
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* Controla o estilo da barra de status do dispositivo (dark/light/auto) */}
      <StatusBar style="auto" />
    </>
  );
}
