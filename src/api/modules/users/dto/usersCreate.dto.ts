export class CreateUsersDto {
  VcIdentificationNumber: string;
  VcPhone: string;
  VcNickName: string;
  VcFirstName: string;
  VcSecondName?: string;
  VcFirstLastName: string;
  VcSecondLastName?: string;
  VcEmail: string;
  VcPassword: string;
}
