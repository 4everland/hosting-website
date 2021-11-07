import Refer from "./refer";
import Collections from "./collections";

export default [
  {
    path: "/collections",
    component: Collections,
    meta: {
      title: "Collections",
    },
  },
  {
    path: "/user/refer",
    component: Refer,
    meta: {
      title: "Refrrals",
    },
  },
];
