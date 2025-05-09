export const MenuList = [
  {
    title: "dashboard",
    classsChange: "mm-collapse",
    iconStyle: <i className="flaticon-381-networking" />,
    content: [
      { title: "home", to: "dashboard" },
      { title: "admin", to: "" },
      { title: "super_admin", to: "SuperAdmin" },
      { title: "restaurant", to: "Resto" },
      { title: "ingredients", to: "ingredients" },
      { title: "variants", to: "/manage-variants" },
    ],
  },
  {
    title: "menu_management",
    classsChange: "mm-collapse",
    iconStyle: <i className="flaticon-381-networking" />,
    content: [
      { title: "menu", to: "MenuList" },
      { title: "category", to: "category" },
      { title: "product", to: "product" },
      { title: "dish_of_the_day", to: "DishOfTheDay" },
      { title: "statistics", to: "Statistics" },
      { title: "admin_discussion", to: "chatbox" },
      { title: "ai_panel", to: "/AIPanel" },
      { title: "stock", to: "/Stock" },
    ],
  },
];