import * as bcrypt from "bcrypt";
import { HASH_SALT } from "../constant";
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
    error?.response?.data?.error?.message ||
    error?.response?.error?.message ||
    error?.response?.statusText ||
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
    const endOfDay = moment(date).add(1, 'day').startOf('day').toISOString();
    return { startOfDay, endOfDay };
  } catch (error) {
    throw error;
  }
}