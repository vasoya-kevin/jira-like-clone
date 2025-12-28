import { LoginForm, Logo } from "@/components";

export default function Page() {
    return (

        <div className="flex min-h-svh w-full items-center justify-center flex-col gap-10 p-6 md:p-10">
            <Logo className={'text-6xl'} />
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}