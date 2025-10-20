chrome.webNavigation.onCompleted.addListener(async (details) => {
    const { username } = await chrome.storage.local.get(['username']);
    if (!username) return;

    const { url } = details;

    // checks only if mangakatana url
    if (url.includes('mangakatana.com/manga/')) {
        const slashIndex = url.indexOf('/', 30);
        let mangaTitle = '';
        let mangaChapter = -1;

        // checks only if on a manga
        if (slashIndex !== -1) {
            let dotLoc = url.indexOf('.', 30);
            mangaTitle = url.substring(30, dotLoc).replace(/-/g, ' ');
            mangaChapter = parseInt(url.substring(slashIndex + 2));

            const { localMangas = [] } = await chrome.storage.local.get('localMangas');

            // only if user has read manga before
            if (localMangas.includes(mangaTitle)) {
                try {
                    await fetch(`http://localhost:3000/user/${username}/manga/${mangaTitle}`, {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            chapter: mangaChapter
                        }),
                    }).then((res) => console.log(res.json()));
                } catch {
                    console.log('worker user manga chapter update storage error');
                }
            } else {
                localMangas.push(mangaTitle);
                chrome.storage.local.set({ localMangas: localMangas });

                try {
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
                } catch {
                    console.log('worker new manga storage error');
                }

                try {
                    await fetch(`http://localhost:3000/user/${username}/manga`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: mangaTitle,
                            chapter: mangaChapter,
                        }),
                    }).then((res) => console.log(res.json()));
                } catch {
                    console.log('worker new user manga storage error');
                }
            }
        }
    }
});
