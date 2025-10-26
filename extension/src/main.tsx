import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import LoginForm from './pages/loginForm';
import UserPage from './pages/userPopup2';

let signedIn = chrome.storage.local.get(['username']) !== null;

const router = createHashRouter([
    { path: '/', element: signedIn ? <UserPage /> : <LoginForm /> },
    { path: '/user', element: <UserPage /> }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)
