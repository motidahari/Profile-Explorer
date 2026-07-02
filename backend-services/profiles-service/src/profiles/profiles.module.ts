import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'
import { ProfilesRepository } from './profiles.repository'
import { Profile } from './domain/profile.entity'
import { RandomProfileProvider } from './providers/random-profile.provider'
import { RandomUserProvider } from './providers/randomuser.provider'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    ProfilesRepository,
    // Bind the random-profile abstraction to the randomuser.me implementation.
    // Swap useClass here to change providers — nothing else needs to change.
    { provide: RandomProfileProvider, useClass: RandomUserProvider },
  ],
})
export class ProfilesModule {}
