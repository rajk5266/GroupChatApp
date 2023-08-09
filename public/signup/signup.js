async function signup(event) {
    try {
        event.preventDefault();
        const signupdetails = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value
        }
        localStorage.setItem('username', event.target.username.value)
        const response = await axios.post('http://localhost:4000/signup', signupdetails)
        console.log(response)
        if (response.status === 200) {
            alert('registered successfully')
            window.location.href = "http://localhost:4000"
        }
        // console.log(response.data)
    } catch (err) {
        console.log("errorro", err)
        const error = err.response.data.message;
        alert(error)
    }
}