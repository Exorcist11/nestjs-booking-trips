import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UpdateBookingDto {
  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của chuyến đi',
    required: false,
  })
  trip?: Types.ObjectId;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của người dùng (nếu đã đăng ký)',
    required: false,
  })
  user?: Types.ObjectId;

  @ApiProperty({
    example: '65fa1c9e1234567890abcdef',
    description: 'ID của khuyến mãi (nếu có)',
    required: false,
  })
  promotion?: Types.ObjectId;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên khách hàng',
    required: false,
  })
  customerName?: string;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của khách hàng',
    required: false,
  })
  phoneNumber?: string;

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
    required: false,
  })
  seats?: string[];

  @ApiProperty({
    example: 'Bến xe Thanh Hóa',
    description: 'Điểm đón khách',
    required: false,
  })
  pickupPoint?: string;

  @ApiProperty({
    example: 'Bến xe Giáp Bát',
    description: 'Điểm trả khách',
    required: false,
  })
  dropOffPoint?: string;

  @ApiProperty({
    example: 300000,
    description: 'Tổng giá vé (VNĐ)',
    required: false,
  })
  totalPrice?: number;

  @ApiProperty({
    example: false,
    description: 'Khách hàng có phải là khách vãng lai không',
    required: false,
  })
  isGuest?: boolean;

  @ApiProperty({
    example: 'pending',
    description: 'Trạng thái đặt vé (pending, confirmed, cancelled, completed)',
    required: false,
  })
  status?: string;

  @ApiProperty({
    example: false,
    description: 'Trạng thái thanh toán',
    required: false,
  })
  isPaid?: boolean;

  @ApiProperty({
    example: 'cash',
    description: 'Phương thức thanh toán (cash, transfer, card, e-wallet)',
    required: false,
  })
  paymentMethod?: string;

  @ApiProperty({
    example: 'Yêu cầu ghế gần cửa sổ',
    description: 'Ghi chú của khách hàng',
    required: false,
  })
  note?: string;
}
