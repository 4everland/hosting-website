import Overview from "./overview";
import Deployments from "./deployments";
import Commits from "./commits";
import Settings from "./settings";

export default [
  {
    path: "overview",
    component: Overview,
    meta: {
      title: "{projName} - Overview",
    },
  },
  {
    path: "commits",
    component: Commits,
    meta: {
      title: "{projName} - Commits",
    },
  },
  {
    path: "deployments",
    component: Deployments,
    meta: {
      title: "{projName} - Deployments",
    },
  },
  {
    path: "settings",
    component: Settings,
    meta: {
      title: "{projName} - Settings",
    },
  },
];
