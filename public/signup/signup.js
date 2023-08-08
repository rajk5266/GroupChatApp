async function signup(event) {
    try {
        event.preventDefault();
        const signupdetails = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value
        }
        localStorage.setItem('username', event.target.username.value)
        const response = await axios.post('https://chatprivate.onrender.com/signup', signupdetails)
        console.log(response)
        if (response.status === 200) {
            alert('registered successfully')
            window.location.href = "https://chatprivate.onrender.com"
        }
        // console.log(response.data)
    } catch (err) {
        console.log("errorro", err)
        const error = err.response.data.message;
        alert(error)
    }
}