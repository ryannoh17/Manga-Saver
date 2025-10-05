chrome.webNavigation.onCompleted.addListener(async (details) => {
    // const { loggedIn } = await chrome.storage.local.get(['loggedIn']);
    // if (!loggedIn) return;

    const { url } = details;

    if (url.includes('mangakatana.com/manga/')) {
        const slashIndex = url.indexOf('/', 30);
        let mangaTitle = '';
        let mangaChapter = -1;

        if (slashIndex !== -1) {
            let dotLoc = url.indexOf('.', 30);
            mangaTitle = url.substring(30, dotLoc).replace(/-/g, ' ');
            mangaChapter = parseInt(url.substring(slashIndex + 2));
            console.log(mangaTitle, mangaChapter);

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
