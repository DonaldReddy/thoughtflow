export type Task = {
	id: number;
	created_at: Date;
	title: string;
	description: string;
	updated_at: Date;
	author: string;
	status: "PENDING" | "COMPLETED" | "DELETED" | "ARCHIVED";
	pinned: boolean;
};
