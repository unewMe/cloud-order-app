import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRestaurantCommand } from '../../domain/commands/create-restaurant.command';
import { RestaurantService } from '../services/restaurant.service';

@CommandHandler(CreateRestaurantCommand)
export class CreateRestaurantHandler
  implements ICommandHandler<CreateRestaurantCommand>
{
  constructor(private readonly restaurantService: RestaurantService) {}

  async execute(command: CreateRestaurantCommand) {
    const { createRestaurantDto } = command;
    return this.restaurantService.createRestaurant(createRestaurantDto);
  }
}
