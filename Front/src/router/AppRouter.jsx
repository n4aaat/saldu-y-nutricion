import { Routes, Route } from "react-router-dom"
import { HomePage } from "../clients/pages/HomePage"
import { FormPage } from "../clients/pages/FormPage"
import { FormAdult } from "../clients/pages/FormAdult"
import { NavBar } from '../ui/NavBar'
import { NotFoundPage } from "../ui/pages/NotFoundPage"
import { UserPage } from "../dashboard/pages/UsersPage"
import { PrivateRoute } from "./PrivateRoute"
import { useAuthStore } from "../hooks/useAuthStore"
import { useEffect } from "react"
import { PacientePage } from "../dashboard/pages/PacientePage"
import { CalcImc } from "../clients/pages/CalcImc"
import { Footer } from "../ui/Footer"

export const AppRouter = () => {
    
    const { status, user, checkAuthToken, startLogout } = useAuthStore();

    useEffect(() => {
        checkAuthToken()
    }, [])
    
    return (
    <>
        <NavBar status={status} user={user} logout={startLogout}/>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/form" element={<FormPage/>}/>
            <Route path="/formAdult" element={<FormAdult/>}/>
            <Route path="/calcImc" element={<CalcImc/>}/>
            <Route path="/dashboard/*" element={<PrivateRoute/>}>
                <Route path="users" element={<UserPage/>}/>
                <Route path="user/:id" element={<PacientePage/>}/>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
        <Footer/>
    </>)
}