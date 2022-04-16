export type userResponse = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: Date;
  phoneNumber: string;
  nickName: string;
  gender: string;
  postalCode: string;
  street: string;
  number: number;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  role_id: string;
  role: role;
}

export type role = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}