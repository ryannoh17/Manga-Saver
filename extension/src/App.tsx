import { useState } from 'react';
import LoginForm from './pages/loginForm';
import UserPopup from './pages/userPopup';

export default async function App() {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <>
      {
        signedIn ? 
          <UserPopup setSignedIn={setSignedIn} /> : 
          <LoginForm setSignedIn={setSignedIn} />
      }
    </>
  )
}

