import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../../../domain/auth/services/auth.service';
import { User } from '../../../domain/auth/entities/user.entity';

describe('AuthController', () => {
  const testSecret = 'test-secret';
  const testExpiresIn = '1h';
  const mockUserId = 'test-id';
  const mockPassword = 'test-password';
  const mockToken = 'mocked-token';

  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
      imports: [
        JwtModule.register({
          secret: testSecret,
          signOptions: { expiresIn: testExpiresIn },
        }),
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should sign up a new user and return a token', async () => {
      const mockSignup = jest.spyOn(authService, 'signup')
        .mockResolvedValue({ id: mockUserId, token: mockToken });

      const result = await authController.signup({ password: mockPassword });

      expect(result).toEqual({ id: mockUserId, token: mockToken });
      expect(mockSignup).toHaveBeenCalledWith({ password: mockPassword });
    });
  });

  describe('signin', () => {
    it('should sign in a user and return a token', async () => {
      const mockSignin = jest.spyOn(authService, 'signin')
        .mockResolvedValue({ token: mockToken });

      const result = 
        await authController.signin({ id: mockUserId, password: mockPassword });

      expect(result).toEqual({ token: mockToken });
      expect(mockSignin)
        .toHaveBeenCalledWith({ id: mockUserId, password: mockPassword });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(authService, 'signin')
        .mockRejectedValue(new UnauthorizedException('Bad id or password'));

      await expect(authController.signin({ id: mockUserId, password: mockPassword }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
