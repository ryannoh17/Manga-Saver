import { useEffect, useState } from 'react';
import { UserMenu } from '../components/UserMenu';
import { MangaCard } from '../components/MangaCard';
import '../styles/userPopup.css';

interface MangaEntry {
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
  const [lastManga, setLastManga] = useState<MangaEntry>({
    title: 'placeholder',
    chapter: 0,
    lastRead: new Date().toISOString(),
    url: '',
    coverImage:
      'https://castlewoodassistedliving.com/wp-content/uploads/2021/01/image-coming-soon-placeholder.png',
    description: 'coming soon',
  });
  const [currentUsername, setCurrentUsername] = useState('no username');

  const baseURL = 'https://manga-saver-latest.onrender.com'

  useEffect(() => {
    async function returnLastReadManga() {
      const { username } = await chrome.storage.local.get(['username']);
      setCurrentUsername(username);

      try {
        const userMangaList = await (await fetch(`${baseURL}/user/${username}/manga`)).json();
        const dbUserManga = userMangaList[0];
        console.log(dbUserManga);
        const lastReadManga: MangaEntry = {
          title: dbUserManga.mangaDetail.title,
          chapter: dbUserManga.currentChapter,
          lastRead: dbUserManga.dateRead,
          url: dbUserManga.mangaDetail.url,
          coverImage: 'https://castlewoodassistedliving.com/wp-content/uploads/2021/01/image-coming-soon-placeholder.png',
          description: 'coming soon',
        }
        setLastManga(lastReadManga);
      } catch (error) {
        console.error('Error: ', error);
      }
    }

    returnLastReadManga();
  }, [])

  const handleDelete = async () => {
    const { title } = lastManga;
    const { username } = await chrome.storage.local.get(['username']);
    console.log(`trying to delete user manga ${title}`);
    try {
      await fetch(`${baseURL}/user/${username}/manga/${title}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });
    } catch (err) {
      console.error('Network error deleting manga:', err);
    }
  }

  const handleSignOut = async () => {
    await chrome.storage.local.remove(['username'], () => {
      setSignedIn(false);
    });

  }
  const handleViewHistory = () => {
    window.open('', '_blank');
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
              username={currentUsername}
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
