import {
  Body,
  Param,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm';
import { Roles } from '../../auth/decorator/roles.decorador';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(['admin'])
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Get an array with all users',
    schema: {
      example: [
        {
          id: 1,
          firstName: 'admin',
          lastName: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          createAt: new Date('2022-01-01T00:00:00.000Z'),
        },
      ],
    },
  })
  async findAll() {
    return this.usersService.findAll();
  }

  // @ts-ignore
  @Patch('assign-role/:id')
  @Roles(['admin'])
  @ApiOperation({ summary: 'Asign Role' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Agent successfully updated',
    schema: {
      example: {
        generateMaps: [],
        raw: [],
        affected: 1,
      },
    },
  })
  async assignRole(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    return this.usersService.assignRole(user, updateUserDto.role);
  }
}
