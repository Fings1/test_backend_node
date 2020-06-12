interface IUserData {
  id: string;
  firstName: string;
  lastName: string;
  userType: UserTypes;
  phone: string;
  email: string;
  password: string;
  dni: string;
}

type UserTypes = 'CLIENT' | 'ADMIN' | 'WORKER';