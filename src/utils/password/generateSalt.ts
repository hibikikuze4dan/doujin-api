import crypto from "crypto";

export const generateSalt = (bytes = 16) => {
  return crypto.randomBytes(bytes).toString("hex");
};
