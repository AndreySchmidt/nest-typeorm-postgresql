import { IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @MinLength(6, {message: 'Password must be 6 or more symbols'})
    password: string;
}
