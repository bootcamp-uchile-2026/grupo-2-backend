import { ReturnEntity, ReturnStatus } from '../models/return.entity';
import { ReturnItemEntity } from '../models/return-item.entity';
import { ReturnResponseDto } from '../dto/return-response.dto';
import { ReturnItemResponseDto } from '../dto/return-item-response.dto';

export class ReturnMapper {

    static toResponseDto(returnRequest: ReturnEntity, returnItems: ReturnItemEntity[]): ReturnResponseDto {

        const isCompleted =
            returnRequest.status === ReturnStatus.COMPLETED;

        const items: ReturnItemResponseDto[] =
            returnItems.map(item => {

                const orderItem = item.orderItem;

                return {
                    orderItemId: item.orderItemId,
                    productId: orderItem.productId,
                    productName: orderItem.productName,
                    quantity: item.quantity,
                    unitPrice: orderItem.unitPrice,
                    refundAmount: item.refundAmount,
                    greenPointsRestored: item.greenPointsRestored,
                    greenPointsReversed: isCompleted
                        ? orderItem.unitGreenPoints * item.quantity
                        : 0,
                    co2AvoidedReversed: isCompleted
                        ? Number(
                            (Number(orderItem.unitCo2Avoided) *
                                item.quantity).toFixed(4),
                        )
                        : 0,
                    restock: item.restock,
                };
            });

        return {
            id: returnRequest.id,
            orderId: returnRequest.orderId,
            customerId: returnRequest.order.customerId,
            status: returnRequest.status,
            reason: returnRequest.reason,
            adminNotes: returnRequest.adminNotes,
            processedBy: returnRequest.processedBy,
            items,
            totalItems: items.reduce(
                (total, item) => total + item.quantity,
                0,
            ),
            totalRefundAmount: items.reduce(
                (total, item) => total + item.refundAmount,
                0,
            ),
            totalGreenPointsRestored: items.reduce(
                (total, item) => total + item.greenPointsRestored,
                0,
            ),
            totalGreenPointsReversed: items.reduce(
                (total, item) => total + item.greenPointsReversed,
                0,
            ),
            totalCo2AvoidedReversed: Number(
                items.reduce(
                    (total, item) => total + item.co2AvoidedReversed,
                    0,
                ).toFixed(4),
            ),
            createdAt: returnRequest.createdAt,
            updatedAt: returnRequest.updatedAt,
            completedAt: returnRequest.completedAt,
        };
    }
}