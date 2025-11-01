import {BrowserRouter, Routes, Route} from 'react-router-dom'
import WelcomePage from "../pages/Welcome/WelcomePage";
import SignUpPage from "../pages/Auth/SignUp/SignUp.jsx";
import SignInPage from "../pages/Auth/SignIn/SignIn.jsx";
import ResetPasswordForm from "../pages/Auth/ResetPassword/ResetPasswordForm.jsx";
import ResetPasswordDone from "../pages/Auth/ResetPassword/ResetPasswordDone.jsx";
import ResetPasswordConfirm from "../pages/Auth/ResetPassword/ResetPasswordConfirm.jsx";
import Home from "../pages/Home/Home.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import ArtistProfile from "../pages/ArtistProfile/ArtistProfile.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="auth/login" element={<SignInPage />} />
                <Route path="auth/register" element={<SignUpPage />} />
                <Route path="auth/password/reset" element={<ResetPasswordForm />} />
                <Route path="auth/password/reset/done" element={<ResetPasswordDone />} />
                <Route path="auth/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/artist/:id" element={<ArtistProfile />} />
            </Routes>
        </BrowserRouter>
    );
}
