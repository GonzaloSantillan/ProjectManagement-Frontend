import { useOutletContext, Form, useActionData } from "react-router-dom";
import formatDate from "../helpers/formatDate";
import { useEffect } from "react";

const Task = ({ t }) => {
  const { setCurrentTask, setModalTask, setAlert, isAdmin } = useOutletContext();
  const data = useActionData();

  useEffect(() => {
    if (data) {
      if (!data.error) {
        setAlert(data);
        setTimeout(() => {
          setCurrentTask(undefined);
        }, 3000);
      } else {
        setAlert(data);
      }
    }
  }, [data]);

  const onEditHandler = () => {
    setCurrentTask(t);
    setModalTask(true);
  };

  const onDeleteHandler = (e) => {
    if (window.confirm(`Are you sure to delete the task: ${t.name}?`)) {
      return true;
    }
    e.preventDefault();
  };

  return (
    <div className=" border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl">{t.name}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{t.description}</p>
        <p className="mb-1 text-lg">{formatDate(t.deadline)}</p>
        <p className="mb-1 text-gray-600">{t.priority}</p>
        {t.state && <p className="text-xs bg-green-500 text-white font-bold uppercase p-1 rounded-lg">Finished by: {t.finishBy.name}</p> }
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {isAdmin && <button
          className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-indigo-900"
          onClick={onEditHandler}
        >
          Edit
        </button>}

        <Form method={"post"}>
        <input name="taskId" type="hidden" defaultValue={t._id} />
        <button className={`${t.state ? 'bg-sky-600 hover:bg-sky-800' : 'bg-gray-600 hover:bg-gray-800'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}>
          {t.state ? 'Complete' : 'Pending'}
        </button>
        </Form>
  
        {isAdmin && <Form method={"delete"}>
          <input name="taskId" type="hidden" defaultValue={t._id} />
          <button
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg hover:bg-red-900"
            onClick={onDeleteHandler}
          >
            Delete
          </button>
        </Form>}
      </div>
    </div>
  );
};

export default Task;
