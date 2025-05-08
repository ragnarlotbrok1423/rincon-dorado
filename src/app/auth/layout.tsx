export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`bg-azul-noche`}>
            {children}
        </div>
    )
}