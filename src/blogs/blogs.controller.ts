import { Controller } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BaseController } from '../base.controller';

@Controller('blogs')
export class BlogsController extends BaseController<CreateBlogDto, UpdateBlogDto, BlogsService> {
  protected searchFields = ['title', 'description', 'category'];
  protected filterFields = ['category', 'title'];

  constructor(blogsService: BlogsService) {
    super(blogsService);
  }
}
