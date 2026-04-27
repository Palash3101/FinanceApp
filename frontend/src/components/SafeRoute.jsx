import { Navigate } from "react-router-dom";
import {jwtDecode} from jwt-decode
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function SafeRoute({children}){
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(()=>{
        auth().catch(()=> setIsAuthorized(false))
    }, [])
    
    async function refreshToken(){
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try{
            const res = await api.post("/spi/token/refresh/", {
                refresh:refreshToken,
            });
            if (res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            }
            else{
                setIsAuthorized(false)
            }

        } catch (error){
            console.log(error)
            setIsAuthorized(false)
        }

    }

    async function auth(){
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token){
            setIsAuthorized(false)
            return
        }
        const decoded  = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now  = Date.now()/1000

        if (tokenExpiration < now){
            await refreshToken()
        }
        else{
            setIsAuthorized(True)
        }
    }

    if (isAuthorized === null){
        return <div> Loading... </div>
    }

    return isAuthorized ? children : <Navigate to="login"/>
}

export default SafeRoute