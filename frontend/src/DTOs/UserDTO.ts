export interface UserDTO {
  customer: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    createdAt: Date | null;
    updatedAt?: Date | null;
  };
}
