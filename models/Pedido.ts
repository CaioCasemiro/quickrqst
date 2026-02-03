import { ItemPedidoModel } from './ItemPedido';

export interface Pedido {
    id: string;
    mesa: number;
    status: 'preparando' | 'entregue' | 'cancelado';
    itens: ItemPedidoModel[];
    total: number;
    hora: string;
    observacoes?: string;
}
