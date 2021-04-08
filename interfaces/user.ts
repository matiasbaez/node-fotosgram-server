
export interface IUser extends Document {
    name: string;
    avatar?: string;
    email: string;
    password: string;
    comparePassword(password: string): boolean;
}
