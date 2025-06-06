import { useState, type MouseEvent } from "react";
import type { Task } from "../../types";
import { FaRegCircleCheck } from "react-icons/fa6";
import { BsPin, BsPinAngleFill } from "react-icons/bs";
import { supabase } from "../../supabase/client";
import TaskEdit from "./TaskEdit";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function TaskCard(props: Task) {
	const [isHovered, setIsHovered] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [showOptions, setShowOptions] = useState(false);

	const handlePinClick = async () => {
		await supabase
			.from("tasks")
			.update({ pinned: props.pinned ? "FALSE" : "TRUE" })
			.eq("id", props.id);
	};

	const handleDeleteClick = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		await supabase.from("tasks").delete().eq("id", props.id);
		setShowOptions(false);
	};

	const handleOptionsClick = (e: React.MouseEvent<SVGAElement>) => {
		e.stopPropagation();
		setShowOptions(true);
		document.body.addEventListener(
			"click",
			() => {
				setShowOptions(false);
			},
			{ once: true },
		);
	};

	return (
		<>
			<div
				className="bg-white shadow-black/10 shadow-[0_0_5px_5px] rounded-lg break-inside-avoid relative transition-all duration-500 ease-in-out pt-8 cursor-pointer"
				onMouseEnter={() => setIsHovered(true)}
				onMouseMove={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={() => setOpenEdit(true)}
			>
				<FaRegCircleCheck
					className={`absolute left-2 top-1 transition-all duration-500 ease-in-out cursor-pointer ${
						isHovered ? "opacity-100" : "opacity-0"
					}`}
					size={20}
				/>

				{props.pinned && (
					<BsPinAngleFill
						className={`absolute right-2 top-1 transition-all duration-500 ease-in-out cursor-pointer`}
						size={20}
						onClick={handlePinClick}
					/>
				)}

				{!props.pinned && (
					<BsPin
						className={`absolute right-2 top-1 transition-all duration-500 ease-in-out cursor-pointer ${
							isHovered ? "opacity-100" : "opacity-0"
						}`}
						size={20}
						onClick={handlePinClick}
					/>
				)}

				<h3 className="text-xl font-semibold px-4">{props.title}</h3>
				<p className="text-gray-600 px-4">{props.description}</p>
				<div className="flex items-center justify-end mt-4 border-t p-2 ">
					<HiOutlineDotsVertical
						className="hover:bg-gray-200 rounded-full"
						size={20}
						onClick={handleOptionsClick}
					/>
				</div>
				{showOptions && (
					<div className="absolute right-2 top-full bg-white shadow-lg rounded-lg p-2 z-10 border-[1px] border-gray-200">
						<button
							className="block w-full text-left px-4 py-2 hover:bg-gray-100"
							onClick={() => setOpenEdit(true)}
						>
							Edit Task
						</button>
						<button
							className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
							onClick={handleDeleteClick}
						>
							Delete Task
						</button>
					</div>
				)}
			</div>
			{openEdit && (
				<TaskEdit {...props} handleClose={() => setOpenEdit(false)} />
			)}
		</>
	);
}
