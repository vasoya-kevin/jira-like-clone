import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

import clsx from "clsx";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { FormErrorMessage } from "../atoms";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, user } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string }>();

  useEffect(() => {
    if (user) {
      navigate("/");
    };
  }, [user]);

  const handleLoginForm = handleSubmit(async (data) => {
    try {
      setApiError(null);
      await login(data.email, data.password);
      navigate("/"); // redirect after login
    } catch (err: any) {
      setApiError(err);
    }
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="py-12 rounded-sm">

        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLoginForm}>

            <FieldGroup className="gap-4">

              <Field className="gap-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email is required.",
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  className={clsx({
                    "border-red-500": errors["password"],
                  })}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required.",
                    },
                  })}
                />
                {errors["password"] && (
                  <FormErrorMessage name="password" errors={errors} />
                )}
              </Field>

              <Field>
                <Button
                  disabled={isSubmitting}
                  className="cursor-pointer font-jakarta"
                  type="submit"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                {apiError && (
                  <p className="text-sm text-red-500 text-center">
                    {apiError}
                  </p>
                )}
              </Field>

              <FieldGroup>
                <Field>
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <Link to='/register'>Sign Up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>

            </FieldGroup>
          </form>
        </CardContent>

      </Card>
    </div>
  );
}
