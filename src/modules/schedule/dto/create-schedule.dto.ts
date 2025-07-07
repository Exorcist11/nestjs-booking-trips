import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    example: '686b769942785df2e9cc4eb7',
    description: 'ID của tuyến đường',
  })
  routeId: string;

  @ApiProperty({
    example: '686b769942785df2e9cc4eb4',
    description: 'ID của xe',
  })
  carId: string;

  @ApiProperty({ example: '03:00', description: 'Giờ khởi hành (HH:mm)' })
  departureTime: string;

  @ApiProperty({
    example: 'daily',
    description: 'Tần suất (daily, weekly, custom)',
    required: false,
  })
  frequency?: string;

  @ApiProperty({
    example: true,
    description: 'Trạng thái hoạt động',
    required: false,
  })
  isActive?: boolean;
}
