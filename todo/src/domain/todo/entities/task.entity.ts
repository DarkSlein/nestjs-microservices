import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop({ required: true, type: String })
  owner: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export const TodoSchema = SchemaFactory.createForClass(Task);