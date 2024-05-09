import Link from "next/link"

export const SideBar = () => {
 return (
    <div className=" bg-gray-800">
    <Link href="/api/auth/logout"> Logout </Link>
    </div>
    )
}