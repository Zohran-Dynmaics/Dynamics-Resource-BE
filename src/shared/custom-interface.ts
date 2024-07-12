import { Request } from "express";

export interface CustomRequest extends Request {
  env: {
    _id: string,
    base_url: string;
    name: string,
  };
  user: {
    _id: string,
    bookableresourceid: string,
    email: string,
    role: string,
  };
}
