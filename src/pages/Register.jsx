import { Form, Link, useActionData, useNavigation, json } from "react-router-dom";
import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import axiosClient from "../helpers/axiosClient";

const Register = () => {
    const [alertMsg, setAlert] = useState();
    const navigation = useNavigation();
    const data = useActionData();
    const isSubmitting = navigation.state === 'submitting';

    useEffect(()=>{
      if(data){
        setAlert({...data});
        if(!data.error){
          const f = document.getElementById("sendedForm");
          f.reset();
        }
      }
    },[data]);

    const setInvalidMsg=(e)=>{
      setAlert({msg:"All fields are required", error:true});
    }

    return ( <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">
          Create your account and manage your <span className="text-slate-700">projects.</span>
        </h1>
        <Alert alert={alertMsg}/>
        <Form id="sendedForm" method="post" className="my-10 bg-white shadow rounded-lg px-10 py-5" onInvalid={setInvalidMsg}>
          <div className="my-5">
            <label
              htmlFor="name"
              className="uppercase text-gray-600 block text-xl font-bold"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              placeholder="Your name"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="email"
              className="uppercase text-gray-600 block text-xl font-bold"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="Registration email"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="password"
              className="uppercase text-gray-600 block text-xl font-bold"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="Your password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="rp"
              className="uppercase text-gray-600 block text-xl font-bold"
            >
              Repeat your password
            </label>
            <input
              id="rp"
              type="password"
              name="rp"
              required
              placeholder="Repeat your password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>
          <button disabled={isSubmitting}
            className={`${isSubmitting ? 'bg-gray-500 hover:cursor-wait hover:bg-gray-600':'bg-sky-700 hover:cursor-pointer hover:bg-sky-800'}  w-full py-3 rounded mt-2 text-white font-bold uppercase transition-colors`}
          >
            {isSubmitting ? "Sending...." : "Create Account"}
          </button>
        </Form>
        <nav className="lg:flex lg:justify-between">
          <Link
            to="/"
            className="block text-center text-slate-500 text-sm hover:text-slate-700 transition-colors hover:bg-white"
          >
            Already have an account? LOGIN HERE!!
          </Link>
          <Link
            to="/forgot-password"
            className="block text-center text-slate-500 text-sm hover:text-slate-700 transition-colors hover:bg-white"
          >
            Forgot your PASSWORD?
          </Link>
        </nav>
      </> );
}
 
export default Register;

export async function action({request, params}){
  const data = await request.formData();
  const rp=data.get('rp');
  const newUser = {
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password')
  };
  if(newUser.password!==rp){
    return json({msg:'Your passwords are not the same, verify!', error:true});
  }
  if(newUser.password.length<6){
    return json({msg:'Your password must be SIX or More characters!', error:true});
  }

  //create user in API
  try {
    const {data} = await axiosClient.post(`/users`, newUser);
    return data;
  } catch (error) {
    return json({msg:error.message, error:true});
  }
}