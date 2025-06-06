import TaskCard from "./TaskCard";
import { taskStore } from "../../mobx/TaskStore";
import { observer } from "mobx-react";

const PinnedTaskList = () => {
	const tasks = taskStore.getPinnedTasks;

	return (
		<>
			{tasks.length > 0 && (
				<h2 className="text-sm p-4 my-4 uppercase">Pinned Tasks</h2>
			)}
			<div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 space-y-4 mt-5">
				{tasks.map((task) => (
					<TaskCard key={task.id} {...task} />
				))}
			</div>
		</>
	);
};

export default observer(PinnedTaskList);
