import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
    @ApiProperty({ example: '51A-12345', description: 'Biển số xe' })
    licensePlate: string;
    
    @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tài xế chính' })
    mainDriver: string;
    
    @ApiProperty({ example: 'Trần Thị B', description: 'Người thu tiền vé' })
    ticketCollector: string;
    
    @ApiProperty({ example: '0123456789', description: 'Số điện thoại' })
    phoneNumber: string;
    
    @ApiProperty({ example: 40, description: 'Số ghế ngồi' })
    seatingCapacity: number;
}
