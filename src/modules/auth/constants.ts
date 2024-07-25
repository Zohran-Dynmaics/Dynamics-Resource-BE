export const OTP_EMAIL_TEMPLATE = (to: string, otp: string) => {
  return {
    to,
    subject: "Reset Password OTP - Mail",
    html: `<p>Your password reset otp for dynamic+ cms is following: <h1>${otp}</h1> </p>`,
  };
};
