import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateBookingDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của chuyến đi',
  })
  trip: Types.ObjectId;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'User Id',
  })
  userId: Types.ObjectId;

  @ApiProperty({ example: 'A1', description: 'Vị trí ghế', default: 'A1' })
  seatNumber: string;

  @ApiProperty({ example: false, description: 'Trạng thái' })
  isPaid: boolean;
}
