import Overview from "./overview";
import Source from "./source";
import Success from "./success";

export default [
  {
    path: "overview",
    component: Overview,
    meta: {
      title: "{projName} - Build Overview",
    },
  },
  {
    path: "source",
    component: Source,
    meta: {
      title: "{projName} - Build Source",
    },
  },
  {
    path: "success",
    component: Success,
    meta: {
      title: "{projName} - Build Success",
    },
  },
];
