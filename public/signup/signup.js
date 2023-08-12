async function signup(event) {
    try {
        event.preventDefault();
        const signupdetails = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value
        }
        const response = await axios.post('https://chatprivate.onrender.com:3000/signup', signupdetails)
        console.log(response)
        if (response.status === 200) {
            alert('registered successfully')
            window.location.href = "https://chatprivate.onrender.com:3000"
        }
    } catch (err) {
    
        const error = err.response.data.message;
        alert(error)
    }
}