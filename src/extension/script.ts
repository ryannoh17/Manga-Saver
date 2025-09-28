document.getElementById('getMangaBtn')?.addEventListener('click', async () => {
    console.log('clicked')
    try {
        const fetchedMangas = await fetch('http://localhost:3000/manga')
        console.log(await fetchedMangas.json());
    } catch (error) {
        console.error('Error: ', error);
    }
});

document.getElementById('userForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = (<HTMLInputElement>document.getElementById('username')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;

    const isNewUser = (<HTMLInputElement>event.submitter).value === 'Create';

    try {
        const endPoint = isNewUser ? '' : '/login';
        
        const response = await fetch(`http://localhost:3000/user${endPoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const loginResult = await response.json();
        
        if (response.ok) {
            console.log('Success:', loginResult);
            // Handle success (redirect, show message, etc.)
        } else {
            console.error('Error:', loginResult);
        }
    } catch (error) {
        console.error(' Login Error:', error);
    }
});

// user submit login
// accept login go to acc
// 