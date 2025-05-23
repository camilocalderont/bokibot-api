import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConversationState, ConversationStateDocument } from '../schemas/conversationState/conversationState.schema';
import { CreateConversationStateDto } from '../dto/conversation/createConversationState.dto';
import { UpdateConversationStateDto } from '../dto/conversation/updateConversationState.dto';
import { BaseMongoDbCrudService } from '../../../shared/services/mongo-crud.service';

@Injectable()
export class ConversationStateService extends BaseMongoDbCrudService<ConversationStateDocument, CreateConversationStateDto, UpdateConversationStateDto> {
  constructor(
    @InjectModel(ConversationState.name) private conversationStateModel: Model<ConversationStateDocument>
  ) {
    super(conversationStateModel);
  }

  protected async validateCreate(createDto: CreateConversationStateDto): Promise<void> {
    // Set default expiration date to 24 hours from now if not provided
    if (!createDto.expiresAt) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      createDto.expiresAt = expiresAt;
    }
  }

  async findByContactId(contactId: string): Promise<ConversationStateDocument> {
    return this.conversationStateModel.findOne({ contactId }).exec();
  }

  async upsertState(contactId: string, flow: string, state: Record<string, any>): Promise<ConversationState> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const existingState = await this.findByContactId(contactId);
    if (existingState) {
      return this.update(existingState._id.toString(), {
        flow,
        state,
        expiresAt
      });
    } else {
      return this.create({
        contactId,
        flow,
        state,
        expiresAt
      });
    }
  }

  async clearState(contactId: string): Promise<void> {
    await this.conversationStateModel.deleteOne({ contactId }).exec();
  }
}