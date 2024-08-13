import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    findAll: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve([]))
      .mockImplementationOnce(() => Promise.resolve([{ id: 1 }]))
      .mockImplementationOnce(() => Promise.resolve([{ id: 1 }, { id: 2 }])),
    findOneById: jest.fn().mockImplementation(() => Promise.resolve({ id: 1 })),
    assignRole: jest
      .fn()
      .mockImplementation((user, role) => Promise.resolve({ user, role })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should find all users', async () => {
    let result = await usersController.findAll();
    expect(result.length).toBe(0);
    expect(result).toEqual([]);

    result = await usersController.findAll();
    expect(result.length).toBe(1);
    expect(result).toEqual([{ id: 1 }]);

    result = await usersController.findAll();
    expect(result.length).toBe(2);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should assign role', async () => {
    const user = { id: 1 };
    const updateUserDto = {
      role: 'admin',
    } as UpdateUserDto;
    expect(await usersController.assignRole(user.id, updateUserDto)).toEqual({
      user,
      role: 'admin',
    });
  });
});
