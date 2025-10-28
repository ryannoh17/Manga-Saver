import { useEffect, useState, useRef } from 'react'
import { UserIcon, LogOutIcon, HistoryIcon } from 'lucide-react'
import '../styles/components/userMenu.css';

interface UserMenuProps {
  onSignOut: () => void
  onViewHistory: () => void
}

export function UserMenu({ onSignOut, onViewHistory }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  //let signedIn = chrome.storage.local.get(['username']) !== null;

  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className='user-menu-button'
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserIcon className='user-icon' />
      </button>

      {isOpen && (
        <div className='user-menu-dropdown'>
          <button
            className='menu-item'
            onClick={() => {
              onViewHistory()
              setIsOpen(false)
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#f9fafb')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <HistoryIcon className="menu-icon" />
            View Full History
          </button>

          <div className="menu-separator" />

          <button
            className="menu-item danger"
            onClick={() => {
              onSignOut()
              setIsOpen(false)
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#fef2f2')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <LogOutIcon className="menu-icon" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
