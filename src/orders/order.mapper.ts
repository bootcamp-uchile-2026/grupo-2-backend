import { OrderEntity } from '../models/order.entity';
import { OrderItemEntity } from '../models/order-item.entity';
import { OrderResponseDto } from '../dto/order-response.dto';
import { OrderItemResponseDto } from '../dto/order-item-response.dto';
import { OrderAddressResponseDto } from '../dto/order-address-response.dto';
import { OrderSummaryDto } from 'src/dto/order-summary.dto';
import { ProducerOrderSummaryDto } from 'src/dto/producer-order-summary.dto';
import { ProducerOrderDetailDto } from 'src/dto/producer-order-detail.dto';

export class OrderMapper {

    static toAddressResponseDto(order: OrderEntity): OrderAddressResponseDto {

        return {
            addressId: order.addressId,
            recipientName: order.shippingRecipientName,
            recipientPhone: order.shippingRecipientPhone,
            street: order.shippingStreet,
            streetNumber: order.shippingStreetNumber,
            apartment: order.shippingApartment,
            commune: order.shippingCommune,
            region: order.shippingRegion,
            reference: order.shippingReference,
        };
    }

    static toItemResponseDto(item: OrderItemEntity): OrderItemResponseDto {

        const subtotal = item.unitPrice * item.quantity;

        return {
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            productDescription: item.productDescription,
            productSize: item.productSize,
            productColor: item.productColor,
            productMaterial: item.productMaterial,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unitCo2Avoided: Number(item.unitCo2Avoided),
            unitGreenPoints: item.unitGreenPoints,
            subtotal,
            greenPointDiscount: item.greenPointDiscount,
            total: subtotal - item.greenPointDiscount,
            isPrepared: item.isPrepared,
            preparedAt: item.preparedAt,
        };
    }

    static toResponseDto(order: OrderEntity, orderItems: OrderItemEntity[]): OrderResponseDto {

        const items = orderItems.map(item => this.toItemResponseDto(item));

        const subtotal = items.reduce((total, item) => total + item.subtotal, 0);

        const totalItems = items.reduce((total, item) => total + item.quantity, 0);

        const greenPointsRedeemed = items.reduce((total, item) => total + item.greenPointDiscount, 0);

        const estimatedGreenPoints = items.reduce((total, item) => total + item.unitGreenPoints * item.quantity, 0);

        const estimatedCo2Avoided = Number(
            items.reduce((total, item) => total + item.unitCo2Avoided * item.quantity, 0).toFixed(4));

        return {
            id: order.id,
            customerId: order.customerId,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            shippingAddress: this.toAddressResponseDto(order),
            items,
            totalProducts: items.length,
            totalItems,
            subtotal,
            shippingCost: order.shippingCost,
            greenPointsRedeemed,
            estimatedGreenPoints,
            estimatedCo2Avoided,
            total: subtotal + order.shippingCost - greenPointsRedeemed,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            confirmedAt: order.confirmedAt,
            shippedAt: order.shippedAt,
            deliveredAt: order.deliveredAt,
            cancelledAt: order.cancelledAt,
        };
    }
    static toSummaryDto(order: OrderEntity, orderItems: OrderItemEntity[]): OrderSummaryDto {

        const detail = this.toResponseDto(order, orderItems);

        return {
            id: detail.id,
            customerId: detail.customerId,
            status: detail.status,
            paymentStatus: detail.paymentStatus,
            totalProducts: detail.totalProducts,
            totalItems: detail.totalItems,
            total: detail.total,
            estimatedGreenPoints: detail.estimatedGreenPoints,
            estimatedCo2Avoided: detail.estimatedCo2Avoided,
            createdAt: detail.createdAt,
        };
    }
    static toProducerSummaryDto(order: OrderEntity, orderItems: OrderItemEntity[]): ProducerOrderSummaryDto {

        const items = orderItems.map(item => this.toItemResponseDto(item));

        const totalProducts = items.length;

        const totalItems = items.reduce((total, item) => total + item.quantity, 0);

        const subtotal = items.reduce((total, item) => total + item.subtotal, 0);

        const preparedProducts = items.filter(item => item.isPrepared).length;

        return {
            id: order.id,
            status: order.status,
            totalProducts,
            totalItems,
            subtotal,
            preparedProducts,
            isPrepared: totalProducts > 0 &&
                preparedProducts === totalProducts,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }

    static toProducerDetailDto(order: OrderEntity, orderItems: OrderItemEntity[]): ProducerOrderDetailDto {

        return {
            ...this.toProducerSummaryDto(order, orderItems),

            items: orderItems.map(item =>this.toItemResponseDto(item)),
        };
    }
}