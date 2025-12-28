import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { FormErrorMessage } from "@/components/atoms";
import { useUser, type CreateUserPayload } from "@/context/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { AxiosError } from "axios";
import axios from "axios";

export interface CreateUserProps extends React.ComponentProps<typeof Card> {
}

export default function CreateUser({ ...props }: CreateUserProps) {
    const { user } = useAuth();
    const [apiError, setApiError] = useState<string | null>(null);
    const { createUser, error } = useUser()
    const navigate = useNavigate();

    const {
        register: registerUser,
        handleSubmit,
        formState: { errors, isSubmitting },
        control
    } = useForm<CreateUserPayload>();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        };
    }, [user]);

    const handleCreateUsers = handleSubmit(async (data) => {
        try {
            setApiError(null);
            await createUser(data);

            if (!error?.status) {
                navigate("/users");
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                // Axios error
                setApiError(err.response?.data?.message || "Something went wrong");
            } else {
                // Non-Axios error
                setApiError("Unexpected error occurred");
            }
        }
    });


    return (
        <section className="h-full min-h-[calc(100vh-64px)] flex justify-center items-center  mx-auto flex-col gap-4">
            <div className="max-w-sm w-full">
                <Card {...props} className="rounded-sm">
                    <CardHeader>
                        <CardTitle>Create an User</CardTitle>
                        <CardDescription>
                            Enter your information below to create your user
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateUsers}>
                            <FieldGroup className="gap-4">
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter Username"
                                        {...registerUser("userName", {
                                            required: "Username is required.",
                                            minLength: {
                                                value: 3,
                                                message: "Minimum 3 character is required.",
                                            },
                                        })}
                                        className={clsx({
                                            "border-red-500": errors?.userName,
                                        })}
                                    />
                                    {errors["userName"] && (
                                        <FormErrorMessage name="userName" errors={errors} />
                                    )}
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Enter Email"
                                        {...registerUser("email", {
                                            required: "Email is required.",
                                            pattern: {
                                                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                message: "Please enter a valid email address.",
                                            },
                                        })}
                                        className={clsx({
                                            "border-red-500": errors?.email,
                                        })}
                                    />
                                    {errors["email"] && (
                                        <FormErrorMessage name="email" errors={errors} />
                                    )}
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter Password"
                                        {...registerUser("password", {
                                            required: "Password is required.",
                                            minLength: {
                                                value: 8,
                                                message: 'A minimum of 8 characters is required.'
                                            },
                                            pattern: {
                                                value:
                                                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                message:
                                                    "A minimum of 8 characters is required, including at least one letter, one number, and one special character.",
                                            },
                                        })}
                                        className={clsx({
                                            "border-red-500": errors?.password,
                                        })}
                                    />
                                    {errors["password"] && (
                                        <FormErrorMessage name="password" errors={errors} />
                                    )}
                                </Field>

                                <Field className="gap-2">
                                    <FieldLabel htmlFor="role">Role</FieldLabel>
                                    <Controller
                                        control={control}
                                        name="role"
                                        rules={{ required: "Role is required" }}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors["role"] && (
                                        <FormErrorMessage name="role" errors={errors} />
                                    )}
                                </Field>


                                <FieldGroup>
                                    <Field>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ?
                                                <>
                                                    <Spinner />
                                                    Creating...
                                                </>
                                                :
                                                "Create User"
                                            }
                                        </Button>
                                    </Field>
                                </FieldGroup>

                                {apiError && (
                                    <p className="text-sm text-red-500 text-center">{apiError}</p>
                                )}
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </section>

    );
}
