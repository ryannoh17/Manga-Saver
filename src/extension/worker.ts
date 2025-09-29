/**
 * takes in a shorten mangakatana URL and uses it to return the manga name \
 * and chapter of the manga you are on
 *
 * @param URL
 * @returns An arry containing the name and chapter of the manga
 */
function getURLInfo(URL: string) {
    let remainingURL = URL.substring(1);
    let lastSlashIndex = 0;
    let count = 1;
    let mangaChapter = -1;
    let mangaName = '';

    // recurring through url to get the slashes to know where in the URL things are
    while (remainingURL.includes('/')) {
        lastSlashIndex = remainingURL.indexOf('/') + 1;
        remainingURL = remainingURL.substring(lastSlashIndex);
        count++;
    }

    if (count === 3) {
        mangaChapter = parseInt(remainingURL.substring(1));

        mangaName = URL.substring(7);
        let dotLoc = mangaName.indexOf('.');
        mangaName = mangaName.substring(0, dotLoc).replace(/-/g, ' ');
    }

    return [mangaName, mangaChapter];
}

chrome.webNavigation.onCompleted.addListener(async (details) => {
    const { loggedIn } = await chrome.storage.local.get(['loggedIn']);
    if (!loggedIn) return;
    
    const { url } = details;
    let mangaTitle = '';

    if (url.includes('mangakatana.com')) {
        const URLLength = url.length;
        const firstSlashIndex = url.indexOf('.com') + 4;

        if (firstSlashIndex + 7 < URLLength) {
            const shortenURL = url.substring(firstSlashIndex);
            const urlInfo = getURLInfo(shortenURL);
            console.log(urlInfo);

            mangaTitle = urlInfo[0] + '';

            const handleMangaSubmit = async () => {
                await fetch('http://localhost:3000/manga', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: mangaTitle,
                        description: '',
                        genres: [''],
                        url: url,
                        coverImage: '',
                    }),
                }).then((res) => res.json());
            };

            handleMangaSubmit();
        }
    }
});