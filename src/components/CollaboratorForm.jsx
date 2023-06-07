import { Form, useNavigation, json, useOutletContext, redirect } from "react-router-dom";
import Alert from "./Alert";
import axiosClient from "../helpers/axiosClient";

const CollaboratorForm = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { alertMsg, setAlert } = useOutletContext();

  const setInvalidMsg = (e) => {
    setAlert({ msg: "All fields are required", error: true });
  };

  return (
    <Form
      method="post"
      className="bg-white px-5 w-full md:w-1/2 rounded-lg shadow"
      onInvalid={setInvalidMsg}
    >
      <div className="mb-5">
        <Alert alert={alertMsg} />
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Collaborator Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Insert collaborator email to search"
        />
      </div>

      <button name="operation" value="search" className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors mb-5">
        {isSubmitting ? "Searching..." : "Search Collaborator"}
      </button>
    </Form>
  );
};

export default CollaboratorForm;

export async function action({ request, params }) {
  const dataF = await request.formData();
  const {id} = params;
  const token = localStorage.getItem("pmt");
  if (!token) {
    return json({
      msg: "Does not exist a valid token, we could not send your new project, try login again",
      error: true,
    });
  }
  const email = dataF.get("email");
  const operation = dataF.get("operation");
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    if(operation==='search'){
      const { data } = await axiosClient.post(`/projects/collaborators`, {email}, config);
      return data;
    }
    if(operation==='add'){
      const { data } = await axiosClient.post(`/projects/collaborators/${id}`, {email}, config);
      if(data.error){
        return data;
      }
      return redirect(`/projects/${id}`);
    }
    if(operation==='remove'){
      const idCollab = dataF.get("idCollab");
      const { data } = await axiosClient.delete(`/projects/collaborators/${id}--&--${idCollab}`, config);
      return data;
    }
  } catch (error) {
    return json({ msg: error.message, error: true });
  }
}
