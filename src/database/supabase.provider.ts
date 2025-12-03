import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SupabaseClientProvider: Provider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: (configService: ConfigService): SupabaseClient => {
    const url = configService.get<string>('SUPABASE_URL');
    const key = configService.get<string>('SUPABASE_PUBLIC_KEY');

    if (!url || !key) {
      throw new Error('Supabase environment variables are missing');
    }

    return createClient(url, key);
  },
  inject: [ConfigService],
};
