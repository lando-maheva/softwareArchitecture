async function login(event) {
    event.preventDefault(); //To stop the page from reloading

    // get data from the form 
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries()); 
    
    // Check if the form is sending username/password keys that match the backend
    console.log("Attempting login with data:", data); 

    try {
        //to send request to the backend, we use fetch api
        const res = await fetch(`${api_url}/auth/login`, {
            method: 'POST',
            credentials: 'include', // Important since we are using HttpOnly Cookies
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // to handle non-successful response ( 401 Unauthorized), we check res.ok
        if (!res.ok) {
            const error = await res.json();
            alert(`Login Failed: ${error.message || 'Invalid credentials'}`);
            return;
        }

        // to  extract the access token from the successful response, we parse the json body (parse means convert from json string to json objects)
        const responseData = await res.json();
        
        // The jwt payload must be structured to contain the token
        const jwtToken = responseData.token; 
        
        if (jwtToken) {
            // Store the Token (Using Local Storage for simplicity; we can consider more secure storage for production)
            localStorage.setItem('jwtToken', jwtToken); 
            
            // Redirect or Update UI
            alert('Login Successful!');
        
            
        } else {
             alert('Login Failed: Token not received from server.');
        }

    } catch (error) {
        console.error('Network or Parsing Error:', error);
        alert('An unexpected error occurred during login.');
    }
}
async function fetchProtectedData() {
    //  Retrieve the stored token
    const token = localStorage.getItem('jwtToken'); 

    if (!token) {
        console.error("No token found. User is not logged in.");
        // Redirect to login page
        return; 
    }

    try {
        const res = await fetch(`${api_url}/api/login`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!res.ok) {
            // If the server returns 401/403, the token is invalid or expired
            console.error('Access Denied or Token Expired.');
            localStorage.removeItem('jwtToken'); 
            // Redirect to login
            return;
        }

        const data = await res.json();
        console.log("Protected Data:", data);

    } catch (error) {
        console.error('Error fetching protected data:', error);
    }
}