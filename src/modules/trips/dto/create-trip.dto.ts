import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateTripDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID schedule',
  })
  template: Types.ObjectId;

  @ApiProperty({
    example: '2025-02-15T10:00:00.000Z',
    description: 'Thời gian khởi hành',
  })
  date: Date;

  availableSeats?: number;

  bookedSeats: string[];
}
