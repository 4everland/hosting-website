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
import BugBounty from "./docs/bug-bounty";
import userRoutes from "./user/routes";
import StatisDetail from "./docs/statis-detail.vue";
import MintTPL from "./solution/mint-tpl";

export default [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/new/clone-flow",
    component: CloneFlow,
    meta: {
      title: "New Project",
    },
  },
  {
    path: "/bug-bounty",
    component: BugBounty,
    meta: {
      title: "Bug Bounty",
    },
  },

  {
    path: "/changelog",
    component: Changelog,
    meta: {
      title: "Changelog",
    },
  },
  {
    path: "/templates",
    component: Templates,
  },
  {
    path: "/mint-template",
    component: MintTPL,
  },
  {
    path: "/solution/:name",
    component: Solution,
    meta: {
      title: "New Project",
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    children: DashChildren,
  },
  {
    path: "/new",
    component: ProjectNew,
    meta: {
      title: "New Project",
    },
  },
  {
    path: "/project/:projName/:id",
    component: Project,
    children: ProjectChildren,
  },
  {
    path: "/build/:projName/:taskId",
    component: Build,
    children: BuildChildren,
  },
  {
    path: "/statistics/:projName/:id",
    component: StatisDetail,
    meta: {
      title: "{projName} - Statistic",
    },
  },
  ...userRoutes,
];
