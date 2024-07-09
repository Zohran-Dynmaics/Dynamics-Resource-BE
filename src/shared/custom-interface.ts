import { Request } from "express";

export interface CustomRequest extends Request {
  crmToken: string;
  env: {
    base_url: string;
  };
}
