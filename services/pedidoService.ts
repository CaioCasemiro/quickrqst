import { PedidoHistorico } from '@/models/PedidoHistorico';
import { Pedido } from '@/models/Pedido';

export function buscarPedidosHistorico(): PedidoHistorico[] {
    return [
        {
            id: '1',
            mesa: 3,
            itens: 4,
            status: 'entregue',
            total: 59.9,
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


export function buscarPedidoPorId(id: string): Pedido {
    return {
        id,
        mesa: 3,
        status: 'preparando',
        itens: [
            { nome: 'Refrigerante', quantidade: 2, preco: 5 },
            { nome: 'Hambúrguer', quantidade: 1, preco: 18 },
        ],
        total: 28,
        hora: '14:32',
        observacoes: 'Sem cebola no hambúrguer',
    };
}
