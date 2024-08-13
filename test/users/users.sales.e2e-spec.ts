import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersModule } from '../../src/users/users.module';
import { SalesModule } from '../../src/sales/sales.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/models/user.entity';
import { Agent } from '../../src/sales/models/agent.entity';
import { Customer } from '../../src/sales/models/customer.entity';
import { Order } from '../../src/sales/models/order.entity';

jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
  };
});

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const user = {
    id: '1',
    firstName: 'Jhon',
    lastName: 'Doe',
    email: 'email@demo.com',
    role: 'admin',
    createAt: '2024-08-11T18:28:17.260Z',
  };

  const mockUserRepository = {
    find: jest.fn().mockImplementation(() => Promise.resolve([user])),
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    update: jest
      .fn()
      .mockImplementation((id, updateUserDto) =>
        Promise.resolve({ id, ...updateUserDto }),
      ),
    findOne: jest
      .fn()
      .mockImplementation((user) => Promise.resolve({ ...user, id: 1 })),
  };
  const mockAgentRepository = {};
  const mockCustomerRepository = {};
  const mockOrderRepository = {};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UsersModule,
        SalesModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Agent))
      .useValue(mockAgentRepository)
      .overrideProvider(getRepositoryToken(Customer))
      .useValue(mockCustomerRepository)
      .overrideProvider(getRepositoryToken(Order))
      .useValue(mockOrderRepository)
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
      }),
    );
    await app.init();
  });

  async function getValidToken() {
    const {
      body: { access_token },
    } = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'demo@demo.com',
      password: 'demo',
    });
    console.log(access_token);
    return access_token;
  }

  it('/api/users (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .auth(await getValidToken(), { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect([user]);
  });

  it('/api/users/assig-role (UPDATE)', async () => {
    return request(app.getHttpServer())
      .patch('/api/users/assign-role/1')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({ role: 'agent' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});
