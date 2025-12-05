import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CategoryDTO } from './category.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supbase: SupabaseClient,
  ) {}

  async getAllCategory(): Promise<CategoryDTO[]> {
    let { data, error } = await this.supbase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      this.logger.error(`Supabase Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return data || [];
  }
}
