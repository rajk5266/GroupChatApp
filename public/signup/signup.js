async function signup(event) {
    try {
        event.preventDefault();
        const signupdetails = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value
        }
        const response = await axios.post('http://localhost:5000/signup', signupdetails)
        console.log(response)
        if (response.status === 200) {
            alert('registered successfully')
            window.location.href = "http://localhost:5000"
        }
        console.log(response.data)
    } catch (err) {
        console.log(err)
        const error = err.response.data.message;
        alert(error)
    }
}