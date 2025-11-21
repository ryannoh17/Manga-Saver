// import * as cheerio from 'cheerio';

const apiURL = "https://manga-saver-latest.onrender.com";

// async function getHTMLData(url: string) {
//     const res = await fetch(url);
//     const html = await res.text();

//     const $ = cheerio.load(html);

//     return $;
// } 

chrome.webNavigation.onCompleted.addListener(async (details) => {
    const { username } = await chrome.storage.local.get(['username']);
    if (!username) return;

    const { url } = details;

    // checks only if mangakatana url
    if (url.includes('mangakatana.com/manga/')) {
        const slashIndex = url.indexOf('/', 30);

        // checks only if on a manga
        if (slashIndex !== -1) {
            // manga url parsing
            const baseMangaURL = url.substring(0, slashIndex);
            const dotLoc = url.indexOf('.', 30);
            const mangaTitleDashed = url.substring(30, dotLoc);
            const mangaTitle = mangaTitleDashed.replace(/-/g, ' ');
            const mangaChapter = parseInt(url.substring(slashIndex + 2));

            console.log(mangaTitle, mangaChapter, baseMangaURL);

            const { localMangas = [] } = await chrome.storage.local.get('localMangas');

            // only if user has read manga before
            if (localMangas.includes(mangaTitle)) {
                try {
                    fetch(`${apiURL}/user/${username}/manga/${mangaTitleDashed}`, {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            chapter: mangaChapter,
                            url: url
                        }),
                    }).then(async (res) => console.log('patching', await res.json()));
                } catch (err: any) {
                    console.log('worker user manga chapter update storage error', err);
                }
            } else {
                try {
                    await fetch(`${apiURL}/manga`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: mangaTitle,
                            description: '',
                            url: baseMangaURL,
                            genres: [''],
                            coverImage: '',
                        }),
                    }).then(async (res) => {
                        console.log(`manga addition result: ${await res.text()}`);

                        try {
                            fetch(`${apiURL}/user/${username}/manga`, {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json',
                                },
                                body: JSON.stringify({
                                    title: mangaTitle,
                                    chapter: mangaChapter,
                                    url: url
                                }),
                            }).then(async (res) => {
                                if (res.status === 410) {
                                    try {
                                        fetch(`${apiURL}/user/${username}/manga/${mangaTitleDashed}`, {
                                            method: 'PATCH',
                                            headers: {
                                                'content-type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                chapter: mangaChapter,
                                                url: url
                                            }),
                                        }).then(async (res) => console.log('patching', await res.json()));
                                    } catch (err: any) {
                                        console.log('worker user manga chapter update storage error', err);
                                    }
                                } else {
                                    console.log(`user manga addition result: ${await res.text()}`);
                                }
                            });
                        } catch (err: any) {
                            console.log('worker new user manga storage error: ', err);
                        }
                    });
                } catch (err: any) {
                    console.log('worker new manga storage error: ', err);
                }

                localMangas.push(mangaTitle);
                chrome.storage.local.set({ localMangas: localMangas });
            }
        }
    }
});
