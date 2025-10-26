import React, { useState } from 'react'
import {
  ExternalLinkIcon,
  TrashIcon,
  BookOpenIcon,
  ClockIcon,
} from 'lucide-react'
import '../styles/components/mangaCard.css'

interface MangaEntry {
  id: string
  title: string
  chapter: number
  lastRead: string
  url: string
  coverImage: string
  description: string
}

interface MangaCardProps {
  manga: MangaEntry
  onDelete: () => void
  userMenu: React.ReactNode
}

export function MangaCard({ manga, onDelete, userMenu }: MangaCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    )
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className='manga-container'>
      <div className='manga-content'>
        <div className='manga-image-container'>
          <img
            className='manga-image'
            src={manga.coverImage}
            alt={manga.title}
          />
        </div>

        <div className='manga-info-container'>
          <div className='manga-header'>
            <h2 className='manga-title'>
              {manga.title}
            </h2>
            {userMenu}
          </div>

          <div className='manga-item-container'>
            <div className='manga-item-chapter'>
              <BookOpenIcon className='manga-icon' />
              <span className='manga-chapter'>
                Chapter {manga.chapter}
              </span>
            </div>

            <div className='manga-item-last-read'>
              <ClockIcon className='manga-icon' />
              <span className='manga-last-read'>
                {formatDate(manga.lastRead)}
              </span>
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.5',
                margin: 0,
                display: isDescriptionExpanded ? 'block' : '-webkit-box',
                WebkitLineClamp: isDescriptionExpanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {manga.description}
            </p>
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              style={{
                fontSize: '13px',
                color: '#a855f7',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                padding: '4px 0 0 0',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.textDecoration = 'underline')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.textDecoration = 'none')
              }
            >
              {isDescriptionExpanded ? 'Show less' : 'More'}
            </button>
          </div>
        </div>
      </div>

      <div className='manga-actions'>
        <a
          className='manga-link'
          href={manga.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Continue Reading
          <ExternalLinkIcon className='manga-icon' />
        </a>

        <button
          className='manga-delete'
          onClick={onDelete}
          title="Delete"
        >
          <TrashIcon className='delete-icon' />
        </button>
      </div>
    </div>
  )
}
