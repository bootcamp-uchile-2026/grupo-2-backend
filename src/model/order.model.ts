import { orderItem } from "./orderItem.model";
import { PaymentMethod } from "./payment-method.model";

export class Order {
    id: number;
    customerId: number
    orderDate: Date;
    totalAmount: number;
    orderItems: orderItem[];
    paymentMethod: PaymentMethod;

    constructor() {};
}
