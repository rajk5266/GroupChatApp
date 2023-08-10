async function login(event) {
    try {
        event.preventDefault()
        const obj = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        const logindetails = await axios.post(`http://chatprivate.onrender.com/login`, obj)
        if(logindetails.status === 200){
            localStorage.setItem('token', logindetails.data.token)

            window.location.href = 'http://chatprivate.onrender.com/homePage'
        }else{
            console.log('failed to login')
        }
    } catch (err) {
        if (err.response.status === 404) {
            alert('user not found, Register first')
        } else if (err.response.status === 400) {
            alert('incorrect password')
        }
    }

}