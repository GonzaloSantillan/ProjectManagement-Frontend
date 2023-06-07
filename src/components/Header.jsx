import { Link, useLocation } from "react-router-dom";
import ModalSearch from "./ModalSearch";

const Header = ({modalSearch, setModalSearch, projects, endSession}) => {
    const location = useLocation();
    return ( <header className="px-4 py-5 bg-white border-b">
            <div className="md:flex md:justify-between">
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">Project Manager</h2>
                <div className="flex items-center gap-4">
                    {location.pathname === "/projects" && <button className="font-bold uppercase" type="button" onClick={()=>setModalSearch(true)}>Search Projects</button>}
                    <Link to="/projects" className="font-bold uppercase">Projects</Link>
                    <button onClick={endSession} type="button" className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold">Logout</button>
                </div>
            </div>
            <ModalSearch setModalSearch={setModalSearch} modalSearch={modalSearch} projects={projects}/>
        </header> );
}
 
export default Header;