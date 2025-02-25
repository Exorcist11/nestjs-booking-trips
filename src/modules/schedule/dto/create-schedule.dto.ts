import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateScheduleDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của tuyến đường',
  })
  route: Types.ObjectId;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của xe khách',
  })
  car: Types.ObjectId;

  @ApiProperty({
    example: '10:00',
    description: 'Thời gian khởi hành',
  })
  departureTime: string;

  @ApiProperty({ example: 500000, description: 'Giá vé' })
  price: number;
}
