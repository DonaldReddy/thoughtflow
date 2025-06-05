import React, { useEffect, useState } from "react";
import type { Task } from "../../types";
import { supabase } from "../../supabase/client";
import TaskCard from "./TaskCard";

export default function PinnedTaskList() {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			const response = await supabase
				.from("tasks")
				.select("*")
				.eq("pinned", true)
				.order("created_at", { ascending: false });
			if (response.error) {
				console.error("Error fetching tasks:", response.error);
			} else {
				setTasks(() => [...(response.data as Task[])]);
			}
		};

		fetchTasks();
	}, []);

	useEffect(() => {
		const channel = supabase.channel("pinned-tasks");
		channel
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "tasks",
				},
				(payload) => {
					const newTask = payload.new as Task;
					if (newTask.pinned) {
						setTasks((prevTasks) => [newTask, ...prevTasks]);
					} else {
						setTasks((prevTasks) =>
							prevTasks.filter((task) => task.id !== newTask.id),
						);
					}
				},
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, []);

	return (
		<>
			{tasks.length > 0 && (
				<h2 className="text-sm p-4 my-4 uppercase">Pinned Tasks</h2>
			)}
			<div className="columns-1 md:columns-2 lg:columns-4 gap-4 p-4 space-y-4 mt-5">
				{tasks.map((task) => (
					<TaskCard key={task.id} {...task} />
				))}
			</div>
		</>
	);
}
