import { CreateServiceStageDto } from './serviceStageCreate.dto';

export class CreateServiceDto {
    VcName: string;
    VcDescription?: string;
    IMinimalPrice: number;
    IMaximalPrice: number;
    IRegularPrice: number;
    DTaxes?: number;
    VcTime: string;
    CompanyId: number;
    CategoryId: number;
    TxPicture?: string;
    ServiceStages?: CreateServiceStageDto[];
}
