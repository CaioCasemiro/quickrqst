export interface PedidoHistorico {
    id: string;
    mesa: number;
    itens: number;
    status: 'entregue' | 'cancelado';
    total: number;
    data: string;
}
