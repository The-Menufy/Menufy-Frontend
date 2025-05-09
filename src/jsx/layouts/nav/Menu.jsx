export const MenuList = [
  // Dashboard
  {
    title: "dashboard", // <-- key, not the string itself
    classsChange: "mm-collapse",
    iconStyle: <i className="flaticon-381-networking" />,
    content: [
      { title: "dashboard", to: "dashboard" },
      { title: "admin", to: "" },
      { title: "super_admin", to: "SuperAdmin" },
      { title: "restaurant", to: "Resto" },
      { title: "ingredients", to: "ingredients" },
      { title: "variants", to: "/manage-variants" },
    ],
  },
  // Apps
  {
    title: "menu_management",
    classsChange: "mm-collapse",
    iconStyle: <i className="flaticon-381-networking" />,
    content: [
      { title: "menu", to: "MenuList" },
      { title: "category", to: "category" },
      { title: "product", to: "product" },
      { title: "ingredient", to: "ingredient" },
      { title: "utensil", to: "Ustensile" },
      { title: "dish_of_the_day", to: "DishOfTheDay" },
      { title: "statistics", to: "Statistics" },
      { title: "ask_ai", to: "Chat" },
      { title: "admin_discussion", to: "chatbox" },
      { title: "variants", to: "/manage-variants" },
      {title:"Classification",to: "/classification",},
      {title:"Regression",to: "/regression",},
      { title:"Recommendation",to: "/recommendation",},
      { title:"Clustering",to: "/Clustering",}

    ],
  },
];
