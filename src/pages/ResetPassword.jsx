import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, sendRserPassword } from '../services/authService';
import './ResetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);


    const handleRequestReset = async () => {

        try {
            const { message } = await sendRserPassword(email);
            alert(message);
        } catch (error) {
            console.error(error);
            alert("Failed to send reset email.");
        }
    };

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const { message } = await resetPassword(token, { password, confirmPassword });
            alert(message);
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Failed to reset password.");
        }
    };

    return (
        <div className="reset-password">
            <h2>Reset Password</h2>
            {!token && (
                <div>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleRequestReset}>Send Reset Link</button>
                </div>
            )}
            {token && (
                <div>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button onClick={handleResetPassword}>Reset Password</button>
                </div>
            )}
            <p className="back-to-login" onClick={() => navigate('/')}>Back to login</p>

        </div>
    );
};

export default ResetPassword;
