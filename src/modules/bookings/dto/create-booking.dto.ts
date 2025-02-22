import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateBookingDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của chuyến đi',
  })
  tripId: string;

  @ApiProperty({
    example: ['A1', 'A2'],
    description: 'Danh sách ghế đặt',
    type: [String],
  })
  seats: string[];

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'User ID (có thể null nếu khách không đăng nhập)',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Tên khách hàng (nếu không có userId)',
    required: false,
  })
  customerName?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại khách hàng (nếu không có userId)',
    required: false,
  })
  phoneNumber?: string;
}
