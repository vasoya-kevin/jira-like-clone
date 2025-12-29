import lodash from "lodash";
import { createUser, deleteUserById, getUserByEmail, getUserById, UserModel } from "#models/users.model.js"
import { createHashedPassword, registerBodyValidator } from "#helpers/authentication.helper.js";

const { isEmpty } = lodash;

export const getAllUsers = async (request, response) => {
    try {
        const users = await UserModel.find().select('-password');

        return response.status(200).json({ users, status: false });
    } catch (error) {
        return response.status(400).json({ message: 'Something went wrong.', status: false, error })
    }
}

export const getProfile = async (request, response) => {
    try {
        const user = request?.user;

        return response.status(200).json({ user, status: true })

    } catch (error) {
        console.log('error: ', error);
        return response.status(400).json({ message: 'something went wrong.', status: false, error })
    }
}

export const createUserByAdmin = async (request, response) => {
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

        const user = await createUser({ email, password: hashPassword, userName, role });

        delete user?.password;

        return response.status(201).json({ user, message: 'User created successfully.', status: true });

    } catch (error) {
        console.log('error: ', error);
        return response.status(500).json({ message: 'something went wrong.', status: false, error })
    }
}

export const deleteUserByAdmin = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id) {
            return response.status(400).json({ message: 'User id is missing.', status: false });
        }

        const deletedUser = await deleteUserById(id);

        return response.status(201).json({ message: 'User Delete Successfully', status: true, id, deletedUser })
    } catch (error) {
        console.log('error: ', error);
        return response.status(500).json({ message: 'Something went wrong.', status: false, error })
    }
}

export const updateUserByAdmin = async (request, response) => {
    try {
        const { body, params } = request;

        if (isEmpty(params?.id)) {
            return response.status(400).json({ message: 'user id is missing.', status: false });
        }

        if (isEmpty(body)) {
            return response.status(400).json({ message: 'request body is missing.', status: false });
        }

        const user = await getUserById(params?.id);

        if (!user) {
            return response
                .status(404)
                .json({ message: "User not found.", status: false });
        };

        for (const key in body) {
            if (key === "password") {
                user.password = await createHashedPassword(body[key])
            } else if (key === "email") {
                return response
                    .status(403)
                    .json({ message: "Unfortunately, you cannot update email.", status: false });
            } else {
                user[key] = body[key];
            }
        }

        await user.save();

        const userObj = user.toObject();
        delete userObj.password;

        return response.status(200).json({
            message: "User updated successfully.",
            user: userObj,
        });

    } catch (error) {
        console.log('error: ', error);
        return response.status(500).json({ message: 'Something went wrong.', status: false, error })
    }
}