import bcrypt from 'bcryptjs';

export const hashPassword = (passowrd) => bcrypt.hash(passowrd, 10);

export const comparePassword = (passowrd, hash) => bcrypt.compare(passowrd, hash);