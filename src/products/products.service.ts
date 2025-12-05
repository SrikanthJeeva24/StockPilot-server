import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  CreateProductDTO,
  GetProductsQueryDTO,
  ProductDTO,
} from './product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async getAllProducts(query: GetProductsQueryDTO): Promise<ProductDTO[]> {
    const { limit = 5, page = 1, search, categoryid } = query;
    this.logger.log(`Query params: ${JSON.stringify(query)}`);
    let request = this.supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (search) {
      request = request.ilike('name', `%${search}%`);
    }

    if (categoryid) {
      request = request.eq('categoryid', categoryid);
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
      id: product.id,
    }));
    return updatedResponse;
  }

  async getProductById(encodedId: string): Promise<ProductDTO> {
    // decode the public id to real numeric id
    if (!encodedId && encodedId !== null) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    // typed query: tell supabase the row type so TS knows data shape
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', encodedId)
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
      id: data.id,
      name: data.name,
      sku: data.sku,
      price: data.price,
      stock: data.stock,
      categoryid: data.categoryid,
      image: data.image ?? null,
      createdAt: data.created_at ?? null,
      updatedAt: data.updated_at ?? null,
    };

    return result;
  }

  async addProduct(payload: CreateProductDTO) {
    const updatedPayload = {
      ...payload,
      categoryid: payload.categoryid,
    };

    const { data, error } = await this.supabase
      .from('products')
      .insert(updatedPayload)
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Supabase Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return data;
  }

  async updateProduct(
    id: string,
    payload: CreateProductDTO,
  ): Promise<ProductDTO> {
    const { data, error } = await this.supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      this.logger.error(`Supabase Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return data;
  }

  async deleteProduct(id: string) {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) {
      this.logger.error(`Supabase Error: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return {
      message: 'Record Deleted Succesfully!!',
    };
  }
}
