async function displayLastReadManga() {
    const lastReadMangaElement = document.getElementById('lastManga');
    if (!lastReadMangaElement) return;

    const { username } = await chrome.storage.local.get(['username']);

    try {
        const userMangaList = await fetch(`http://localhost:3000/user/${username}/manga`);
        const mangaData = await userMangaList.json();
        const lastManga = mangaData[0];
        console.log(mangaData[0]);

        lastReadMangaElement
            .innerHTML = `Last Manga: ${lastManga.mangaDetail.title || 'No manga found'}`;
    } catch (error) {
        console.error('Error: ', error);
        lastReadMangaElement.innerHTML = 'Failed to load manga data';
    }
}

displayLastReadManga();

document.getElementById('logout')?.addEventListener('click', async () => {
    chrome.action.setPopup({
        popup: 'login.html',
    });

    await chrome.storage.local.set({ username: null });

    window.close();
});

// make last read manga and username show up in pop up
// organize user manga by date
// create filters for webpage
