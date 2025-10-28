import { useState } from 'react';
import { UserMenu } from '../components/UserMenu';
import { MangaCard } from '../components/MangaCard';
import '../styles/userPopup.css';

interface MangaEntry {
  id: string
  title: string
  chapter: number
  lastRead: string
  url: string
  coverImage: string
  description: string
}

type Props = {
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UserPopup({ setSignedIn }: Props) {
  const [lastManga, setLastManga] = useState<MangaEntry | null>({
    id: '1',
    title: 'One Piece',
    chapter: 1095,
    lastRead: new Date().toISOString(),
    url: 'https://example.com/manga/one-piece/chapter-1095',
    coverImage:
      'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop',
    description:
      'Follow Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
  });
  // const navigate = useNavigate();

  const handleDelete = () => {
    setLastManga(null)
    // add functionality to delete last read manga from history
  }

  const handleSignOut = async () => {
    await chrome.storage.local.remove(['username'], () => {
      setSignedIn(false);
    });
    
  }
  const handleViewHistory = () => {
    window.open('https://example.com/manga-history', '_blank')
  }

  return (
    <>
      {lastManga ? (
        <MangaCard
          manga={lastManga}
          onDelete={handleDelete}
          userMenu={
            <UserMenu
              onSignOut={handleSignOut}
              onViewHistory={handleViewHistory}
            />
          }
        />
      ) : (
        <div className='no-manga-container'>
          <div className='no-manga-icon-container'>
            <svg
              className='no-manga-icon'
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className='no-manga-text'>
            No manga read yet
          </p>
          <p className='no-manga-subtext'>
            Start reading to track your progress
          </p>
        </div>
      )}
    </>
  )
}
