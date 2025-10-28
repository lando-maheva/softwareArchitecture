const api_url = '/v1/api'; 

async function login(event) {
    event.preventDefault(); //to stop the page from reloading

    // get data from the form 
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries()); 
    
    // Check if the form is sending username/password keys that match the db
    console.log("Attempting login with data:", data); 

    try {
        //to send request to the backend, we use fetch api
        const res = await fetch(`${api_url}/auth/login`, {
            method: 'POST',
           
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // to handle non-successful response ( 401 Unauthorized), we check res.ok
        if (!res.ok) {
            const error = await res.json();
            console.error(error);
            alert(`Login Failed: ${error.message || 'Invalid credentials'}`);
            return;
        }

        // to extract the tokens from the successful response
        const responseData = await res.json();
        
        //extract accessToken and refreshToken matching the db
        const accessToken = responseData.accessToken; 
        const refreshToken = responseData.refreshToken; 
        
        if (accessToken) {
            // Store the Tokens (we use the Local Storage for simplicity)
            localStorage.setItem('accessToken', accessToken); 
            
            
            localStorage.setItem('refreshToken', refreshToken); 
            
            // redirect or Update frontend
            alert('Login Successful! Tokens stored.');
        
        } else {
             alert('Login Failed: Access token not received from server.');
        }

    } catch (error) {
        console.error('Network or Parsing Error:', error);
        alert('An unexpected error occurred during login.');
    }
}

async function fetchProtectedData() {
    //  retrieve the stored access token
    const token = localStorage.getItem('accessToken'); 

    if (!token) {
        console.error("No access token found. User is not logged in.");
        // redirect to login page
        return; 
    }

    try {
       
        const res = await fetch(`${api_url}/users`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // use the access token for autho
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!res.ok) {
            // if the server returns 401/403, the token is invalid or expired
            console.error('Access Denied or Token Expired. Removing token.');
            localStorage.removeItem('accessToken'); 
            localStorage.removeItem('refreshToken');
            // redirect to login
            return;
        }

        const data = await res.json();
        console.log("Protected Data:", data);

    } catch (error) {
        console.error('Error fetching protected data:', error);
    }
}

// Ensure you link the login function to your form submission event
// Example: document.getElementById('login-form').addEventListener('submit', login);
