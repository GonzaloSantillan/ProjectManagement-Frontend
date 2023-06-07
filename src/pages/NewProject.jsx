import ProjectsForm from "../components/ProjectsForm";

const NewProject = () => {
    return ( <>
        <h1 className="text-4xl font-black">Create Projects</h1>
        <div className="mt-10 flex justify-center">
            <ProjectsForm method="post"/>
        </div>
    </> );
}
 
export default NewProject;