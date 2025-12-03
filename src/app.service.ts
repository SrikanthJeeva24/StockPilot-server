import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AppService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDB(): Promise<string> {
    const { error } = await this.supabase
      .from('products')
      .select('id')
      .limit(1);

    if (error) {
      console.error('DB Connection Failed:', error.message);
      return 'Database Not Connected';
    }
    return 'Database Connected Succesfully';
  }
}
