import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;
@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop()
  modified_time: number;
  @Prop({ required: true })
  published_time: number;
  @Prop()
  thumbnail_id: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const VideoSchema = SchemaFactory.createForClass(Video);
