import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router";
import Layout from "./Layout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Layout />}>
			<Route path="sign-in" element={<SignIn />} />
			<Route path="sign-up" element={<SignUp />} />
			<Route index element={<Home />} />
			<Route path="profile" element={<div>Profile</div>} />
		</Route>,
	),
);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
