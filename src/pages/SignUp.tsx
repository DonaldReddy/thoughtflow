import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase/client";
import { userStore } from "../mobx/UserStore";
import Loader from "../components/Loader";

export default function SignUp() {
	const [signUpInfo, setSignUpInfo] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const user = userStore.user;
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const validateForm = () => {
		if (
			!signUpInfo.email ||
			!signUpInfo.password ||
			!signUpInfo.confirmPassword
		) {
			alert("All fields are required.");
			return false;
		}
		if (signUpInfo.password !== signUpInfo.confirmPassword) {
			alert("Passwords do not match.");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			if (validateForm()) {
				setLoading(true);
				const response = await supabase.auth.signUp({
					email: signUpInfo.email,
					password: signUpInfo.password,
				});

				if (response.error) {
					alert(`Sign up failed: ${response.error.message}`);
				} else {
					setSignUpInfo({
						email: "",
						password: "",
						confirmPassword: "",
					});
					userStore.setUser(response.data.user);
				}
			}
		} catch (error) {
			console.error("Error during sign up:", error);
			alert("An error occurred during sign up. Please try again.");
		} finally {
			setLoading(false);
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
					value={signUpInfo.email}
					onChange={(e) =>
						setSignUpInfo({ ...signUpInfo, email: e.target.value })
					}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					className="p-2 border-2 border-gray-200 rounded-md outline-none w-full"
					value={signUpInfo.password}
					onChange={(e) =>
						setSignUpInfo({ ...signUpInfo, password: e.target.value })
					}
					required
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					className="p-2 border-2 border-gray-200 rounded-md outline-none w-full"
					value={signUpInfo.confirmPassword}
					onChange={(e) =>
						setSignUpInfo({
							...signUpInfo,
							confirmPassword: e.target.value,
						})
					}
					required
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white p-2 rounded-md cursor-pointer flex items-center justify-center"
					disabled={loading}
				>
					{loading ? <Loader /> : "Sign In"}
				</button>
				<p className="text-center text-gray-500">
					Already have an account?{" "}
					<Link to="/sign-in" className="text-blue-500">
						Sign In
					</Link>
				</p>
			</form>
		</div>
	);
}
