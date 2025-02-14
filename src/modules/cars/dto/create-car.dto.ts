import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: '51A-12345', description: 'License Plate' })
  licensePlate: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Main Driver' })
  mainDriver: string;

  @ApiProperty({ example: 'Trần Thị B', description: ' Ticket Collector' })
  ticketCollector: string;

  @ApiProperty({ example: '0123456789', description: 'PhoneNumber' })
  phoneNumber: string;

  @ApiProperty({
    example: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    description: 'Seat list',
  })
  seats: [string];
}
