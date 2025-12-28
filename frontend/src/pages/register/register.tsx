import { Logo, RegisterForm } from "@/components"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 gap-10 flex-col">
      <Logo className={'text-6xl'} />
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
