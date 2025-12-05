import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateProductDTO,
  GetProductsQueryDTO,
  ProductDTO,
} from './product.dto';

@ApiTags('Products')
@Controller('/products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private productService: ProductService) {}
  @Get()
  @ApiOperation({ summary: 'Fetch All Products' })
  @ApiOkResponse({
    type: [ProductDTO],
    description: 'List of All Products',
  })
  getAllProducts(@Query() query: GetProductsQueryDTO): Promise<ProductDTO[]> {
    return this.productService.getAllProducts(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Product By Id' })
  @ApiOkResponse({
    type: [ProductDTO],
    description: 'List of All Products',
  })
  getProductById(@Param('id') encodedId: string) {
    return this.productService.getProductById(encodedId);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create Product' })
  @ApiOkResponse({
    type: [ProductDTO],
    description: 'Create a New Product',
  })
  createProduct(@Body() data: CreateProductDTO) {
    return this.productService.addProduct(data);
  }

  @Post('updateproduct/:id')
  @ApiOperation({ summary: 'Update Product' })
  @ApiOkResponse({
    type: [ProductDTO],
    description: 'Update a Product',
  })
  updateProduct(
    @Param('id') productId: string,
    @Body() updatePayload: CreateProductDTO,
  ) {
    return this.productService.updateProduct(productId, updatePayload);
  }

  @Delete('deleteproduct/:id')
  @ApiOperation({ summary: 'Delete Product' })
  deleteProduct(@Param('id') productId: string) {
    return this.productService.deleteProduct(productId);
  }
}
