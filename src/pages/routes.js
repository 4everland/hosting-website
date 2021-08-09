import Home from "./home";
import Dashboard from "./dashboard";
import DashChildren from "./dashboard/routes";
import ProjectNew from "./new";
import Project from "./project";
import ProjectChildren from "./project/routes";
import Build from "./build";
import BuildChildren from "./build/routes";
import Solution from "./solution";
import Templates from "./solution/templates";
import Changelog from "./docs/changelog";
import CloneFlow from "./new/clone-flow";

export default [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/new/clone-flow",
    component: CloneFlow,
  },
  {
    path: "/changelog",
    component: Changelog,
  },
  {
    path: "/changelog",
    component: Changelog,
  },
  {
    path: "/templates",
    component: Templates,
  },
  {
    path: "/solution/:name",
    component: Solution,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    children: DashChildren,
  },
  {
    path: "/new",
    component: ProjectNew,
  },
  {
    path: "/project/:id",
    component: Project,
    children: ProjectChildren,
  },
  {
    path: "/build/:projName/:taskId",
    component: Build,
    children: BuildChildren,
  },
];
