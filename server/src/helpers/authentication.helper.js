import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SERVER_CONFIG } from "#config.js";

const { SECRET_KEY } = SERVER_CONFIG;

const createHashedPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
};

const comparePassword = async (password, hashPassword) => {
    const isCorrectPassword = await bcrypt.compare(password, hashPassword);
    return isCorrectPassword;
};

const registerBodyValidator = ["email", "password", "userName", "role"];

const generateJWTToken = (userId) => {
    const jwtToken = jwt.sign({ userId }, SECRET_KEY, {
        expiresIn: "1 hour",
    });

    return jwtToken;
};

const verifyJWTToken = (token) => {
    const decryptedToken = jwt.verify(token, SECRET_KEY);
    return decryptedToken;
};

export {
    createHashedPassword,
    comparePassword,
    registerBodyValidator,
    generateJWTToken,
    verifyJWTToken
};
