import { CategoryService } from './category.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryDTO } from './category.dto';

@ApiTags('Category')
@Controller('/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Category' })
  @ApiOkResponse({
    type: [CategoryDTO],
    description: 'Get All Categories',
  })
  getAllCategories() {
    return this.categoryService.getAllCategory();
  }
}
