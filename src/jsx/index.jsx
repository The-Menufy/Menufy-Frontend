/// React router dom
import { Routes, Route, Outlet } from "react-router-dom";
/// Css
import "./index.css";
import "./chart.css";
import "./step.css";
/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
/// Dashboard
import RecipeCostDetails from './components/Dashboard/RecipeCostDetails';
import Home from "./components/Dashboard/Home";
import Orders from "./components/Dashboard/Orders";
import OrderId from "./components/Dashboard/OrderId";
import GeneralCustomers from "./components/Dashboard/GeneralCustomers";
import Analytics from "./components/Dashboard/Analytics";
import Reviews from "./components/Dashboard/Reviews";
import Task from "./components/Dashboard/Task";
import Category from './components/Dashboard/Category';
import Product from './components/Dashboard/Product';
import Ingredient from './components/Dashboard/ingredtient';
import Ustensile from './components/Dashboard/Ustensile';
import DishOfTheDay from './components/Dashboard/DishOfTheDay';
import Chat from './components/Dashboard/Chat';
import MenuList from './components/Dashboard/Menus';
import MealRecommendation from "./components/Dashboard/MealRecommendation";
import  Recipe  from "./components/Dashboard/Recipe";
import Statistics from "./components/Dashboard/Statistics";
import AddRecipePage from "./components/Dashboard/AddRecipePage";
import UpdateRecipePage from "./components/Dashboard/UpdateRecipePage";
import ManageVariants from "./components/Dashboard/ManageVariants"; 

//CMS
import Content from "./components/Cms/Content";
import Menu from "./components/Cms/Menu";
import EmailTemplate from "./components/Cms/EmailTemplate";
import Blog from "./components/Cms/Blog";
import ContentAdd from "./components/Cms/ContentAdd";
import AddMail from "./components/Cms/AddMail";
import AddBlog from "./components/Cms/AddBlog";
import BlogCategory from "./components/Cms/BlogCategory";
/// App
import AppProfile from "./components/AppsMenu/AppProfile/AppProfile";
import PostDetails from "./components/AppsMenu/AppProfile/PostDetails";
import Compose from "./components/AppsMenu/Email/Compose/Compose";
import Inbox from "./components/AppsMenu/Email/Inbox/Inbox";
import Read from "./components/AppsMenu/Email/Read/Read";
import Calendar from "./components/AppsMenu/Calendar/Calendar";
/// Product List
import ProductGrid from "./components/AppsMenu/Shop/ProductGrid/ProductGrid";
import ProductList from "./components/AppsMenu/Shop/ProductList/ProductList";
import ProductDetail from "./components/AppsMenu/Shop/ProductGrid/ProductDetail";
import Checkout from "./components/AppsMenu/Shop/Checkout/Checkout";
import Invoice from "./components/AppsMenu/Shop/Invoice/Invoice";
import ProductOrder from "./components/AppsMenu/Shop/ProductOrder";
import EcomCustomers from "./components/AppsMenu/Shop/Customers/Customers";
/// Charts
import RechartJs from "./components/charts/rechart";
import ChartJs from "./components/charts/Chartjs";
// import Chartist from './components/charts/chartist'
import SparklineChart from "./components/charts/Sparkline";
import ApexChart from "./components/charts/apexcharts";
/// Bootstrap
import UiAlert from "./components/bootstrap/Alert";
import UiAccordion from "./components/bootstrap/Accordion";
import UiBadge from "./components/bootstrap/Badge";
import UiButton from "./components/bootstrap/Button";
import UiModal from "./components/bootstrap/Modal";
import UiButtonGroup from "./components/bootstrap/ButtonGroup";
import UiListGroup from "./components/bootstrap/ListGroup";
import UiCards from "./components/bootstrap/Cards";
import UiCarousel from "./components/bootstrap/Carousel";
import UiDropDown from "./components/bootstrap/DropDown";
import UiPopOver from "./components/bootstrap/PopOver";
import UiProgressBar from "./components/bootstrap/ProgressBar";
import UiTab from "./components/bootstrap/Tab";
import UiPagination from "./components/bootstrap/Pagination";
import UiGrid from "./components/bootstrap/Grid";
import UiTypography from "./components/bootstrap/Typography";
/// Plugins
import Select2 from "./components/PluginsMenu/Select2/Select2";
import Nestable from "./components/PluginsMenu/Nestable/Nestable";
import MainNouiSlider from "./components/PluginsMenu/NouiSlider/MainNouiSlider";
import MainSweetAlert from "./components/PluginsMenu/SweetAlert/SweetAlert";
import Toastr from "./components/PluginsMenu/Toastr/Toastr";
import Lightgallery from "./components/PluginsMenu/Lightgallery/Lightgallery";
/// Widget
import Widget from "./pages/Widget";
/// Table
import DataTable from "./components/table/DataTable";
import BootstrapTable from "./components/table/BootstrapTable";
import SortingTable from "./components/table/SortingTable/SortingTable";
import FilteringTable from "./components/table/FilteringTable/FilteringTable";
/// Form
import Element from "./components/Forms/Element/Element";
import Wizard from "./components/Forms/Wizard/Wizard";
import CkEditor from "./components/Forms/CkEditor/CkEditor";
import Pickers from "./components/Forms/Pickers/Pickers";
import FormValidation from "./components/Forms/FormValidation/FormValidation";
import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";
import Todo from "./pages/Todo";
//Scroll To Top
import ScrollToTop from "./layouts/ScrollToTop";
import AuthRouting from "./pages/auth/AuthRouting";
import Test from "./pages/auth/Test";
import Profile from "./pages/auth/profile/Profile";
import SuperDb from "./pages/Dashbord/SuperAdmin/SuperAdminDash";
import ArchivedSup from "./pages/Dashbord/SuperAdmin/ArchiverSuperAdmine";
import RestoDb from "./pages/Dashbord/Restaurant/DashRestaurants";
import Ingredients from "./pages/ingredients";
import AddIngredient from "./pages/ingredients/AddIngredient";
import EditIngredient from "./pages/ingredients/EditIngredient";
import ShowIngredient from "./pages/ingredients/ShowIngredient";
import ChatBox from "./components/chatBox/ChatBox";

const Markup = () => {
	const allroutes = [
		/// Dashboard
		{ url: "RecipeCostDetails", component: <RecipeCostDetails /> },
		{ url: "", component: <Home /> },
		{ url: "chatbox", component: <ChatBox currentUser="admin1" selectedUser="admin2" /> },
		{ url: "dashboard", component: <Home /> },
		{ url: "orders", component: <Orders /> },
		{ url: "Order-id", component: <OrderId /> },
		{ url: "general-customers", component: <GeneralCustomers /> },
		{ url: "analytics", component: <Analytics /> },
		{ url: "review", component: <Reviews /> },
		{ url: "task", component: <Task /> },
		{ url: 'category', component: <Category /> },
        { url: 'product', component: <Product /> },
        { url: 'ingredient', component: <Ingredient /> },
		{ url: 'Ustensile', component: <Ustensile /> },
        { url: 'DishOfTheDay', component: <DishOfTheDay /> },
		{ url: 'Chat', component: <Chat /> },
		{ url: 'MenuList', component: <MenuList /> },
		{ url: 'MealRecommendation', component: <MealRecommendation /> },
		{ url: 'Recipe/:id', component: <Recipe /> },
		{ url: 'Statistics', component: <Statistics /> },
		{ url: "recipe/:recipeId/cost", component: <RecipeCostDetails /> },
		{ url: "add-recipe", component: <AddRecipePage /> },
		{ url: "update-recipe/:id", component: <UpdateRecipePage /> },	
		{ url: "manage-variants", component: <ManageVariants /> },
		//Cms
		{ url: "content", component: <Content /> },
		{ url: "menu", component: <Menu /> },
		{ url: "email-template", component: <EmailTemplate /> },
		{ url: "blog", component: <Blog /> },
		{ url: "add-content", component: <ContentAdd /> },
		{ url: "add-email", component: <AddMail /> },
		{ url: "add-blog", component: <AddBlog /> },
		{ url: "blog-category", component: <BlogCategory /> },
		/// Apps
		{ url: "app-profile", component: <AppProfile /> },
		{ url: "post-details", component: <PostDetails /> },
		{ url: "email-compose", component: <Compose /> },
		{ url: "email-inbox", component: <Inbox /> },
		{ url: "email-read", component: <Read /> },
		{ url: "app-calender", component: <Calendar /> },
		/// Chart
		{ url: "chart-sparkline", component: <SparklineChart /> },
		{ url: "chart-chartjs", component: <ChartJs /> },
		{ url: "chart-apexchart", component: <ApexChart /> },
		{ url: "chart-rechart", component: <RechartJs /> },
		/// Bootstrap
		{ url: "ui-alert", component: <UiAlert /> },
		{ url: "ui-badge", component: <UiBadge /> },
		{ url: "ui-button", component: <UiButton /> },
		{ url: "ui-modal", component: <UiModal /> },
		{ url: "ui-button-group", component: <UiButtonGroup /> },
		{ url: "ui-accordion", component: <UiAccordion /> },
		{ url: "ui-list-group", component: <UiListGroup /> },
		{ url: "ui-card", component: <UiCards /> },
		{ url: "ui-carousel", component: <UiCarousel /> },
		{ url: "ui-dropdown", component: <UiDropDown /> },
		{ url: "ui-popover", component: <UiPopOver /> },
		{ url: "ui-progressbar", component: <UiProgressBar /> },
		{ url: "ui-tab", component: <UiTab /> },
		{ url: "ui-pagination", component: <UiPagination /> },
		{ url: "ui-typography", component: <UiTypography /> },
		{ url: "ui-grid", component: <UiGrid /> },
		/// Plugin
		{ url: "uc-select2", component: <Select2 /> },
		{ url: "uc-nestable", component: <Nestable /> },
		{ url: "uc-sweetalert", component: <MainSweetAlert /> },
		{ url: "uc-noui-slider", component: <MainNouiSlider /> },
		{ url: "uc-toastr", component: <Toastr /> },
		{ url: "uc-lightgallery", component: <Lightgallery /> },
		/// Widget
		{ url: "widget-basic", component: <Widget /> },
		/// Shop
		{ url: "ecom-product-grid", component: <ProductGrid /> },
		{ url: "ecom-product-list", component: <ProductList /> },
		{ url: "ecom-product-detail", component: <ProductDetail /> },
		{ url: "ecom-product-order", component: <ProductOrder /> },
		{ url: "ecom-checkout", component: <Checkout /> },
		{ url: "ecom-invoice", component: <Invoice /> },
		{ url: "ecom-product-detail", component: <ProductDetail /> },
		{ url: "ecom-customers", component: <EcomCustomers /> },
		/// Form
		{ url: "form-element", component: <Element /> },
		{ url: "form-wizard", component: <Wizard /> },
		{ url: "form-ckeditor", component: <CkEditor /> },
		{ url: "form-pickers", component: <Pickers /> },
		{ url: "form-validation", component: <FormValidation /> },
		/// table
		{ url: "table-datatable-basic", component: <DataTable /> },
		{ url: "table-bootstrap-basic", component: <BootstrapTable /> },
		{ url: "table-filtering", component: <FilteringTable /> },
		{ url: "table-sorting", component: <SortingTable /> },
		/// pages
		{ url: "todo", component: <Todo /> },
		{ url: "test", component: <Test /> },
		{ url: "profile", component: <Profile /> },
		{ url: "SuperAdmin", component: <SuperDb /> },
		{ url: "Archived", component: <ArchivedSup /> },
		{ url: "Resto", component: <RestoDb /> },
		{ url: "ingredients", component: <Ingredients /> },
		{ url: "ingredients/add", component: <AddIngredient /> },
		{ url: "ingredients/edit/:id", component: <EditIngredient /> },
		{ url: "ingredients/:id", component: <ShowIngredient /> },
	];
	return (
		<>
			<AuthRouting />
			<Routes>
				<Route path="page-lock-screen" element={<LockScreen />} />
				<Route path="page-error-400" element={<Error400 />} />
				<Route path="page-error-403" element={<Error403 />} />
				<Route path="page-error-404" element={<Error404 />} />
				<Route path="page-error-500" element={<Error500 />} />
				<Route path="page-error-503" element={<Error503 />} />
				<Route element={<MainLayout />}>
					{allroutes.map((data, i) => (
						<Route key={i} exact path={`${data.url}`} element={data.component} />
					))}
				</Route>
			</Routes>
			<ScrollToTop />
		</>
	);
};
function MainLayout() {
	// const { menuToggle } = useContext(ThemeContext);
	return (
		<div
			id="main-wrapper"
			// className={`show ${ menuToggle ? "menu-toggle" : ""}`}
			className="show"
		>
			<Nav />
			<div
				className="content-body"
				style={{ minHeight: window.screen.height - 45 }}
			>
				<div className="container-fluid">
					<Outlet />
				</div>
			</div>
			<Footer />
		</div>
	);
}
export default Markup;
