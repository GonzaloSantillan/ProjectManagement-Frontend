import { useEffect, useState } from "react";
import { Form, useActionData, useNavigate, useNavigation, json } from "react-router-dom";
import Alert from "./Alert";
import axiosClient from "../helpers/axiosClient";

const ProjectsForm = ({proj, method}) => {
    const [alertMsg, setAlert] = useState();
    const [sended, setSended] = useState(false);
    const navigation = useNavigation();
    const data = useActionData();
    const navigate = useNavigate();
    const isSubmitting = navigation.state === 'submitting';

    useEffect(()=>{
      if(data){
        if(!data.error){
          const f = document.getElementById("sendedForm");
          f.reset();
          if(data.msg){
            setAlert(data);
          } else {
            setAlert({msg:`Project ${proj ? 'updated':'created'} successfully`});
          }
          setSended(true);
          setTimeout(() => {
            navigate("/projects");
          }, 3000);
        } else{
          setAlert({...data});
        }
      }
    },[data]);

    const setInvalidMsg=(e)=>{
        setAlert({msg:"All fields are required", error:true});
      }

  return (<>
    <Form id="sendedForm" method={method} className="bg-white py-10 px-5 md:w-1/2 rounded-lg" onInvalid={setInvalidMsg}>
      <div className="mb-10"><Alert alert={alertMsg}/></div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Project Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Project Name"
          defaultValue={proj? proj.name:''}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="description"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Description of the project"
          defaultValue={proj? proj.description:''}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="deadline"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Deadline
        </label>
        <input
          id="deadline"
          type="date"
          name="deadline"
          required
          className="border w-full p-2 mt-2 rounded-md"
          defaultValue={proj? proj.deadline?.split('T')[0]:''}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="client"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Client
        </label>
        <input
          id="client"
          type="text"
          name="client"
          required
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Client Name"
          defaultValue={proj? proj.client:''}
        />
      </div>

      {!sended && <button className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors">
        {isSubmitting ? 'Submitting...': proj ? 'Edit Project':'Create Project'}
      </button>}
    </Form></>
  );
};

export default ProjectsForm;

export async function action({request, params}){
    const dataF = await request.formData();
    const method = request.method;
    const token = localStorage.getItem('pmt');
    if(!token){
      return json({msg:'Does not exist a valid token, we could not send your new project, try login again', error:true})
    }
    const newProject = {
      name: dataF.get('name'),
      description: dataF.get('description'),
      deadline: dataF.get('deadline'),
      client:dataF.get('client')
    };
    try {
      const config ={
        headers:{
          "Content-Type":"application/json",
          Authorization:'Bearer '+token
        }
      };
      if(method==="PUT"){
        const {id} = params;
        const {data} = await axiosClient.put(`/projects/${id}`, newProject, config);
        return data;
      }
      if(method==="DELETE"){
        const {id} = params;
        const {data} = await axiosClient.delete(`/projects/${id}`, config);
        return data;
      }
      const {data} = await axiosClient.post(`/projects`, newProject, config);
      return data;
    } catch (error) {
      return json({msg:error.message, error:true});
    }
  }