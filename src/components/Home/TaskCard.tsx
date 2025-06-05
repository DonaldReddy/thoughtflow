import { useState } from "react";
import type { Task } from "../../types";
import { FaRegCircleCheck } from "react-icons/fa6";
import { BsPin } from "react-icons/bs";
import { supabase } from "../../supabase/client";

export default function TaskCard(props: Task) {
	const [isHovered, setIsHovered] = useState(false);

	const handlePinClick = async () => {
		await supabase
			.from("tasks")
			.update({ pinned: props.pinned ? "FALSE" : "TRUE" })
			.eq("id", props.id);
	};

	return (
		<div
			className="bg-white shadow-black/10 shadow-[0_0_5px_5px] rounded-lg p-4 break-inside-avoid relative transition-all duration-500 ease-in-out pt-8"
			onMouseEnter={() => setIsHovered(true)}
			onMouseMove={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<FaRegCircleCheck
				className={`absolute left-2 top-1 transition-all duration-500 ease-in-out cursor-pointer ${
					isHovered ? "opacity-100" : "opacity-0"
				}`}
				size={20}
			/>

			<BsPin
				className={`absolute right-2 top-1 transition-all duration-500 ease-in-out cursor-pointer ${
					isHovered ? "opacity-100" : "opacity-0"
				}`}
				size={20}
				onClick={handlePinClick}
			/>

			<h3 className="text-xl font-semibold">{props.title}</h3>
			<p className="text-gray-600">{props.description}</p>
		</div>
	);
}
