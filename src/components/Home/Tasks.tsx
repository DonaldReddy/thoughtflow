import React from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import PinnedTaskList from "./PinnedTaskList";

export default function Tasks() {
	return (
		<div className="">
			<TaskInput />
			<PinnedTaskList />
			<TaskList />
		</div>
	);
}
