import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarDto {
  @ApiProperty({
    example: '36B-12345',
    description: 'Biển số xe',
    required: false,
  })
  licensePlate?: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên tài xế chính',
    required: false,
  })
  mainDriver?: string;

  @ApiProperty({
    example: 'Trần Thị B',
    description: 'Tên phụ xe',
    required: false,
  })
  ticketCollector?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại liên hệ',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: 30,
    description: 'Sức chứa của xe (số ghế)',
    required: false,
  })
  seatingCapacity?: number;

  @ApiProperty({
    example: ['A1', 'A2', 'B1', 'B2'],
    description: 'Danh sách ghế trên xe',
    type: [String],
    required: false,
  })
  seats?: string[];

  @ApiProperty({
    example: 'active',
    description: 'Trạng thái của xe (active, maintenance, inactive)',
    required: false,
  })
  status?: string;

  @ApiProperty({
    example: 'Hyundai Universe',
    description: 'Mẫu xe',
    required: false,
  })
  model?: string;

  @ApiProperty({
    example: 2020,
    description: 'Năm sản xuất',
    required: false,
  })
  yearOfManufacture?: number;

  @ApiProperty({
    example: '2-2',
    description: 'Bố trí ghế (VD: 2-2 hoặc 1-2)',
    required: false,
  })
  seatLayout?: string;
}
