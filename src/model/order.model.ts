import { OrderItem } from "./order-item.model";
import { PaymentMethod } from "./payment-method.model";

export class Order {
    id: number;
    customerId: number
    orderDate: Date;
    totalAmount: number;
    orderItems: OrderItem[];
    paymentMethod: PaymentMethod;

    constructor() {};
}
