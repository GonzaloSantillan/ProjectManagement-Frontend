import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import io from "socket.io-client";

import Alert from "../components/Alert";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

let socket;

const ProjectLayout = () => {
  const navigate = useNavigate()
  const [auth, setAuth] = useState(useLoaderData());
  const [projects, setProjects] = useState([]);
  const [modalTask, setModalTask] = useState(false);
  const [currentTask, setCurrentTask] = useState();
  const [alertMsg, setAlert] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);

  useEffect(()=>{
    socket = io(import.meta.env.VITE_BACKEND_URL);
  },[]);

  const setLoadProjects = (proj) => {
    setProjects(proj);
  };

  const endSession=()=>{
    if(window.confirm('Are you sure to close your session?')){
      localStorage.removeItem('pmt');
      setAuth(undefined);
      setProjects([]);
      setCurrentTask(undefined);
      setAlert(undefined);
      navigate('/');
    }
  };

  if (!auth) {
    return (
      <div className="container">
        <Alert
          alert={{
            msg: "API to verify credencials not available.",
            error: true,
          }}
        />
      </div>
    );
  }
  return (
    <div className="bg-gray-100">
      <Header setModalSearch={setModalSearch} modalSearch={modalSearch} projects={projects} endSession={endSession}/>
      <div className="md:flex md:min-h-screen py-10">
        <Sidebar name={auth.name} />
        <main className="flex-1 px-5">
          <Outlet
            context={{
              auth,
              projects,
              setLoadProjects,
              modalTask,
              setModalTask,
              currentTask,
              setCurrentTask,
              alertMsg,
              setAlert,
              isAdmin,
              setIsAdmin, 
              socket
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default ProjectLayout;
