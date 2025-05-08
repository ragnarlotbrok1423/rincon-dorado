"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import Image from "next/image";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [agreeTerms, setAgreeTerms] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle registration logic here
        console.log({ name, email, password, confirmPassword, agreeTerms })
    }

    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, text: "", color: "" }

        let strength = 0
        if (password.length >= 8) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1

        const strengthMap = [
            { text: "Weak", color: "bg-red-500" },
            { text: "Fair", color: "bg-orange-500" },
            { text: "Good", color: "bg-yellow-500" },
            { text: "Strong", color: "bg-green-500" },
        ]

        return {
            strength: strength,
            text: strengthMap[strength - 1]?.text || "",
            color: strengthMap[strength - 1]?.color || "",
        }
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className=" flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image src="/logo1.svg" alt="logo" width={200} height={200} className="flex justify-center items-center mx-auto" />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Aquí puedes crear tu Cuenta</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gris-oscuro">
                                Nombre Completo
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gris-medio" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gris-oscuro">
                                Correo Electrónico
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gris-medio" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gris-oscuro">
                                Contraseña
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gris-medio" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gris-medio hover:text-gris-oscuro focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            {password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs text-gris-medio">Password strength:</div>
                                        <div
                                            className="text-xs font-medium"
                                            style={{ color: passwordStrength.color.replace("bg-", "text-") }}
                                        >
                                            {passwordStrength.text}
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-gris-medio/10 rounded-full">
                                        <div
                                            className={`h-full rounded-full ${passwordStrength.color}`}
                                            style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        



                        <div>
                            <button
                                type="submit"

                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gris-oscuro bg-dorado-elegante hover:bg-oro-claro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dorado-elegante disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Crear Cuenta
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gris-medio/30"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gris-medio">Or sign up with</span>
                            </div>
                        </div>


                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gris-medio">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="font-medium text-dorado-elegante hover:text-oro-claro">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
