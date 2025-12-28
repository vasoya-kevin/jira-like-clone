import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form'

type UserProfileForm = {
    userName: string
    email: string
    role: string
}


const UserProfile = () => {
    const { user, loading, logout } = useAuth();
    const { register, reset } = useForm<UserProfileForm>()

    useEffect(() => {
        if (user) {
            reset({
                userName: user.userName,
                email: user.email,
                role: user.role,
            })
        }
    }, [user, reset])

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <div className="min-h-[calc(100dvh-64px)] w-full flex items-center justify-center bg-muted/30">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className='mx-auto text-2xl'>User Profile</CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="userName">User Name</Label>
                            <Input id="userName" {...register("userName")} readOnly />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" {...register("email")} readOnly />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                {...register("role")}
                                className="capitalize"
                                readOnly
                            />
                        </div>
                    </form>
                </CardContent>

                <CardFooter>
                    <Button className="w-full cursor-pointer" variant="destructive" onClick={logout}>
                        Logout
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )


}

export default UserProfile;
