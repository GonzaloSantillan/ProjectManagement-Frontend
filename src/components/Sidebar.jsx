import { Link } from "react-router-dom";

const Sidebar = ({name}) => {
    return ( <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-5">
        <p className="text-xl font-bold">Hi: {name}</p>
        <Link to="create-project" className="bg-sky-600 w-full p-3 text-white uppercase font-bold block mt-5 text-center rounded-lg">Create A New Project</Link>
    </aside> );
}
 
export default Sidebar;