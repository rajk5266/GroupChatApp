async function signup(event) {
    try {
        event.preventDefault();
        const signupdetails = {
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value
        }
<<<<<<< HEAD
        localStorage.setItem('username', event.target.username.value)
        const response = await axios.post('http://chatprivate.onrender.com/signup', signupdetails)
        console.log(response)
        if (response.status === 200) {
            alert('registered successfully')
            window.location.href = "http://chatprivate.onrender.com"
=======
        const response = await axios.post('http://localhost:3000/signup', signupdetails)
        console.log(response)
        if (response.status === 200) {
            alert('registered successfully')
            window.location.href = "http://localhost:3000"
>>>>>>> render
        }
    } catch (err) {
        console.log("errorro", err)
        const error = err.response.data.message;
        alert(error)
    }
}