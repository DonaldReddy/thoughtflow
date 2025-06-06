import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import type { Task } from "../../types";
import { userStore } from "../../mobx/UserStore";
import { BsPin, BsPinFill } from "react-icons/bs";

export default function TaskEdit(props: Task & { handleClose: () => void }) {
	const [note, setNote] = useState({
		title: props.title || "",
		description: props.description || "",
		pinned: props.pinned || false,
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		if (event) {
			event.preventDefault();
			if (note.title || note.description) {
				await supabase
					.from("tasks")
					.update({
						title: note.title,
						description: note.description,
						author: userStore.user?.id,
						pinned: note.pinned,
						updated_at: new Date().toISOString(),
					})
					.eq("id", props.id);
				setNote({ title: "", description: "", pinned: false });
				props.handleClose(); // Close the edit form after submission
			}
		}
	};

	useEffect(() => {
		document.body.style.overflow = "hidden"; // Prevent scrolling when the modal is open
		document.body.style.height = "100dvh";
		return () => {
			document.body.style.overflow = "auto"; // Re-enable scrolling when the modal is closed
			document.body.style.height = "100%";
		};
	}, []);

	return (
		<div
			className=" absolute top-0 left-0 w-full h-full bg-black/50 shadow-black/20 shadow-[0_0_10px_5px] flex justify-center items-center z-50"
			onClick={props.handleClose}
		>
			<form
				onSubmit={handleSubmit}
				className="relative bg-white min-w-xl w-1/3 p-4 rounded-lg"
				onClick={(e) => e.stopPropagation()}
			>
				<input
					type="text"
					placeholder="Title"
					className="w-full p-2 border rounded outline-none border-none text-xl"
					value={note.title}
					onChange={(e) => setNote({ ...note, title: e.target.value })}
				/>
				{!note.pinned && (
					<BsPin
						size={24}
						onClick={(e) => {
							setNote({ ...note, pinned: true });
							e.stopPropagation();
						}}
						className="absolute top-2 right-2 cursor-pointer"
					/>
				)}
				{note.pinned && (
					<BsPinFill
						size={24}
						onClick={(e) => {
							setNote({ ...note, pinned: false });
							e.stopPropagation();
						}}
						className="absolute top-2 right-2 cursor-pointer"
					/>
				)}

				<textarea
					rows={3}
					placeholder="Take a note..."
					className="w-full p-2 border rounded resize-none outline-none border-none"
					autoFocus
					value={note.description}
					onChange={(e) => setNote({ ...note, description: e.target.value })}
				/>
				<div className="flex flex-col items-end justify-end">
					<span>
						Modified {new Date(props.updated_at).toLocaleDateString()}
					</span>
					<button className="ml-2 p-2  text-black rounded cursor-pointer">
						Close
					</button>
				</div>
			</form>
		</div>
	);
}
