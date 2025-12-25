import { comparePassword, createHashedPassword, generateJWTToken, registerBodyValidator } from "#helpers/authentication.helper.js";
import { createUser, getUserByEmail } from "#models/users.model.js";
import lodash from "lodash";
import { SERVER_CONFIG } from "#config.js";
import { isProduction } from "#helpers/global.helper.js";

const { isEmpty } = lodash;

const register = async (request, response) => {
    try {
        const { body } = request;

        if (isEmpty(body)) {
            return response
                .status(400)
                .json({ message: `Request body is missing.`, status: false });
        }

        for (const key of registerBodyValidator) {
            console.log("key: ", key);
            if (!body.hasOwnProperty(key) || isEmpty(body[key])) {
                return response
                    .status(400)
                    .json({ message: `${key} is missing or empty.` });
            }
        }

        const { email, password, userName, role } = body;

        const isEmailExist = await getUserByEmail(email);

        console.log('isEmailExist: ', isEmailExist);

        if (isEmailExist) {
            return response.status(400).json({ message: 'Email already exists.', status: false });
        }

        const hashPassword = await createHashedPassword(password);

        const user = await createUser({ email, password: hashPassword, userName, role })

        return response.status(200).json({ user: user, message: 'User created successfully.', status: true });
    } catch (error) {
        console.log(error);

        return response.status(500).json({ message: 'Server error.', status: false });
    }
};

const login = async (request, response) => {
    try {
        const body = request.body;

        if (isEmpty(body)) {
            return response
                .status(400)
                .json({ message: `Request body is missing.`, status: false });
        }

        const { email, password } = body;

        if (!email || !password) {
            return response
                .status(400)
                .json({ status: false, message: 'Email or password is missing.' });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return response
                .status(400)
                .json({
                    message: "The user could not be found. Please contact your administrator for access.",
                    status: false,
                });
        }

        const matchPassword = await comparePassword(password, user.password);

        if (!matchPassword) {
            return response.status(401).json({
                message: 'Invalid email or password.',
                status: false
            });
        }

        const token = generateJWTToken(user._id);

        response.cookie('authorization', token, {
            httpOnly: true,
            secure: isProduction(SERVER_CONFIG?.NODE_ENV),
            sameSite: 'strict',
            path: '/'
        });

        const { password: _, ...normalizeUser } = user.toObject();

        return response.status(200).json({ token, user: normalizeUser, status: true });
    } catch (error) {
        console.error("error: ", error);
        return response
            .status(400)
            .json({ status: false, message: "Server Error", error });
    }
};

export { register, login };
