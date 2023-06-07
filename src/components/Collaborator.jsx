import { useEffect } from "react";
import { Form, useParams, useOutletContext, useActionData } from "react-router-dom";

const Collaborator = ({ c }) => {
  const params = useParams();
  const {id} = params;
  const { setAlert } = useOutletContext();
  const data = useActionData();

  useEffect(()=>{
    if(data){
        setAlert(data);
    }
  },[data]);
  
  const onDeleteHandler = (e) => {
    if (window.confirm(`Are you sure to remove collaborator: ${c.name} from the project?
    ${c.name.toUpperCase()} will not be able to see this project anymore.`)) {
      return true;
    }
    e.preventDefault();
  };

  return (
    <div className="border-b p-5 flex justify-between">
      <div>
        <p>{c.name}</p>
        <p className="text-sm text-gray-700">{c.email}</p>
      </div>
      <Form method="post" action={`/projects/${id}`}>
        <input type="hidden" name="idCollab" value={c._id} />
        <button
          name="operation"
          value="remove"
          className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          onClick={onDeleteHandler}
        >
          Delete
        </button>
      </Form>
    </div>
  );
};

export default Collaborator;
