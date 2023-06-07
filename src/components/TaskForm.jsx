import { Form, json, useActionData, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import Alert from "./Alert";
import axiosClient from "../helpers/axiosClient";

const PRIORITY = ["Low", "Medium", "High"];

const TaskForm = () => { 
  const [sended, setSended] = useState(false);
  const { setModalTask, currentTask, setCurrentTask, alertMsg, setAlert } = useOutletContext();
  const navigate = useNavigate();
  const data = useActionData();

  useEffect(() => {
    if (data) {
      if (!data.error) {
        if (data.msg) {
          setAlert(data);
        } else {
          setAlert({
            msg: currentTask? 'Task modified successfully':'Task created successfully',
          });
        }
        setSended(true);
        setTimeout(() => {
          setCurrentTask(undefined);  
          setModalTask(false);
          navigate('.');
        }, 2000);
      } else {
        setAlert(data);
      }
    }
  }, [data]);

  const setInvalidMsg = (e) => {
    setAlert({ msg: "All fields are required", error: true });
  };

  return (
    <Form method={currentTask? 'put':'post'} onInvalid={setInvalidMsg}>
      <div className="mb-10">
        <Alert alert={alertMsg} />
      </div>
      <div className="mb-5">
        <label
          htmlFor="name"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Task Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Task Name"
          defaultValue={currentTask? currentTask.name:''}
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
          placeholder="Description of the task"
          defaultValue={currentTask? currentTask.description:''}
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
          defaultValue={currentTask? currentTask.deadline?.split('T')[0]:''}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="priority"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          required
          className="border w-full p-2 mt-2 rounded-md"
          defaultValue={currentTask? currentTask.priority:''}
        >
          <option value="">{`<--Seleccionar-->`}</option>
          {PRIORITY.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
      <input name="taskId" type="hidden" defaultValue={currentTask ? currentTask._id:''} />
      {!sended && <button className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors text-sm">
        {currentTask? 'Edit Task':'Create Task'}
      </button>}
    </Form>
  );
};

export default TaskForm;

export async function action({ request, params }) {
  const dataF = await request.formData();
  let socket = io(import.meta.env.VITE_BACKEND_URL);
  try {
    const {id} = params;
    const method = request.method;
    const token = localStorage.getItem("pmt");
    if (!token) {
      return json({
        msg: "Does not exist a valid token, we could not send your new project, try login again",
        error: true,
      });
    }
    const newTask = {
      name: dataF.get("name"),
      description: dataF.get("description"),
      deadline: dataF.get('deadline'),
      priority: dataF.get("priority"),
      project: id
    };
    const idTask  = dataF.get("taskId");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    if (method === "PUT") {
      const { data } = await axiosClient.put(`/tasks/${idTask}`,newTask,config);
      //SOCKET IO
      socket.emit('Update Task',id);
      return data;
    }
    if (method === "DELETE") {
      const { data } = await axiosClient.delete(`/tasks/${idTask}`,config);
      //SOCKET IO
      socket.emit('Delete Task',id);
      return data;
    }
    if(method === "POST" && idTask){
      const { data } = await axiosClient.post(`/tasks/state/${idTask}`,{}, config);
      //SOCKET IO
      socket.emit('Change State Task',id);
      return data;
    }
    const { data } = await axiosClient.post(`/tasks`, newTask, config);
    //SOCKET IO
    socket.emit('New Task',data.project);
    return data;
  } catch (error) {
    return json({ msg: error.message, error: true });
  }
}
