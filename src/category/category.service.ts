import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepositiry: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, id: number) {
    const isExist = await this.categoryRepositiry.findBy({
      user: { id: id },
      title: createCategoryDto.title,
    });

    if (!isExist.length)
      throw new BadRequestException('This category already exist');

    const newCategory = {
      title: createCategoryDto.title,
      user: { id },
    };

    return await this.categoryRepositiry.save(newCategory);
  }

  async findAll(id: number) {
    return await this.categoryRepositiry.find({
      where: { user: { id } },
      relations: { transactions: true },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepositiry.findOne({
      where: { id },
      relations: { user: true, transactions: true },
    });

    if (!category) throw new NotFoundException('No category');

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepositiry.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('No category');

    return await this.categoryRepositiry.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const category = await this.categoryRepositiry.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('No category');

    return await this.categoryRepositiry.delete(id);
  }
}
