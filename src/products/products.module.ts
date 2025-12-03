import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { HashIdService } from 'src/common/hashid.sevice';

@Module({
  imports: [DatabaseModule, HashIdService],
  controllers: [ProductController],
  providers: [ProductService, HashIdService],
})
export class ProductModule {}
