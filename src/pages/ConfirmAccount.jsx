import { useEffect, useState } from "react";
import {useParams, Link} from "react-router-dom";

import Alert from "../components/Alert";
import axiosClient from "../helpers/axiosClient";

const ConfirmAccount = () => {
    const {id} = useParams();
    const [alert,setAlert] = useState();
    const [confirmed, setConfirmed] = useState(false);
    
    useEffect(()=>{
      const confirmAccount= async()=>{
        try {
          const url=`/users/confirm/${id}`;
          const {data} = await axiosClient(url);
          setAlert({msg:data.msg, error:false});
          setConfirmed(true);
        } catch (error) {
          setAlert({msg:error.response.data.msg, error:true});
        }
      };
      return ()=> {confirmAccount()};
    },[]);

    return ( <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">
          Confirm your account, start creating and managing your <span className="text-slate-700">projects.</span>
        </h1>
        <div className="mt-10 md:mt-10 shadow-lg px-5 pt-5 pb-10 rounded-xl bg-white">
          <Alert alert={alert}/>
          {confirmed && <Link
            to="/"
            className="block text-center text-slate-500 text-sm hover:text-slate-700 transition-colors hover:bg-white mt-5"
          >
            {'BACK TO LOGIN'}
          </Link> }
        </div>
      </>  );
}
 
export default ConfirmAccount;