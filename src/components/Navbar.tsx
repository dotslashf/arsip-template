import Link from "next/link"
import { buttonVariants } from "./ui/button"

export default function Navbar() {
    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow dark:bg-gray-950">
            <div className="container px-4 md:px-6">
                <div className="flex h-12 items-center">
                    <Link href="#" className="mr-auto flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                        <span>📦</span>
                    </Link>
                    <nav className="ml-auto flex items-center space-x-4">
                        <Link
                            href="#"
                            className={buttonVariants({ variant: "link" })}
                            prefetch={false}
                        >
                            Login
                        </Link>
                    </nav>
                </div>
            </div>
        </nav>
    )
}