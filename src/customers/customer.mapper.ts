import { CustomerEntity } from '../models/customer.entity';
import { CustomerResponseDto } from '../dto/customer-response.dto';

export class CustomerMapper {

    static toResponseDto(customer: CustomerEntity, greenPoints: number): CustomerResponseDto {

        return {
            id: customer.id,
            userId: customer.userId,
            firstName: customer.user.firstName,
            lastName: customer.user.lastName,
            email: customer.user.email,
            phone: customer.user.phone,
            isActive: customer.user.isActive,
            profileFileId: customer.user.profileFileId,
            greenPoints,
            privacyAcceptedAt:
                customer.user.privacyAcceptedAt.toISOString(),
            createdAt: customer.createdAt.toISOString(),
        };
    }
}