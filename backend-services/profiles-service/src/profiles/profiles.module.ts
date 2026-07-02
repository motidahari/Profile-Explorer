import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'
import { ProfilesDao } from './dao/profiles.dao'
import { Profile } from './domain/profile.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesDao],
})
export class ProfilesModule {}
