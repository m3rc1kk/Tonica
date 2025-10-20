import {BrowserRouter, Routes, Route} from 'react-router-dom'
import WelcomePage from "../pages/Welcome/WelcomePage";
import SignUpPage from "../pages/Auth/SignUp/SignUp.jsx";
import SignInPage from "../pages/Auth/SignIn/SignIn.jsx";
import ResetPasswordForm from "../pages/Auth/ResetPassword/ResetPasswordForm.jsx";
import ResetPasswordDone from "../pages/Auth/ResetPassword/ResetPasswordDone.jsx";
import ResetPasswordConfirm from "../pages/Auth/ResetPassword/ResetPasswordConfirm.jsx";
import ResetPasswordComplete from "../pages/Auth/ResetPassword/ResetPasswordComplete.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route path="/reset-password-done" element={<ResetPasswordDone />} />
                <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
                <Route path="/reset-password-complete" element={<ResetPasswordComplete />} />
            </Routes>
        </BrowserRouter>
    );
}
