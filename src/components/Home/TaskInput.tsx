import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase/client";
import { userStore } from "../../mobx/UserStore";

export default function TaskInput() {
	const [isFocused, setIsFocused] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [note, setNote] = useState({
		title: "",
		description: "",
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		if (event) {
			event.preventDefault();
			if (note.title || note.description) {
				await supabase.from("tasks").insert({
					title: note.title,
					description: note.description,
					author: userStore.user?.id,
				});
				setNote({ title: "", description: "" });
				setIsFocused(false);
			}
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsFocused(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div className="flex justify-center">
			{!isFocused && (
				<div className="w-1/3 ">
					<input
						placeholder="Take a note..."
						onFocus={() => setIsFocused(true)}
						className="shadow-black/20 shadow-[0_0_10px_5px] w-full p-2 rounded"
					/>
				</div>
			)}
			{isFocused && (
				<div
					className=" shadow-black/20 shadow-[0_0_10px_5px] p-2 rounded space-y-1"
					ref={containerRef}
				>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							placeholder="Title"
							className="w-full p-2 border rounded outline-none border-none text-xl"
							value={note.title}
							onChange={(e) => setNote({ ...note, title: e.target.value })}
						/>
						<textarea
							rows={3}
							placeholder="Take a note..."
							className="w-full p-2 border rounded resize-none outline-none border-none"
							autoFocus
							value={note.description}
							onChange={(e) =>
								setNote({ ...note, description: e.target.value })
							}
						/>
						<button className="ml-2 p-2 bg-blue-500 text-white rounded cursor-pointer">
							Add Note
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
