import { CreateRestaurantDto } from '../models/create-restaurant.dto';

export class CreateRestaurantCommand {
  constructor(public readonly createRestaurantDto: CreateRestaurantDto) {}
}
