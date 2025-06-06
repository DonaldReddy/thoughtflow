import { action, computed, makeObservable, observable } from "mobx";
import type { Task } from "../types";

class TaskStore {
	tasks: Task[] = [];

	constructor() {
		makeObservable(this, {
			tasks: observable,
			addTask: action,
			addTasks: action,
			setTasks: action,
			updateTask: action,
			deleteTask: action,
			clearTasks: action,
			getCompletedTasks: computed,
			getPendingTasks: computed,
			getUnpinnedTasks: computed,
			getPinnedTasks: computed,
			getTasks: computed,
			getTasksCount: computed,
		});
	}

	addTask(task: Task) {
		this.tasks.push(task);
		this.tasks.sort(
			(a, b) =>
				new Date(b.created_at).getUTCMilliseconds() -
				new Date(a.created_at).getMilliseconds(),
		);
	}

	addTasks(tasks: Task[]) {
		this.tasks = [...this.tasks, ...tasks];
		this.tasks.sort(
			(a, b) =>
				new Date(b.created_at).getUTCMilliseconds() -
				new Date(a.created_at).getMilliseconds(),
		);
	}

	setTasks(tasks: Task[]) {
		this.tasks = tasks;
		this.tasks.sort(
			(a, b) =>
				new Date(b.created_at).getUTCMilliseconds() -
				new Date(a.created_at).getMilliseconds(),
		);
	}

	updateTask(taskId: number, task: Task) {
		const index = this.tasks.findIndex((t) => t.id === taskId);
		if (index !== -1) {
			this.tasks[index] = task;
		}
	}

	deleteTask(taskId: number) {
		this.tasks = this.tasks.filter((task) => task.id !== taskId);
	}

	clearTasks() {
		this.tasks = [];
	}

	get getPinnedTasks() {
		return this.tasks.filter((task) => task.pinned);
	}

	get getUnpinnedTasks() {
		return this.tasks.filter((task) => !task.pinned);
	}

	get getPendingTasks() {
		return this.tasks.filter((task) => task.status === "PENDING");
	}

	get getCompletedTasks() {
		return this.tasks.filter((task) => task.status === "COMPLETED");
	}

	get getTasks() {
		return this.tasks;
	}

	get getTasksCount() {
		return this.tasks.length;
	}
}

export const taskStore = new TaskStore();
