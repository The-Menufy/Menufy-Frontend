export const MenuList = [
  {
    title: "📊 Tableau de bord",
    classsChange: "mm-collapse",
    iconStyle: <i className="flaticon-381-networking" />,
    content: [
      { title: "🏠 Accueil", to: "dashboard" },
      { title: "👨‍💼 Admin", to: "" },
      { title: "👑 Super Admin", to: "SuperAdmin" },
      { title: "🏪 Restaurant", to: "Resto" },
      { title: "🧂 Ingrédients", to: "ingredients" },
      { title: "🔀 Variantes", to: "/manage-variants" },
    ],
  },
  {
    title: "📋 Gestion du menu",
    classsChange: "mm-collapse",
    iconStyle: <i className="flaticon-381-networking" />,
    content: [
      { title: "📜 Menu", to: "MenuList" },
      { title: "🗂️ Catégorie", to: "category" },
      { title: "🍔 Produit", to: "product" },
      { title: "🍽️ Plat du jour", to: "DishOfTheDay" },
      { title: "📈 Statistiques", to: "Statistics" },
      { title: "💬 Discussion Admin", to: "chatbox" },
      { title: "👨‍🍳 AiPanel", to: "/AIPanel" },
      { title: "🧾 Stock", to: "/Stock" },

    ],
  },
];
