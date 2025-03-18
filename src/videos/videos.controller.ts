import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller()
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('video')
  async create(@Body() createVideoDto: CreateVideoDto) {
    const createdVideo = await this.videosService.create(createVideoDto);
    return {
      message: 'Video Metadata has been saved successfully',
      data: createdVideo,
    };
  }

  @Get('videos')
  async getVideos(@Query('page') page: number, @Query('limit') limit: number) {
    const videos = await this.videosService.getVideos(page, limit);
    return {
      message: 'Videos have been retrieved successfully',
      data: videos,
    };
  }
}
