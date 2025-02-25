import { ApiProperty } from '@nestjs/swagger';

import { Types } from 'mongoose';

export class CreateBookingDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của chuyến đi',
  })
  tripID: Types.ObjectId;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'User ID (nếu có)',
  })
  userID?: Types.ObjectId;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên khách hàng' })
  customerName: string;

  @ApiProperty({
    example: '0987654321',
    description: 'Số điện thoại khách hàng',
  })
  phoneNumber: string;

  @ApiProperty({ example: ['A1', 'A2'], description: 'Danh sách ghế được đặt' })
  seats: string[];


  @ApiProperty({
    example: false,
    description: 'Khách vãng lai (không có tài khoản)',
  })
  isGuest: boolean;

  @ApiProperty({
    example: '2025-03-15T10:30:00.000Z',
    description: 'Ngày đặt vé',
    required: false,
  })
  bookingDate?: Date;

  @ApiProperty({ example: false, description: 'Trạng thái thanh toán' })
  isPaid: boolean;
}
