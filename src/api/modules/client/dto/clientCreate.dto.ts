export class CreateClientDto {
  VcIdentificationNumber: string;
  VcPhone: string;
  vcNickName: string;
  VcFirstName: string;
  VcSecondName?: string;
  VcFirstLastName: string;
  VcSecondLastName?: string;
  VcEmail: string;
  VcPassword: string;
}
