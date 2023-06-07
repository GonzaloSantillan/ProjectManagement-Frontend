import { Link, useOutletContext } from "react-router-dom";

const ProjectView = ({proj}) => {
    const {auth} = useOutletContext();
    const {name, client, _id, creator} = proj;

    return ( <div className="border-b p-5 flex flex-col md:flex-row justify-between">
        <div className="flex items-center gap-4">
            <p className="flex-1">
                {name}
                <span className="text-sm text-gray-500 uppercase">{` ${client}`}</span>
            </p>
            {auth._id!==creator && <p className="p-1 text-xs font-bold uppercase rounded-lg text-white bg-green-500">Collaborator</p> }
        </div>
        <Link to={`${_id}`} className="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold">View Project</Link>
    </div> );
}
 
export default ProjectView;