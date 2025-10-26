import { useState } from 'react';
import { UserMenu } from '../components/UserMenu';
import { MangaCard } from '../components/MangaCard';
import '../styles/userPopup2.css';

interface MangaEntry {
  id: string
  title: string
  chapter: number
  lastRead: string
  url: string
  coverImage: string
  description: string
}

export default function App() {
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
  const handleDelete = () => {
    setLastManga(null)
  }
  const handleSignOut = () => {
    console.log('Sign out clicked')
  }
  const handleViewHistory = () => {
    window.open('https://example.com/manga-history', '_blank')
  }

  return (
    <div
      style={{
        width: '400px',
        // minHeight: '100px',
        background: 'linear-gradient(to bottom right, #faf5ff, #eff6ff)',
      }}
    >
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
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '48px 16px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#e5e7eb',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg
              style={{
                width: '32px',
                height: '32px',
                color: '#9ca3af',
              }}
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
          <p
            style={{
              color: '#4b5563',
              fontWeight: '500',
              marginBottom: '4px',
            }}
          >
            No manga read yet
          </p>
          <p
            style={{
              color: '#9ca3af',
              fontSize: '14px',
            }}
          >
            Start reading to track your progress
          </p>
        </div>
      )}
    </div>
  )
}
