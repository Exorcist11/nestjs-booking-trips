import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UpdateScheduleDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của tuyến đường',
    required: false,
  })
  route?: Types.ObjectId;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của xe khách',
    required: false,
  })
  car?: Types.ObjectId;

  @ApiProperty({
    example: '2025-01-01T03:00:00+07:00',
    description: 'Thời gian khởi hành (theo chuẩn ISO 8601)',
    required: false,
  })
  departureTime?: string;

  @ApiProperty({
    example: '2025-01-01T07:00:00+07:00',
    description: 'Thời gian đến (theo chuẩn ISO 8601)',
    required: false,
  })
  arrivalTime?: string;

  @ApiProperty({
    example: 150000,
    description: 'Giá vé (VNĐ)',
    required: false,
  })
  price?: number;

  @ApiProperty({
    example: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    description: 'Các ngày hoạt động trong tuần',
    required: false,
  })
  operatingDays?: string[];

  @ApiProperty({
    example: true,
    description: 'Trạng thái hoạt động của lịch trình',
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    example: 'Chuyến cố định hàng ngày từ Thanh Hóa đến Hà Nội',
    description: 'Ghi chú về lịch trình',
    required: false,
  })
  note?: string;
}
