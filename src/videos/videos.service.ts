/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Inject, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideoDocument } from './schema/video.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private readonly videoModel: Model<VideoDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}
  create(createVideoDto: CreateVideoDto) {
    const createdVideo = new this.videoModel(createVideoDto);
    return createdVideo.save();
  }

  async getVideos(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const videos = await this.videoModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const videosWithSuggestions = await Promise.all(
      videos.map(async (video) => {
        const suggestions = await this.getSuggestionsForVideo(video);
        return {
          name: video.name,
          description: video.description,
          thumbnail_id: video.thumbnail_id,
          suggestions,
        };
      }),
    );
    return videosWithSuggestions;
  }
  private async getSuggestionsForVideo(video: VideoDocument) {
    const cacheKey = `video_suggestions:${video._id}`;
    const cachedSuggestions = await this.cacheManager.get(cacheKey);
    if (cachedSuggestions) {
      console.log('Returning cached suggestions');
      return cachedSuggestions;
    }
    const suggestions = await this.videoModel
      .find({ _id: { $ne: video._id }, tags: { $in: video.tags } })
      .limit(2)
      .exec();

    const suggestionsObj = suggestions.map((suggestion) => {
      return {
        name: suggestion.name,
        description: suggestion.description,
        thumbnail_id: suggestion.thumbnail_id,
      };
    });
    console.log('Setting suggestions in cache');
    const ttl = this.configService.get<number>('CACHE_TTL');
    await this.cacheManager.set(cacheKey, suggestionsObj, ttl);
    return suggestionsObj;
  }
}
