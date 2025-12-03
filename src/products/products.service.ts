import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { GetProductsQueryDTO, ProductDTO } from './product.dto';
import { HashIdService } from 'src/common/hashid.sevice';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
    private hashService: HashIdService,
  ) {}

  async getAllProducts(query: GetProductsQueryDTO): Promise<ProductDTO[]> {
    const { limit = 5, page = 1, search, categoryId } = query;
    this.logger.log(`Query params: ${JSON.stringify(query)}`);
    let request = this.supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (search) {
      request = request.ilike('name', `%${search}%`);
    }

    if (categoryId) {
      request = request.eq('category_id', categoryId);
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    request = request.range(start, end);

    const { data, error } = await request;
    if (error) {
      this.logger.error(`Supabase Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    const updatedResponse = data.map((product: ProductDTO) => ({
      ...product,
      id: product.id ? this.hashService.encode(Number(product.id)) : null,
      categoryId: product.categoryId
        ? this.hashService.encode(Number(product.categoryId))
        : null,
    }));
    return updatedResponse;
  }

  async getProductById(encodedId: string): Promise<ProductDTO> {
    // decode the public id to real numeric id
    const id = this.hashService.decode(encodedId);
    if (!id && id !== 0) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    // typed query: tell supabase the row type so TS knows data shape
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    // handle DB error or not found
    if (error || !data) {
      this.logger.error(
        `Product not found or Supabase error: ${error?.message ?? 'no data'}`,
      );
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // map DB row -> ProductDTO and encode IDs
    const result: ProductDTO = {
      id: this.hashService.encode(Number(data.id)),
      name: data.name,
      sku: data.sku,
      price: data.price,
      stock: data.stock,
      categoryId:
        data.category_id != null
          ? this.hashService.encode(Number(data.category_id))
          : null,
      image: data.image ?? null,
      createdAt: data.created_at ?? null,
      updatedAt: data.updated_at ?? null,
    };

    return result;
  }
}
