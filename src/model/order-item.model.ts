import { Producto } from "./producto.model";

export class OrderItem {
    product: Producto;
    quantity: number;
    unitPrice: number;

    constructor() {};
}

