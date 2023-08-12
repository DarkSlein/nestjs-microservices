import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';

describe('AuthService', () => {
  const testSecret = 'test-secret';
  const testExpiresIn = '1h';
  const mockUserId = 'test-id';
  const mockPassword = 'test-password';
  const mockedId = 'mocked-id';

  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
      imports: [
        JwtModule.register({
          secret: testSecret,
          signOptions: { expiresIn: testExpiresIn },
        }),
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should create a new user and return id and token', async () => {
      const mockCreate = jest.spyOn(authService['userModel'], 'create')
        .mockResolvedValue({ _id: mockedId, save: jest.fn() } as any);

      const result = await authService.signup({ password: mockPassword });

      expect(result).toEqual({ id: mockedId, token: expect.any(String) });
      expect(mockCreate).toHaveBeenCalledWith({ password: expect.any(String) });
    });
  });

  describe('signin', () => {
    it('should return a token for a valid user', async () => {
      const hashedPassword = await bcrypt.hash(mockPassword, 10);
      const mockFindOne = jest.spyOn(authService['userModel'], 'findById')
        .mockResolvedValue({ _id: mockedId, password: hashedPassword } as any);

      const result = 
        await authService.signin({ id: mockUserId, password: mockPassword });

      expect(result).toEqual({ token: expect.any(String) });
      expect(mockFindOne).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(authService['userModel'], 'findById').mockResolvedValue(null);

      await expect(authService.signin({ id: mockUserId, password: mockPassword }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
