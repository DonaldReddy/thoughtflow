import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import type { Task } from "../../types";
import TaskCard from "./TaskCard";

export default function TaskList() {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			const response = await supabase
				.from("tasks")
				.select("*")
				.eq("pinned", false)
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
		const unpinned_channel = supabase.channel("unpinned-tasks");
		unpinned_channel
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
						setTasks((prevTasks) =>
							prevTasks.filter((task) => task.id !== newTask.id),
						);
					} else {
						setTasks((prevTasks) => [newTask, ...prevTasks]);
					}
				},
			)
			.subscribe();

		const insert_channel = supabase.channel("insert-tasks");
		insert_channel
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "tasks",
				},
				(payload) => {
					const newTask = payload.new as Task;
					setTasks((prevTasks) => [newTask, ...prevTasks]);
				},
			)
			.subscribe((status) => {
				console.log("Insert channel status:", status);
			});

		return () => {
			unpinned_channel.unsubscribe();
			insert_channel.unsubscribe();
		};
	}, []);

	return (
		<div className="columns-1 md:columns-2 lg:columns-4 gap-4 p-4 space-y-4 mt-5">
			{tasks.map((task) => (
				<TaskCard key={task.id} {...task} />
			))}
		</div>
	);
}
