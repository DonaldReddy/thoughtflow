import type { User } from "@supabase/supabase-js";
import { action, computed, makeObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class UserStore {
	user: null | User;

	constructor() {
		this.user = null;
		makeObservable(this, {
			user: observable,
			setUser: action,
			signOut: action,
			isAuthenticated: computed,
		});
		makePersistable(this, {
			name: "UserStore",
			properties: ["user"],
			storage: window.localStorage,
		});
	}

	setUser(user: User | null) {
		this.user = user;
	}

	signOut() {
		this.user = null;
		window.localStorage.removeItem("UserStore");
	}

	get isAuthenticated() {
		return this.user !== null;
	}
}

export const userStore = new UserStore();
