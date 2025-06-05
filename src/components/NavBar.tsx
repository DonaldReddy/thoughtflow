import { useEffect, useState } from "react";
import { IoMenu, IoSearchOutline } from "react-icons/io5";
import { LuNotebookPen, LuUserRound } from "react-icons/lu";
import { useSearchParams } from "react-router";

export default function NavBar() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") || "");

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
				<IoMenu size={30} />
				<div className="flex items-center gap-x-2">
					<LuNotebookPen size={30} />
					<span className="text-2xl ">My Notes</span>
				</div>
			</div>

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

			<div>
				<LuUserRound size={32} className="bg-gray-300 rounded-full p-1" />
			</div>
		</div>
	);
}
