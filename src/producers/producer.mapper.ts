import { ProducerEntity } from '../models/producer.entity';
import { ProducerSummaryDto } from '../dto/producer-summary.dto';
import { ProducerDetailDto } from '../dto/producer-detail.dto';

export class ProducerMapper {

    static toSummaryDto(producer: ProducerEntity ): ProducerSummaryDto {

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
}