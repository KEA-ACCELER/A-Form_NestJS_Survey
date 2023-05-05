export class UserResponseDto {
  userId: string;

  userPw: string;

  email: string;

  phone: string;

  address: string;

  birth?: any; //TODO: 확인 후 변경 필요

  gender?: boolean;

  constructor(
    userId: string,
    userPw: string,
    email: string,
    phone: string,
    address: string,
    birth?: any,
    gender?: boolean,
  ) {
    this.userId = userId;
    this.userPw = userPw;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.birth = birth;
    this.gender = gender;
  }
}
