import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { userStore } from "../mobx/UserStore";
import { supabase } from "../supabase/client";

export default function SignIn() {
	const [loginInfo, setLoginInfo] = useState({
		email: "",
		password: "",
	});

	const user = userStore.user;
	const navigate = useNavigate();

	const validateForm = () => {
		if (!loginInfo.email || !loginInfo.password) {
			alert("All fields are required.");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			if (validateForm()) {
				const response = await supabase.auth.signInWithPassword({
					email: loginInfo.email,
					password: loginInfo.password,
				});

				if (response.error) {
					alert(`Sign in failed: ${response.error.message}`);
				} else {
					setLoginInfo({
						email: "",
						password: "",
					});
					userStore.setUser(response.data.user);
				}
			}
		} catch (error) {
			console.error("Error during sign in:", error);
			alert("An error occurred during sign in. Please try again.");
		}
	};

	useEffect(() => {
		if (user) {
			navigate("/", { replace: true });
		}
	}, [user]);

	return (
		<div className="min-h-dvh flex items-center justify-center">
			<form
				className="flex flex-col gap-4 w-full max-w-sm"
				onSubmit={handleSubmit}
			>
				<input
					type="email"
					placeholder="Email"
					className="p-2 border-2 border-gray-200 rounded-md outline-none w-full"
					value={loginInfo.email}
					onChange={(e) =>
						setLoginInfo({ ...loginInfo, email: e.target.value })
					}
				/>
				<input
					type="password"
					placeholder="Password"
					className="p-2 border-2 border-gray-200 rounded-md outline-none w-full"
					value={loginInfo.password}
					onChange={(e) =>
						setLoginInfo({ ...loginInfo, password: e.target.value })
					}
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
				>
					Sign In
				</button>
				<p className="text-center text-gray-500">
					Don't have an account?{" "}
					<Link to="/sign-up" className="text-blue-500">
						Sign Up
					</Link>
				</p>
			</form>
		</div>
	);
}
