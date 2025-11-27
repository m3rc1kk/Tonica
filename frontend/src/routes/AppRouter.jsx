import {Routes, Route} from 'react-router-dom'
import WelcomePage from "../pages/Welcome/WelcomePage";
import SignUpPage from "../pages/Auth/SignUp/SignUp.jsx";
import SignInPage from "../pages/Auth/SignIn/SignIn.jsx";
import ResetPasswordForm from "../pages/Auth/ResetPassword/ResetPasswordForm.jsx";
import ResetPasswordDone from "../pages/Auth/ResetPassword/ResetPasswordDone.jsx";
import ResetPasswordConfirm from "../pages/Auth/ResetPassword/ResetPasswordConfirm.jsx";
import Home from "../pages/Home/Home.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import ArtistProfile from "../pages/ArtistProfile/ArtistProfile.jsx";
import ArtistTracks from "../pages/ArtistTracks/ArtistTracks.jsx";
import ArtistAlbums from "../pages/ArtistAlbums/ArtistAlbums.jsx";
import ArtistApplicationForm from "../pages/ApplicationApply/ApplicationApply.jsx";
import AlbumPage from "../pages/AlbumPage/AlbumPage.jsx";
import Library from "../pages/Library/Library.jsx";
import NewReleases from "../pages/NewReleases/NewReleases.jsx";
import FavoriteAlbums from "../pages/FavoriteAlbums/FavoriteAlbums.jsx";
import FavoriteTracks from "../pages/FavoriteTracks/FavoriteTracks.jsx";
import FavoriteArtists from "../pages/FavoriteArtists/FavoriteArtists.jsx";
import AllPlaylists from "../pages/AllPlaylists/AllPlaylists.jsx";
import PlaylistPage from "../pages/PlaylistPage/PlaylistPage.jsx";
import PlaylistCreate from "../pages/PlaylistCreate/PlaylistCreate.jsx";
import PlaylistUpdate from "../pages/PlaylistUpdate/PlaylistUpdate.jsx";
import ProfileUpdate from "../pages/Auth/ProfileUpdate/ProfileUpdate.jsx";
import Search from "../pages/Search/Search.jsx";
import BigPlayer from "../pages/BigPlayer/BigPlayer.jsx";
import GenrePage from "../pages/GenrePage/GenrePage.jsx";

export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/auth/login" element={<SignInPage />} />
                <Route path="/auth/register" element={<SignUpPage />} />
                <Route path="/auth/password/reset" element={<ResetPasswordForm />} />
                <Route path="/auth/password/reset/done" element={<ResetPasswordDone />} />
                <Route path="/auth/password/reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/favorites/albums" element={<FavoriteAlbums />} />
                <Route path="/favorites/tracks" element={<FavoriteTracks />} />
                <Route path="/favorites/artists" element={<FavoriteArtists />} />
                <Route path="/playlists" element={<AllPlaylists />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/artist/:id" element={<ArtistProfile />} />
                <Route path="/artist/:id/tracks" element={<ArtistTracks />} />
                <Route path="/artist/:id/albums" element={<ArtistAlbums />} />
                <Route path="/application/apply/" element={<ArtistApplicationForm />} />
                <Route path="/album/:id" element={<AlbumPage />} />
                <Route path="/playlist/create" element={<PlaylistCreate />} />
                <Route path="/playlist/:id" element={<PlaylistPage />} />
                <Route path="/playlist/:id/update" element={<PlaylistUpdate />} />
                <Route path="/profile/update" element={<ProfileUpdate />} />
                <Route path="/search" element={<Search />} />
                <Route path="/genres/:slug" element={<GenrePage />} />
                <Route path="/big-player/:id" element={<BigPlayer />} />
            </Routes>
        </>
    );
}
