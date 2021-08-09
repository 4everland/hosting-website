import Projects from "./projects";
import Domains from "./domains";
import Statistics from "./statistics";
import Billing from "./billing";
import Settings from "./settings";

export default [
  {
    path: "projects",
    component: Projects,
  },
  {
    path: "domains",
    component: Domains,
  },
  {
    path: "statistics",
    component: Statistics,
  },
  {
    path: "billing",
    component: Billing,
  },
  {
    path: "settings",
    component: Settings,
  },
];
