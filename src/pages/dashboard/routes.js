import Projects from "./projects";
import Domains from "./domains";
import Statistics from "./statistics";
import Billing from "./billing";
import Settings from "./settings";
import FirstLanding from "./act-first-landing";
import StatisTest from "./statistics-dev";

export default [
  {
    path: "projects",
    component: Projects,
    meta: {
      title: "Dashboard",
    },
  },
  {
    path: "domains",
    component: Domains,
    meta: {
      title: "Domains - Dashboard",
    },
  },
  {
    path: "statistics",
    component: Statistics,
    meta: {
      title: "Statistic - Dashboard",
    },
  },
  {
    path: "billing",
    component: Billing,
    meta: {
      title: "Billing - Dashboard",
    },
  },
  {
    path: "settings",
    component: Settings,
    meta: {
      title: "Settings - Dashboard",
    },
  },
  {
    path: "first-landing",
    component: FirstLanding,
    meta: {
      title: "FirstLanding",
    },
  },
  {
    path: "statis-test",
    component: StatisTest,
  },
];
