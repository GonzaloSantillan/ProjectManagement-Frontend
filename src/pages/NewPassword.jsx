import { useEffect, useState } from "react";
import { useParams, Form, json, useActionData, useNavigate, Link } from "react-router-dom";

import Alert from "../components/Alert";
import axiosClient from "../helpers/axiosClient";

const NewPassword = () => {
  const data = useActionData();
  const navigate = useNavigate();
  const { token } = useParams();
  const [valid, setValid] = useState(false);
  const [alert, setAlert] = useState();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (token) {
      const confirmToken = async () => {
        try {
          const url = `/users/forgot-password/${token}`;
          const { data } = await axiosClient(url);
          setValid(true);
        } catch (error) {
          setAlert({ msg: error.response.data.msg, error: true });
        }
      };
      return () => {
        confirmToken();
      };
    }
  }, []);

  useEffect(()=>{
    if(data){
      setAlert(data);
      if(!data.error){
        const f = document.getElementById("sendedForm");
        f.reset();
        setConfirmed(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    }
  },[data]);

  const setInvalidMsg=(e)=>{
    setAlert({msg:"Insert a valid password", error:true});
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recover your password, don't lose your{" "}
        <span className="text-slate-700">projects.</span>
      </h1>
      <Alert alert={alert}/>
      {valid && <Form id="sendedForm" method="post" className="my-10 bg-white shadow rounded-lg px-10 py-5" onInvalid={setInvalidMsg}>
        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            name="pwd"
            required
            placeholder="Insert Your New Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <input
          type="submit"
          value={"Change password"}
          className="bg-sky-700 w-full py-3 rounded mt-2 text-white font-bold uppercase hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </Form>}
      {confirmed || !valid && <Link
            to="/"
            className="block text-center text-slate-500 text-sm hover:text-slate-700 transition-colors hover:bg-white mt-5"
          >
            {'BACK TO LOGIN'}
          </Link> }
    </>
  );
};

export default NewPassword;

export async function action({request, params}){
  const {token} = params;
  const data = await request.formData();
  const pwd = data.get('pwd');
  
  if(pwd.length<6){
    return json({msg:'Your password must be SIX or More characters!', error:true});
  }

  try {
    const {data} = await axiosClient.post(`/users/forgot-password/${token}`, {password:pwd});
    return data;
  } catch (error) {
    return json({msg:error.message, error:true});
  } 
}