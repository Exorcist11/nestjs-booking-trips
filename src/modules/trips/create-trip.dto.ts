import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty({ example: 'Hồ Chí Minh', description: 'Điểm khởi hành' })
  departure: string;

  @ApiProperty({ example: 'Hà Nội', description: 'Điểm đến' })
  destination: string;

  @ApiProperty({
    example: '2025-02-15T10:00:00.000Z',
    description: 'Thời gian khởi hành',
  })
  departureTime: Date;

  @ApiProperty({ example: 500000, description: 'Giá vé' })
  price: number;

  @ApiProperty({ example: 40, description: 'Số ghế trống', default: 40 })
  availableSeats: number;
}
