import { useState } from 'react';
import LoginForm from './pages/loginForm';
import UserPopup from './pages/userPopup';

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  chrome.storage.local.get(['username'], (result) => {
    setSignedIn(result.username !== undefined);
  });

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

