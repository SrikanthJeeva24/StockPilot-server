import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseClientProvider } from './supabase.provider';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseClientProvider],
  exports: [SupabaseClientProvider],
})
export class DatabaseModule {}
