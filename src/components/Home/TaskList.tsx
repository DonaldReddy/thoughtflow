import TaskCard from "./TaskCard";
import { taskStore } from "../../mobx/TaskStore";
import { observer } from "mobx-react";

const TaskList = () => {
	const tasks = taskStore.getUnpinnedTasks;
	const task_count = taskStore.getTasksCount;

	return (
		<>
			{task_count - tasks.length > 0 && (
				<h2 className="text-sm p-4 my-4 uppercase">Other Tasks</h2>
			)}
			<div className="columns-1 md:columns-2 lg:columns-4 gap-4 p-4 space-y-4 mt-5">
				{tasks.map((task) => (
					<TaskCard key={task.id} {...task} />
				))}
			</div>
		</>
	);
};

export default observer(TaskList);
