import Overview from "./overview";
import Deployments from "./deployments";
import Commits from "./commits";
import Settings from "./settings";

export default [
  {
    path: "overview",
    component: Overview,
  },
  {
    path: "commits",
    component: Commits,
  },
  {
    path: "deployments",
    component: Deployments,
  },
  {
    path: "settings",
    component: Settings,
  },
];
