import { Address } from "./address.model";
import { Order } from "./order.model";
import { PaymentMethod } from "./payment-method.model";
import { Profile } from "./profile.model";

export class Customer {
    id: number;
    email: string;
    password: string;
    profile: Profile;
    addresses: Address[];
    paymentMethods: PaymentMethod[];
    orders: Order[];
    constructor() {}
}
