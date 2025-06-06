import { useEffect, useState } from "react";
import { IoMenu, IoSearchOutline } from "react-icons/io5";
import { LuNotebookPen, LuUserRound } from "react-icons/lu";
import { Link, useNavigate, useSearchParams } from "react-router";
import { userStore } from "../mobx/UserStore";
import { supabase } from "../supabase/client";
import { taskStore } from "../mobx/TaskStore";

export default function NavBar() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const user = userStore.user;
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		taskStore.clearTasks();
		userStore.signOut();
		navigate("/sign-in");
	};

	useEffect(() => {
		if (search) {
			searchParams.set("search", search);
		} else {
			searchParams.delete("search");
		}
		setSearchParams(searchParams);
	}, [search]);

	return (
		<div className="flex items-center justify-between p-4 fixed top-0 left-0 w-full max-w-[1600px] bg-white border-b border-gray-300 z-50">
			<div className="flex items-center gap-x-4">
				{user && <IoMenu size={30} />}
				<div className="flex items-center gap-x-2">
					<LuNotebookPen size={30} />
					<Link to={"/"} className="">
						<span className="text-2xl ">My Notes</span>
					</Link>
				</div>
			</div>

			{user && (
				<div className="w-3/5">
					<label className="flex items-center gap-x-2 w-full bg-gray-200 px-2 rounded-md">
						<IoSearchOutline size={26} />

						<input
							type="text"
							placeholder="Search notes..."
							className="p-2 border-none rounded-md outline-none w-full"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</label>
				</div>
			)}

			{!user && (
				<div className="flex items-center gap-x-4">
					<Link to="/sign-in" className=" hover:underline">
						Login
					</Link>
					<Link to="/sign-up" className=" hover:underline ml-2">
						Sign Up
					</Link>
				</div>
			)}

			{user && (
				<div className=" relative group">
					<LuUserRound size={32} className="bg-gray-300 rounded-full p-1" />
					<div className=" hidden group-hover:flex absolute right-0 top-full w-48 bg-white border border-gray-300 rounded-md shadow-lg py-4 px-2 flex-col items-center justify-center">
						<span className="text-md">{user.email}</span>
						<Link
							to="/profile"
							className="text-md text-blue-500 hover:underline ml-2"
						>
							Profile
						</Link>
						<button
							className="text-md text-red-500 hover:underline ml-2 cursor-pointer"
							onClick={handleSignOut}
						>
							Sign Out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
