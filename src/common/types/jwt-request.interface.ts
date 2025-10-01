import { Request } from 'express';

export interface JwtRequest extends Request {
  user: {
    id: string;
    email?: string;
    // agar aur fields JWT me hain to yahan add karo
  };
}
