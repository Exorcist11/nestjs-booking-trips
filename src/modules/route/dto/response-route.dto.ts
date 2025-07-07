import { ApiProperty } from '@nestjs/swagger';

export class RouteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startLocation: string;

  @ApiProperty()
  endLocation: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ example: false })
  isDeleted: boolean;

  @ApiProperty({
    required: false,
    type: String,
    example: '2024-01-01T00:00:00.000Z',
  })
  deletedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
