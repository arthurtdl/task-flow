import { UserDashboard } from "@/components/dashboard/user-dashboard"

export default function AdminPage() {
    return(
        <div>
            <UserDashboard adminMode={true}></UserDashboard>
        </div>
    )
}