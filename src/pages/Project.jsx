import { useLoaderData, json, Link, useOutletContext, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import axiosClient from "../helpers/axiosClient";
import ModalTask from "../components/ModalTask";
import Task from "../components/Task";
import Alert from "../components/Alert";
import Collaborator from "../components/Collaborator";

const Project = () => {
  const navigate =useNavigate();
  const currentProject = useLoaderData();
  const { _id, name, tasks, collaborators } = currentProject;
  const { setModalTask, alertMsg, setAlert, setIsAdmin, auth, isAdmin, socket } = useOutletContext();

  useEffect(()=>{
    socket.emit('Open Project', _id);
  },[]);

  useEffect(()=>{
    socket.on('Task Added',(idP)=>{
      if(_id===idP){
        console.log('Navega task added');
        navigate(`/projects/${idP}`);
      }
    });
    socket.on('Task Deleted',(idP)=>{
      if(_id===idP){
        console.log('Navega task deleted');
        navigate(`/projects/${idP}`);
      }
    });
    socket.on('Task Updated',(idP)=>{
      if(_id===idP){
        console.log('Navega task updated');
        navigate(`/projects/${idP}`);
      }
    });
    socket.on('Task State Changed',(idP)=>{
      if(_id===idP){
        console.log('Navega state changed');
        navigate(`/projects/${idP}`);
      }
    });
});

  useEffect(() => {
    if (currentProject._id) {
      setIsAdmin(auth._id.toString()===currentProject.creator.toString());
      if(alertMsg?.msg){
        setTimeout(() => {
          setAlert(undefined)
        }, 3000);
      } else {
        setAlert(undefined);
      }
    } else {
      setAlert(currentProject);
    }
  }, [currentProject]);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-black text-4xl">{name}</h1>
        {isAdmin && <div className="flex items-center gap-2 text-gray-500 hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          <Link
            to={`/projects/edit/${_id}`}
            state={currentProject}
            className="uppercase font-bold"
          >
            Edit
          </Link>
        </div>}
      </div>
      {isAdmin && <button
        onClick={() => setModalTask(true)}
        type="button"
        className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        New Task
      </button>}
      <p className="font-bold text-xl mt-10">Tasks of the project</p>
      {alertMsg && <Alert alert={alertMsg} />}
      <div className="bg-white shadow mt-10 rounded-lg p-5">
        {tasks?.length ? (
          tasks.map((t) => <Task key={t._id} t={t} />)
        ) : (
          <p className="text-center my-5 p-10">
            No tasks created for this project.
          </p>
        )}
      </div>
      {isAdmin && <><div className="flex items-center justify-between mt-10">
        <p className="font-bold text-xl">Collaborators</p>
        <div className="flex items-center gap-2 text-gray-500 hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <Link
            to={`/projects/${_id}/add-collaborator`}
            state={currentProject}
            className="uppercase font-bold"
          >
            Add Collaborator
          </Link>
        </div>
      </div>
      <div className="bg-white shadow mt-10 rounded-lg p-5">
        {collaborators?.length ? (
          collaborators.map((c) => <Collaborator key={c._id} c={c} />)
        ) : (
          <p className="text-center my-5 p-10">
            No collaborators added to this project.
          </p>
        )}
      </div></>}
      <ModalTask />
    </>
  );
};

export default Project;

export async function loader(request, params) {
  const { id } = request.params;
  const token = localStorage.getItem("pmt");
  if (!token) {
    return json({
      msg: "Does not exist a valid token, we could not send your new project, try login again",
      error: true,
    });
  }
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const { data } = await axiosClient(`/projects/${id}`, config);
    return data;
  } catch (error) {
    return json({ msg: error.message, error: true });
  }
}
