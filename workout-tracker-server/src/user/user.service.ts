// src/user/user.service.ts

import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrationRequestDto as RegistrationRequest } from '../user/dtos/registration-request.dto';
import * as bcrypt from 'bcrypt';
import { UserPasswordLoginRequest as EmailPasswordLoginRequest } from './dtos/user-password-login-request';
import { GenericService } from 'src/commons/generic-crud-model-service';
import { Prisma, User } from '@prisma/client';
const saltRounds = 10; 

@Injectable()
export class UserService extends GenericService<
    User,  
    Prisma.UserWhereUniqueInput,
    Prisma.UserWhereInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    Prisma.UserOrderByWithRelationInput> {
  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.user);
  }

  async validateEmailPasswordCredentials(data: EmailPasswordLoginRequest): Promise<boolean> {
    const {email, password} = data;
    const existingUser = await this.prisma.user.findUnique({where: {email}});
    if (existingUser) {
      return false;
    }
    const isValid = await bcrypt.compare(password, existingUser.passwordHash);
    return isValid;
  }

  async register(data: RegistrationRequest) {
    const { email, password } = data;

    try {
      // Check if the user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user with the hashed password
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          preferences: {
            create: {
              units: 'metric', // Set default units or adjust as needed
            },
          },
        },
        include: {
          preferences: true,
        },
      });

      // Exclude passwordHash from the returned user object
      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // Handle other potential errors
      throw new InternalServerErrorException('Failed to register user');
    }
  }
}
