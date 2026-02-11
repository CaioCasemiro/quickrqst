// `Link` permite navegar entre rotas do app; `Stack` é usado para ajustar
// opções da tela atual quando usada dentro de um layout de navegação.
import { Link, Stack } from 'expo-router';
import React from 'react';
// Componentes básicos do React Native usados para estruturar e estilizar a tela.
import { StyleSheet, Text, View } from 'react-native';

// Componente que é exibido quando uma rota não é encontrada (+not-found).
// O expo-router usa esse componente especial para renderizar uma tela
// amigável quando o usuário tenta acessar uma rota inexistente.
export default function NotFoundScreen() {
  return (
    <>
      {/* Define opções da tela atual na pilha de navegação, aqui apenas
          ajustamos o título exibido no histórico/stack caso seja usado */}
      <Stack.Screen options={{ title: 'Oops!' }} />

      {/* Container centralizado com mensagem e link de retorno para a home */}
      <View style={styles.container}>
        {/* Mensagem informando que a rota não existe */}
        <Text style={styles.text}>This screen doesn't exist.</Text>

        {/* Link para voltar à página inicial. `href="/"` aponta para a
            rota raiz do app; `Link` integra navegação do expo-router */}
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    // Estilo do texto da mensagem principal
    fontSize: 20,
    // `fontWeight` aceita strings como '600' em React Native;
    // aqui dá ênfase à mensagem
    fontWeight: '600',
  },
  link: {
    // Espaçamento acima do link para separá-lo da mensagem
    marginTop: 15,
    paddingVertical: 15,
  },
});
