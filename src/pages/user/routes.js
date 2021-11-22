import Refer from "./refer";
import Collections from "./collections";
import Pricing from "./pricing";

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
      title: "Refrral",
    },
  },
  {
    path: "/pricing",
    component: Pricing,
    meta: {
      title: "Pricing",
    },
  },
];
