import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/loginForm.css';

type Props = {
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginForm({ setSignedIn }: Props) {
	const [signingIn, setSigningIn] = useState(true);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const baseURL = "https://manga-saver-latest.onrender.com";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		try {
			const endPoint = signingIn ? '/login' : '';

			const response = await fetch(`${baseURL}/user${endPoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: username,
					password: password
				})
			});

			const loginResult = await response.json();

			if (response.ok) {
				await chrome.storage.local.set({ username: username }, () => {
					setSignedIn(true);
				});
			}

			alert(loginResult.message);
		} catch (error) {
			console.error(' Login Error:', error);
		}
	};

	return (
		<div className="login-container">
			<h1 className="login-title">{signingIn ? 'Sign In' : 'Create Account'}</h1>

			<form onSubmit={handleSubmit} className="login-form">
				<div className="form-group">
					<label htmlFor="username" className="form-label">
						Username
					</label>
					<input
						id="username"
						type="username"
						placeholder="Enter your username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className="form-input"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<div className="password-input-wrapper">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="form-input"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="toggle-password"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
				</div>

				{!signingIn && (
					<div className="form-group">
						<label htmlFor="confirm-password" className="form-label">
							Confirm Password
						</label>
						<div className="password-input-wrapper">
							<input
								id="confirm-password"
								type={showConfirmPassword ? 'text' : 'password'}
								placeholder="Confirm your password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="form-input"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="toggle-password"
								aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
							>
								{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
					</div>
				)}

				<button type="submit" className="submit-button">
					{signingIn ? 'Sign In' : 'Create Account'}
				</button>

				<div className="divider">
					<span className="divider-text">or</span>
				</div>

				<button
					type="button"
					className="create-account-button"
					onClick={() => {
						setSigningIn(!signingIn);
						setUsername('');
						setPassword('');
						setConfirmPassword('');
					}}
				>
					{signingIn ? 'Create Account' : 'Sign In'}
				</button>
			</form>
		</div>
	);
}
