import { useEffect } from "react";
import { useLoaderData, useOutletContext, json } from "react-router-dom";

import axiosClient from "../helpers/axiosClient";
import ProjectView from "../components/ProjectView";

const Projects = () => {
    const {projects, setLoadProjects} = useOutletContext();
    const data = useLoaderData();
    
    useEffect(()=>{
        if(data){
          if(!data.error){
            setLoadProjects(data);
          } 
        }
      },[data]);
    
    return ( <>
        <h1 className="text-4xl font-black">Projects</h1>
        <div className="bg-white shadow mt-10 rounded-lg">
            {projects.length ? projects.map((proj)=><ProjectView key={proj._id} proj={proj}/>) :<p className="text-center text-gray-600 uppercase p-5">You don't have projects yet</p>}
        </div>
    </> );
}
 
export default Projects;

export async function loader(){
    const token = localStorage.getItem('pmt');
    if(!token){
      return json({msg:'Does not exist a valid token, we could not send your new project, try login again', error:true})
    }
    try {
        const config ={
          headers:{
            "Content-Type":"application/json",
            Authorization:'Bearer '+token
          }
        };
        const {data} = await axiosClient('/projects', config);
        return data;
      } catch (error) {
        return json({msg:error.message, error:true});
      }
}