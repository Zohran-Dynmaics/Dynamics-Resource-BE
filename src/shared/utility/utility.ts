import * as bcrypt from "bcrypt";
import { HASH_SALT } from "../constant";
import { HttpException, HttpStatus } from "@nestjs/common";
const moment = require('moment');

export const generateHash = async (input: string): Promise<string> => {
  return await bcrypt.hash(input, HASH_SALT);
};

export const createFormData = (data: Record<string, string>): FormData => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
};

const getErrorMessage = (error: any): string => {
  return (
     error?.response?.statusText ||
    error?.response?.data?.error?.message ||
    error?.response?.error?.message ||
    "Unknown error"
  );
};

const getErrorStatus = (error: any): number => {
  return error?.response?.status || error?.status || 500;
};

export const formatCrmError = (
  error: any,
): { message: string; status: number } => {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error),
  };
};



export const getDayBoundaries = (date: Date | string): { startOfDay: string, endOfDay: string } => {
  try {
    const startOfDay = moment(date).startOf('day').toISOString();
    const endOfDay = moment(date).endOf('day').toISOString();
    return { startOfDay, endOfDay };
  } catch (error) {
    throw error;
  }
}

export const getEnvironmentNameFromEmail = (email: string): string => {
  try {
    const env = email.split("@")[1].split(".")[0];
    if (!env) {
      throw new HttpException(
        "Environment not found.",
        HttpStatus.BAD_REQUEST
      );
    }
    return env;
  } catch (error) {
    throw error;
  }
}