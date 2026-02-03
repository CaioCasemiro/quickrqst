# QUICKRQST

Aplicativo mobile desenvolvido em React Native (Expo) para agilizar pedidos em restaurantes, substituindo anotações manuais.

## 🎨 Design

- **Estilo**: Minimalista, moderno, limpo e profissional
- **Cores principais**:
  - Azul: #1C74D4
  - Branco, Cinza claro e Preto
- **Componentes**: Arredondados, botões grandes, ícones simples

## 📱 Telas Implementadas

### 1. Tela de Login
- Logo QUICKRQST no topo
- Campos: Login e Senha
- Botão "Entrar" (primário)
- Link "Esqueci a senha"

### 2. Tela Home (Dashboard)
Dashboard com 4 cards principais:
- **Mesas** - Gerenciar mesas do restaurante
- **Pedidos** - Ver pedidos ativos
- **Novo Pedido** - Criar pedido rápido (destaque em azul)
- **Histórico** - Pedidos anteriores

## 🛠️ Tecnologias

- React Native
- Expo SDK 54
- Expo Router (navegação)
- TypeScript
- Lucide React Native (ícones)

## 🚀 Como executar

```bash
npm install
npm run dev
```

## 🧰 Versão do Node (recomendada)

Algumas dependências (ex.: Metro bundler) exigem Node >= 20.19.4. Recomenda-se usar a versão LTS mais recente ou pelo menos `20.19.4`.

Recomendações (Windows):

- Instalar o `nvm-windows` (recomendado para gerenciar múltiplas versões): https://github.com/coreybutler/nvm-windows
- Ou baixar o instalador do Node em: https://nodejs.org/

Exemplo usando `nvm` (PowerShell):

```powershell
nvm install 20.19.4
nvm use 20.19.4
node -v
npm -v
```

Após atualizar o Node, remova dependências e instale novamente:

```powershell
rm -r node_modules package-lock.json
npm install
expo start -c
```

Também incluí um arquivo `.nvmrc` com `20.19.4` para referência. Ajuste conforme sua versão desejada.

## 📝 Observações

Este é um projeto front-end demonstrativo, sem integração com backend ou banco de dados.
