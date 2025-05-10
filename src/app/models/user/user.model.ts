import { Role } from "../role/role.model";

export interface User {
    
    id: number;
    username: string;
    email: string;
    password?: string;
    role: Role;

}