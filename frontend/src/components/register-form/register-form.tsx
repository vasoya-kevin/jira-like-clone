import { useAuth } from "@/auth/AuthContext";
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
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FormErrorMessage } from "../atoms";
import clsx from "clsx";

type RegisterForm = {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    // role: string;
};


export default function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    const { user, register } = useAuth();
    const [apiError, setApiError] = useState<string | null>(null);

    const navigate = useNavigate();

    const {
        register: registerUser,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<RegisterForm>();

    useEffect(() => {
        if (user) {
            navigate("/");
        };
    }, [user]);

    const handleRegisterForm = handleSubmit(async (data) => {
        try {
            setApiError(null);
            await register(data.email, data.password, data?.userName);
            navigate("/"); // redirect after login
        } catch (err: any) {
            setApiError(err);
        }
    });


    return (
        <Card {...props} className="rounded-sm">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegisterForm}>
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
                            <FieldLabel htmlFor="confirm-password">
                                Confirm Password
                            </FieldLabel>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Re Enter Your Password"
                                {...registerUser("confirmPassword", {
                                    required: "A confirmation of the password is required.",
                                    validate: (val: string) => {
                                        if (watch("password") != val) {
                                            return "The passwords you entered do not match.";
                                        }
                                    },
                                })}
                                className={clsx({
                                    "border-red-500": errors?.confirmPassword,
                                })}
                            />
                            {errors["confirmPassword"] && (
                                <FormErrorMessage name="confirmPassword" errors={errors} />
                            )}
                        </Field>

                        <FieldGroup>
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Loading" : "Create Account"}
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account? <Link to="/login">Sign In</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        {apiError && (
                            <p className="text-sm text-red-500 text-center">{apiError}</p>
                        )}
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
