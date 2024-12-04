import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";


@Injectable()
export class GenericService<
  T,
  WhereUniqueInput,
  WhereInput,
  CreateInput,
  UpdateInput,
  OrderByInput
> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelDelegate: any,
  ) {}

  async findUnique(where: WhereUniqueInput): Promise<T | null> {
    return this.modelDelegate.findUnique({ where });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: WhereUniqueInput;
    where?: WhereInput;
    orderBy?: OrderByInput;
  }): Promise<T[]> {
    return this.modelDelegate.findMany(params);
  }

  async create(data: CreateInput): Promise<T> {
    return this.modelDelegate.create({ data });
  }

  async update(params: {
    where: WhereUniqueInput;
    data: UpdateInput;
  }): Promise<T> {
    return this.modelDelegate.update(params);
  }

  async delete(where: WhereUniqueInput): Promise<T> {
    return this.modelDelegate.delete({ where });
  }
}
