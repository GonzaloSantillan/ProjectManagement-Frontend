import { useLocation, useActionData, useOutletContext, Form } from "react-router-dom";
import CollaboratorForm from "../components/CollaboratorForm";
import { useEffect } from "react";

const NewCollaborator = () => {
  const { state } = useLocation();
  const data = useActionData();
  const { setAlert } = useOutletContext();

  useEffect(()=>{
    if(data){
        setAlert(data);
        setTimeout(() => {
          setAlert(undefined)
        }, 3000);
    }
  },[data]);

  return (
    <>
      <h1 className="text-4xl font-black">Add Collaborator to project:</h1>
      <h3 className="text-3xl text-gray-500">{state?.name}</h3>
      <div className="mt-10 flex justify-center">
        <CollaboratorForm />
      </div>
      {data?._id && <div className="flex justify-center mt-10">
            <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
                <h2 className="text-center mb-10 text-2xl font-bold">Result:</h2>
                <Form method="post">
                  <div className="flex justify-between items-center">
                      <p className="font-bold">{data.name}</p>
                      <input type="hidden" name='email' value={data.email} />
                      <button name="operation" value="add" className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm hover:bg-slate-800">Add to project</button>
                  </div>
                </Form>
            </div>
        </div>}
    </>
  );
};

export default NewCollaborator;
