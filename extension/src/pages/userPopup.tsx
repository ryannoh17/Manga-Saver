import { useState, useEffect, useRef } from "react";
import { ExternalLink, BookOpen, Clock, MoreVertical, Trash2 } from "lucide-react";
import "../styles/userPopup.css";

interface MangaEntry {
  id: string;
  title: string;
  chapter: number;
  url: string;
  timestamp: Date;
  coverImage?: string;
}

export default function MangaHistory() {
  const [history, setHistory] = useState<MangaEntry[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock data - replace this with actual chrome.storage.local.get() or your extension's storage API
    const mockData: MangaEntry[] = [
      {
        id: "1",
        title: "One Piece",
        chapter: 1095,
        url: "https://example.com/manga/one-piece/chapter-1095",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: "2",
        title: "Jujutsu Kaisen",
        chapter: 238,
        url: "https://example.com/manga/jujutsu-kaisen/chapter-238",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "3",
        title: "My Hero Academia",
        chapter: 405,
        url: "https://example.com/manga/my-hero-academia/chapter-405",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: "4",
        title: "Chainsaw Man",
        chapter: 145,
        url: "https://example.com/manga/chainsaw-man/chapter-145",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      },
    ];

    // Simulate loading from extension storage
    // In real implementation, use:
    // chrome.storage.local.get(['mangaHistory'], (result) => {
    //   setHistory(result.mangaHistory || []);
    // });
    setHistory(mockData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleOpenManga = (url: string) => {
    // In extension context, use:
    // chrome.tabs.create({ url });
    window.open(url, "_blank");
  };

  const handleViewAll = () => {
    // In extension context, use:
    // chrome.tabs.create({ url: 'https://your-manga-tracker-website.com/history' });
    window.open('https://your-manga-tracker-website.com/history', '_blank');
  };

  const handleDeleteManga = (id: string) => {
    // In real implementation, remove from chrome.storage.local
    setHistory(history.filter(manga => manga.id !== id));
  };

  const latestManga = history.length > 0 ? history[0] : null;

  return (
    <div className="manga-popup-container">
      {!latestManga ? (
        <div className="manga-empty-state">
          <BookOpen className="manga-empty-icon" />
          <p className="manga-empty-text">No manga read yet</p>
        </div>
      ) : (
        <div className="manga-content">
          {/* Main manga card */}
          <div className="manga-card">
            <div className="manga-card-header">
              <div className="manga-info">
                <h2 className="manga-title">{latestManga.title}</h2>
                <div className="manga-metadata">
                  <div className="manga-metadata-item">
                    <BookOpen className="manga-metadata-icon" />
                    <span>Chapter {latestManga.chapter}</span>
                  </div>
                  <div className="manga-metadata-item">
                    <Clock className="manga-metadata-icon" />
                    <span>{formatTimeAgo(latestManga.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              <div className="manga-menu-container" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="manga-menu-trigger"
                >
                  <MoreVertical className="manga-menu-icon" />
                </button>
                
                {isMenuOpen && (
                  <div className="manga-menu-dropdown">
                    <button
                      onClick={() => {
                        handleDeleteManga(latestManga.id);
                        setIsMenuOpen(false);
                      }}
                      className="manga-menu-item"
                    >
                      <Trash2 className="manga-menu-item-icon" />
                      Delete from history
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleOpenManga(latestManga.url)}
              className="manga-continue-button"
            >
              Continue Reading
              <ExternalLink className="manga-continue-icon" />
            </button>
          </div>

          {/* View all button */}
          <button
            onClick={handleViewAll}
            className="manga-view-all-button"
          >
            View Full History ({history.length})
            <ExternalLink className="manga-view-all-icon" />
          </button>
        </div>
      )}
    </div>
  );
}
