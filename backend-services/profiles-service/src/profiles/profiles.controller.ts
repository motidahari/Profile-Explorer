import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ProfilesService } from './service/profiles.service'
import { ProfileModel } from './domain-model/profile.model'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { RandomProfile } from './providers/random-profile.provider'

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll(): Promise<ProfileModel[]> {
    return this.profilesService.findAll()
  }

  @Get('random')
  fetchRandom(): Promise<RandomProfile[]> {
    return this.profilesService.fetchRandom()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProfileDto): Promise<ProfileModel> {
    return this.profilesService.create(dto)
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileModel> {
    return this.profilesService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.profilesService.remove(id)
  }
}
