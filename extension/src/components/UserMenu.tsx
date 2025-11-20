import { useEffect, useState, useRef } from 'react'
import { UserIcon, LogOutIcon, HistoryIcon } from 'lucide-react'
import '../styles/components/userMenu.css';

interface UserMenuProps {
  onSignOut: () => void
  onViewHistory: () => void
  username: string
}

export function UserMenu({ onSignOut, onViewHistory, username }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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
          <div className='menu-item'>
            {username}
          </div>
          <button
            className='menu-item'
            onClick={() => {
              onViewHistory()
              setIsOpen(false)
            }}
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
          >
            <LogOutIcon className="menu-icon" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
