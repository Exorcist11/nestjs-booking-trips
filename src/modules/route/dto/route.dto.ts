import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteDto {
  @ApiProperty({ example: 'Hồ Chí Minh', description: 'Điểm khởi hành' })
  departure: string;

  @ApiProperty({ example: 'Hà Nội', description: 'Điểm đến' })
  destination: string;

  @ApiProperty({
    example: true,
    description: 'Tuyến xe này có đang hoạt động không',
  })
  isActive: boolean;
}
