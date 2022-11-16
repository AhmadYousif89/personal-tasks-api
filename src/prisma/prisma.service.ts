import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDbByOrder() {
    // use this method if "onDelete Cascade" is NOT active in the prisma schema
    return await this.$transaction([
      this.task.deleteMany({}),
      this.user.deleteMany({}),
    ]);
  }

  async resetDatabase() {
    // use this method if "onDelete Cascade" IS active in the prisma schema
    if (process.env.NODE_ENV === 'production') return;
    const dbModels = Reflect.ownKeys(this).filter((key) => key[0] !== '_'); // e.g ["users", "bookmarks"]
    return await Promise.all([
      dbModels.map((model) => this[model].deleteMany()),
    ]);
  }
}
