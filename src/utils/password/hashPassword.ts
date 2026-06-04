import crypto from "crypto";

export const hashPassword = (password: string, salt: string) => {
  return crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
};
