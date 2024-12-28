import ErrorPage from "../pages/NotFoundPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ProjectDetailsPage from "../pages/ProjectDetailsPage.jsx";
import PostPage from "../pages/PostPage.jsx";
import ProjectsPage from "../pages/ProjectsPage.jsx";
import Admin from "../components/admin/Admin.jsx";
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import ContactPage from "../pages/ContactPage.jsx";
import ResumePage from "../pages/ResumePage.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" errorElement={<ErrorPage />}>
            <Route path="" element={<AboutPage/>}/>
            <Route path="about" element={<AboutPage />}/>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="contact" element={<ContactPage/>}/>
            <Route path="resume" element={<ResumePage />} />
            <Route path="admin" element={<Admin/>}/>
        </Route>
    )
);

export default router;