import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsEnum(['admin', 'customer', 'guest', 'agent'])
  @MaxLength(9)
  role: string;
}
