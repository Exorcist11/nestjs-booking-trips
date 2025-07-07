import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResponseDto {
  @ApiProperty({
    example: '686b769942785df2e9cc4eb6',
    description: 'ID của lịch trình',
  })
  id: string;

  @ApiProperty({
    example: '686b769942785df2e9cc4eb7',
    description: 'ID của tuyến đường',
  })
  routeId: string;

  @ApiProperty({ example: 'Thanh Hóa', description: 'Điểm xuất phát' })
  startLocation: string;

  @ApiProperty({ example: 'Hà Nội', description: 'Điểm đến' })
  endLocation: string;

  @ApiProperty({ example: 180, description: 'Thời gian di chuyển (phút)' })
  duration: number;

  @ApiProperty({ example: 200000, description: 'Giá vé (VNĐ)' })
  price: number;

  @ApiProperty({
    example: '686b769942785df2e9cc4eb4',
    description: 'ID của xe',
  })
  carId: string;

  @ApiProperty({ example: '36B-12345', description: 'Biển số xe' })
  carLicensePlate: string;

  @ApiProperty({ example: '03:00', description: 'Giờ khởi hành (HH:mm)' })
  departureTime: string;

  @ApiProperty({
    example: 'daily',
    description: 'Tần suất (daily, weekly, custom)',
  })
  frequency: string;

  @ApiProperty({ example: true, description: 'Trạng thái hoạt động' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Trạng thái xóa mềm' })
  isDeleted: boolean;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian tạo',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian cập nhật',
  })
  updatedAt: Date;
}
