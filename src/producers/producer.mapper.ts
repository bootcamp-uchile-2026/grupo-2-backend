import { ProducerEntity } from '../models/producer.entity';
import { ProducerSummaryDto } from '../dto/producer-summary.dto';
import { ProducerDetailDto } from '../dto/producer-detail.dto';
import { ProducerProfileDto } from '../dto/producer-profile.dto';

export class ProducerMapper {

    static toSummaryDto(producer: ProducerEntity): ProducerSummaryDto {
        return {
            id: producer.id,
            businessName: producer.businessName,
            description: producer.description,
            logoFileId: producer.logoFileId,
            location: producer.location,
        };
    }

    static toDetailDto(producer: ProducerEntity): ProducerDetailDto {
        return {
            ...this.toSummaryDto(producer),
            bannerFileId: producer.bannerFileId,
            websiteUrl: producer.websiteUrl,
        };
    }

    static toProfileDto(producer: ProducerEntity): ProducerProfileDto {
        return {
            ...this.toDetailDto(producer),
            userId: producer.userId,
            firstName: producer.user.firstName,
            lastName: producer.user.lastName,
            email: producer.user.email,
            phone: producer.user.phone,
            isActive: producer.user.isActive,
            profileFileId: producer.user.profileFileId,
            privacyAcceptedAt: producer.user.privacyAcceptedAt.toISOString(),
            createdAt: producer.createdAt.toISOString(),
        };
    }
}