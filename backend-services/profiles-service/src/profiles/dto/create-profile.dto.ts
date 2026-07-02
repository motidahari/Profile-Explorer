import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator'
import { Gender } from '../enum/gender.enum'

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsString()
  @IsNotEmpty()
  firstName!: string

  @IsString()
  @IsNotEmpty()
  lastName!: string

  @IsEnum(Gender)
  gender!: Gender

  @IsInt()
  @Min(0)
  age!: number

  @IsInt()
  yearOfBirth!: number

  @IsString()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  phone!: string

  @IsString()
  @IsNotEmpty()
  pictureUrl!: string

  @IsString()
  @IsNotEmpty()
  country!: string

  @IsString()
  @IsNotEmpty()
  city!: string

  @IsString()
  @IsNotEmpty()
  state!: string

  @IsString()
  @IsNotEmpty()
  street!: string
}
