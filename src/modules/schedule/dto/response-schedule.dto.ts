import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResponseDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của lịch trình',
  })
  id: string;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của tuyến đường',
  })
  route: string;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của xe khách',
  })
  car: string;

  @ApiProperty({
    example: '2025-01-01T03:00:00+07:00',
    description: 'Thời gian khởi hành (theo chuẩn ISO 8601)',
  })
  departureTime: string;

  @ApiProperty({
    example: '2025-01-01T07:00:00+07:00',
    description: 'Thời gian đến (theo chuẩn ISO 8601)',
  })
  arrivalTime: string;

  @ApiProperty({
    example: 150000,
    description: 'Giá vé (VNĐ)',
  })
  price: number;

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
  })
  operatingDays: string[];

  @ApiProperty({
    example: true,
    description: 'Trạng thái hoạt động của lịch trình',
  })
  isActive: boolean;

  @ApiProperty({
    example: 'Chuyến cố định hàng ngày từ Thanh Hóa đến Hà Nội',
    description: 'Ghi chú về lịch trình',
    required: false,
  })
  note?: string;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian tạo lịch trình',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian cập nhật lịch trình',
  })
  updatedAt: Date;
}
