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
            chrome.action.setPopup({
                popup: 'userPage.html'
            });
            
            await chrome.storage.local.set({ username: username });

            window.close();
        }

        alert(loginResult.message);
    } catch (error) {
        console.error(' Login Error:', error);
    }
});
