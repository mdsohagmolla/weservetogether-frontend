'use client'

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
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    // use state 
    const [password, setPassword] = useState("");

    // Handle : 
    const handleEmailSignUp = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();

        // password validation
        const isPasswordValid =
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[^A-Za-z0-9]/.test(password);

        if (!isPasswordValid) {
            return;
        }

        const formData = new FormData(e.target)
        const user = Object.fromEntries(formData.entries()) as { name: string, image: string, email: string, password: string }


        // Sign-UP
        const { data, error } = await authClient.signUp.email({
            ...user

        })
        if (data) {
            redirect('/')
        }
        if (error) {
            console.log(error)
        }

    }
    return (
        <div className="flex flex-col gap-6  max-w-6xl mx-auto my-10" >
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create Account</CardTitle>
                    <CardDescription>
                        Join the community and start driving social change
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleEmailSignUp}>
                        <FieldGroup>

                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Md Sohag Molla"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Profile Photo URL</FieldLabel>
                                <Input
                                    id="image"
                                    type="url"
                                    name="image"
                                    placeholder="Image URL"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                        {/* password */}
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        
                                        className="pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required

                                        

                                    />
                                     <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                   

                                    </div>

                                    <div className="text-sm space-y-1">
                                        <p className={password.length >= 8 ? "text-green-600" : "text-red-500"}>
                                            {password.length >= 8 ? "✓" : "✗"} At least 8 characters
                                        </p>

                                        <p className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-500"}>
                                            {/[A-Z]/.test(password) ? "✓" : "✗"} One uppercase letter (A-Z)
                                        </p>

                                        <p className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-red-500"}>
                                            {/[^A-Za-z0-9]/.test(password) ? "✓" : "✗"} One symbol (@, #, !, etc.)
                                        </p>
                                    </div>
                                
                            </Field>
                            <Field>
                                <Button type="submit">Login</Button>
                                <FieldDescription className="text-center">
                                    Have an account? <a href="/log-in">Log In</a>
                                </FieldDescription>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <Field>

                                <Button variant="outline" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Google
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
