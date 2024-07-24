import Navbar from "./Navbar"

interface LayoutProps {
    children: JSX.Element | JSX.Element[] | string
}
export default function Layout(props: LayoutProps) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-primary">
            <Navbar />
            <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
                {props.children}
            </div>
        </main>
    )
}