// Importa tipos/modelos usados nas funções abaixo para garantir
// que os dados retornados sigam a estrutura esperada pela app.
import { PedidoHistorico } from '@/models/PedidoHistorico';
import { Pedido } from '@/models/Pedido';

// Função auxiliar que retorna uma lista de pedidos históricos.
// Atualmente retorna dados mock (estáticos) para uso em desenvolvimento
// ou quando não há backend disponível. Idealmente isso viria de um
// endpoint (ex.: Supabase) e seria assíncrono.
export function buscarPedidosHistorico(): PedidoHistorico[] {
    return [
        {
            // ID único do registro histórico
            id: '1',
            // Número da mesa associada ao pedido
            mesa: 3,
            // Quantidade total de itens no pedido
            itens: 4,
            // Status final do pedido (ex.: entregue, cancelado)
            status: 'entregue',
            // Valor total do pedido
            total: 59.9,
            // Data exibida no histórico (formato local)
            data: '10/01/2026',
        },
        {
            id: '2',
            mesa: 1,
            itens: 2,
            status: 'cancelado',
            total: 32.0,
            data: '09/01/2026',
        },
    ];
}


// Retorna os detalhes de um pedido dado um `id`.
// Também é mock/local — em produção essa função deveria buscar os
// detalhes no backend (ex.: via Supabase) e ser assíncrona (async).
export function buscarPedidoPorId(id: string): Pedido {
    return {
        // Mantém o `id` passado para facilitar testes e navegação
        id,
        // Número da mesa associada
        mesa: 3,
        // Status atual do pedido (ex.: preparando, pronto, entregue)
        status: 'preparando',
        // Lista de itens com nome, quantidade e preço unitário
        itens: [
            { nome: 'Refrigerante', quantidade: 2, preco: 5 },
            { nome: 'Hambúrguer', quantidade: 1, preco: 18 },
        ],
        // Soma dos preços (pode também ser calculada dinamicamente)
        total: 28,
        // Hora formatada para exibição na UI
        hora: '14:32',
        // Observações/opcionais do cliente
        observacoes: 'Sem cebola no hambúrguer',
    };
}
