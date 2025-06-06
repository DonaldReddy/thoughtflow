import { use, useEffect, useRef } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import PinnedTaskList from "./PinnedTaskList";
import { supabase } from "../../supabase/client";
import { taskStore } from "../../mobx/TaskStore";
import type { Task } from "../../types";
import { useSearchParams } from "react-router";

export default function Tasks() {
	const [searchParams, setSearchParams] = useSearchParams();
	const search = searchParams.get("search") || "";
	const timeOutRef = useRef<NodeJS.Timeout | null>(null);

	const fetchTasks = async () => {
		const response = await supabase
			.from("tasks")
			.select("*")
			.order("created_at", { ascending: false });
		if (response.error) {
			console.error("Error fetching tasks:", response.error);
		} else {
			taskStore.setTasks(response.data as Task[]);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	useEffect(() => {
		const fetchTasksBySearch = async () => {
			if (search.trim() === "") {
				await fetchTasks();
				return;
			}

			if (timeOutRef.current) {
				clearTimeout(timeOutRef.current);
			}

			timeOutRef.current = setTimeout(async () => {
				const response = await supabase
					.from("tasks")
					.select("*")
					.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
					.order("created_at", { ascending: false });

				if (response.error) {
					console.error("Error fetching tasks by search:", response.error);
				} else {
					taskStore.setTasks(response.data as Task[]);
				}
			}, 800);
		};

		fetchTasksBySearch();
		return () => {
			if (timeOutRef.current) {
				clearTimeout(timeOutRef.current);
			}
		};
	}, [search]);

	useEffect(() => {
		const task_channel = supabase.channel("insert-tasks");
		task_channel
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "tasks",
				},
				(payload) => {
					const newTask = payload.new as Task;
					const oldTask = payload.old as Task;
					if (payload.eventType === "INSERT") taskStore.addTask(newTask);
					else if (payload.eventType === "UPDATE")
						taskStore.updateTask(newTask.id, newTask);
					else if (payload.eventType === "DELETE")
						taskStore.deleteTask(oldTask.id);
				},
			)
			.subscribe((status) => {
				console.log("Task channel status:", status);
			});

		return () => {
			task_channel.unsubscribe();
		};
	}, []);

	return (
		<div className="">
			<TaskInput />
			<PinnedTaskList />
			<TaskList />
		</div>
	);
}
