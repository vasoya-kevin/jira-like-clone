import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserById = (id) => UserModel.findById(id);
export const getUserByEmail = (email) => UserModel.findOne({ email });
export const createUser = (values) => new UserModel(values).save().then((user) => user.toObject());
export const updateUserById = (id, values) => UserModel.findByIdAndUpdate(id, values);
export const deleteUserById = (id) => UserModel.findOneAndDelete({ _id: id });

