import { ApiProperty } from '@nestjs/swagger';

export class CreateTripScheduleDto {
  @ApiProperty({ example: 'Hồ Chí Minh', description: 'Điểm khởi hành' })
  departure: string;

  @ApiProperty({ example: 'Hà Nội', description: 'Điểm đến' })
  destination: string;

  @ApiProperty({
    example: '10:00',
    description: 'Thời gian khởi hành',
  })
  departureTime: string;

  @ApiProperty({
    example: ['Monday', 'Wednesday', 'Friday'],
    description: 'Các ngày chạy',
  })
  schedule: string[];

  @ApiProperty({
    example: true,
    description: 'Tuyến xe này có đang hoạt động không',
  })
  isActive: boolean;
}
