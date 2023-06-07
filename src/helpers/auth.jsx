import axios from "axios"
import { redirect } from "react-router-dom";

export async function getAuthUser(){
    const token = localStorage.getItem('pmt');
    if(!token){
        return redirect('/');
    }
    const config= {
        headers: {
        "Content-Type":"application/json",
        Authorization:'Bearer '+token
    }};
    try {
        const {data} = await axios(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,config);
        return data;
    } catch (error) {
        return null;
    }
}