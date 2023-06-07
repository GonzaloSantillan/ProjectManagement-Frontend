import { Form, Link, useActionData, useNavigation, json, redirect, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import axiosClient from "../helpers/axiosClient";

const Login = () => {
  const [alertMsg, setAlert] = useState();
  const navigate = useNavigate();
  const data = useActionData();
  
  useEffect(() => {
    if(localStorage.getItem('pmt')){
      navigate('/projects');
    }
  }, []);

  useEffect(()=>{
    if(data){
      setAlert(data);
    }
  },[data]);

  const setInvalidMsg=(e)=>{
    setAlert({msg:"All fields are required", error:true});
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Login and manage your <span className="text-slate-700">projects.</span>
      </h1>
      <Alert alert={alertMsg} />
      <Form
        method="post" onInvalid={setInvalidMsg}
        className="my-10 bg-white shadow rounded-lg px-10 py-5"
      >
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
            name="pwd"
            required
            placeholder="Your password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <button className="bg-sky-700 w-full py-3 rounded mt-2 text-white font-bold uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors">
          Login
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
          to="/forgot-password"
          className="block text-center text-slate-500 text-sm hover:text-slate-700 transition-colors hover:bg-white"
        >
          Forgot your PASSWORD?
        </Link>
      </nav>
    </>
  );
};

export default Login;

export async function action({request, params}){
  const data = await request.formData();
  const newUser = {
    email: data.get('email'),
    password: data.get('pwd')
  };

  try {
    const {data} = await axiosClient.post("/users/login", newUser);
    if(data.token){
      localStorage.setItem('pmt',data.token);
      return redirect('/projects');
    }
    else{
      return json(data);
    }
  } catch (error) {
    return json({msg:error.message, error:true});
  }
}