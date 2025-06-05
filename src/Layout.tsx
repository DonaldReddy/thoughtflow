import { Outlet } from "react-router";
import NavBar from "./components/NavBar";

export default function Layout() {
	return (
		<div className="max-w-[1600px] relative">
			<NavBar />
			<div className="h-full w-full mt-[5rem]">
				<Outlet />
			</div>
		</div>
	);
}
