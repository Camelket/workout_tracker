// src/user/user.service.ts

import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrationRequestDto } from '../user/dtos/registration-request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(data: RegistrationRequestDto) {
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
      const saltRounds = 10;
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
