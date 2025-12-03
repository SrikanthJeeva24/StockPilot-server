import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ProductService } from './products.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProductsQueryDTO, ProductDTO } from './product.dto';

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
}
