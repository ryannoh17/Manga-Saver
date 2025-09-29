// document.getElementById('lastManga')?.innerHTML = async () => {
//     try {
//         const fetchedMangas = await fetch('http://localhost:3000/manga');
//         console.log(await fetchedMangas.json());
//     } catch (error) {
//         console.error('Error: ', error);
//     }
// }

document.getElementById('logout')?.addEventListener('click', async () => {
    chrome.action.setPopup({
        popup: 'login.html',
    });

    await chrome.storage.local.set({ loggedIn: false });

    window.close();
});
