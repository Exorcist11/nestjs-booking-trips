import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateTripDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của lịch trình cố định',
  })
  template: Types.ObjectId;

  @ApiProperty({
    example: '2025-07-07T00:00:00+07:00',
    description: 'Ngày diễn ra chuyến đi (theo chuẩn ISO 8601)',
  })
  date: string;

  @ApiProperty({
    example: [],
    description: 'Danh sách ghế đã đặt',
    type: [String],
  })
  bookedSeats: string[];

  @ApiProperty({
    example: ['A1', 'A2', 'B1', 'B2'],
    description: 'Danh sách ghế còn trống',
    type: [String],
    required: false,
  })
  availableSeats?: string[];

  @ApiProperty({
    example: 'scheduled',
    description:
      'Trạng thái của chuyến đi (scheduled, boarding, departed, arrived, cancelled)',
    required: false,
  })
  status?: string;

  @ApiProperty({
    example: '2025-07-07T03:00:00+07:00',
    description: 'Thời gian xuất phát thực tế (theo chuẩn ISO 8601)',
    required: false,
  })
  actualDepartureTime?: string;

  @ApiProperty({
    example: '2025-07-07T07:00:00+07:00',
    description: 'Thời gian đến thực tế (theo chuẩn ISO 8601)',
    required: false,
  })
  actualArrivalTime?: string;

  @ApiProperty({
    example: 'Chuyến đi đúng giờ',
    description: 'Ghi chú của chuyến đi',
    required: false,
  })
  note?: string;
}
