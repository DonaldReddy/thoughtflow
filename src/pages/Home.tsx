import React from "react";
import { userStore } from "../mobx/UserStore";
import { useNavigate } from "react-router";

export default function Home() {
	const user = userStore.user;
	const navigate = useNavigate();
	let timeOut = null;
	if (!user) {
		timeOut = setTimeout(() => {
			navigate("/sign-in", { replace: true });
		}, 1000);
		return <div>Please sign in to access the home page.</div>;
	}
	if (timeOut) {
		clearTimeout(timeOut);
	}
	return <div></div>;
}
