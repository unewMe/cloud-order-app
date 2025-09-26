// src/webapi/controllers/restaurant.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RestaurantService } from '../../app/services/restaurant.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreateRestaurantDto } from 'src/domain/models/create-restaurant.dto';
import { CreateRestaurantCommand } from 'src/domain/commands/create-restaurant.command';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.commandBus.execute(new CreateRestaurantCommand(createRestaurantDto));
  }

}
