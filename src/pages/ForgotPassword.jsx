import { Form, Link, useActionData, json, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import axiosClient from "../helpers/axiosClient";

const ForgotPassword = () => {
    const data = useActionData();
    const [alertMsg, setAlert] = useState();

    const auth=useOutletContext();

    useEffect(()=>{
      if(data){
        setAlert(data);
        if(!data.error){
          const f = document.getElementById("sendedForm");
          f.reset();
        }
      }
    },[data]);

    const setInvalidMsg=(e)=>{
      setAlert({msg:"Insert a valid email address", error:true});
    }

    return ( <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">
          Recover your <span className="text-slate-700">password.</span>
        </h1>
        <Alert alert={alertMsg}/>
        <Form id="sendedForm" method="post" className="my-10 bg-white shadow rounded-lg px-10 py-5" onInvalid={setInvalidMsg}>
          <div className="my-5">
            <label
              htmlFor="email"
              className="uppercase text-gray-600 block text-xl font-bold"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Insert your registered email"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>
          <button className="bg-sky-700 w-full py-3 rounded mt-2 text-white font-bold uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors">
            Send instructions
          </button>
        </Form>
        <nav className="lg:flex lg:justify-between">
          <Link
            to="/register"
            className="block text-center text-slate-500 text-sm hover:text-slate-700 transition-colors hover:bg-white"
          >
            Don't have an account? REGISTER HERE!!
          </Link>
          <Link
            to="/"
            className="block text-center text-slate-500 text-sm hover:text-slate-700 transition-colors hover:bg-white"
          >
            Already have an account? LOGIN HERE!!
          </Link>
        </nav>
      </> );
}
 
export default ForgotPassword;

export async function action({request, params}){
  const data = await request.formData();
  const mail=data.get('email');

  try {
    const {data} = await axiosClient.post(`/users/forgot-password`, {email:mail});
    return data;
  } catch (error) {
    return json({msg:error.message, error:true});
  } 
}