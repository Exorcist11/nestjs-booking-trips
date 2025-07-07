import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của đặt vé',
  })
  id: string;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của chuyến đi',
  })
  trip: string;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của người dùng (nếu đã đăng ký)',
    required: false,
  })
  user?: string;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của khuyến mãi (nếu có)',
    required: false,
  })
  promotion?: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên khách hàng',
  })
  customerName: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của khách hàng',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'nguyenvana@example.com',
    description: 'Email của khách hàng',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: ['A1', 'A2'],
    description: 'Danh sách ghế được đặt',
    type: [String],
  })
  seats: string[];

  @ApiProperty({
    example: 'Bến xe Thanh Hóa',
    description: 'Điểm đón khách',
  })
  pickupPoint: string;

  @ApiProperty({
    example: 'Bến xe Giáp Bát',
    description: 'Điểm trả khách',
  })
  dropOffPoint: string;

  @ApiProperty({
    example: 300000,
    description: 'Tổng giá vé (VNĐ)',
  })
  totalPrice: number;

  @ApiProperty({
    example: false,
    description: 'Khách hàng có phải là khách vãng lai không',
  })
  isGuest: boolean;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Ngày đặt vé',
  })
  bookingDate: Date;

  @ApiProperty({
    example: 'pending',
    description: 'Trạng thái đặt vé (pending, confirmed, cancelled, completed)',
  })
  status: string;

  @ApiProperty({
    example: false,
    description: 'Trạng thái thanh toán',
  })
  isPaid: boolean;

  @ApiProperty({
    example: 'cash',
    description: 'Phương thức thanh toán (cash, transfer, card, e-wallet)',
  })
  paymentMethod: string;

  @ApiProperty({
    example: 'Yêu cầu ghế gần cửa sổ',
    description: 'Ghi chú của khách hàng',
    required: false,
  })
  note?: string;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian tạo đặt vé',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-07-07T10:00:00Z',
    description: 'Thời gian cập nhật đặt vé',
  })
  updatedAt: Date;
}
