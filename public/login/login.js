async function login(event) {
    try {
        event.preventDefault()
        const obj = {
            username: event.target.username.value,
            password: event.target.password.value
        }
<<<<<<< HEAD
        const logindetails = await axios.post(`http://chatprivate.onrender.com/login`, obj)
        if(logindetails.status === 200){
            localStorage.setItem('token', logindetails.data.token)

            window.location.href = 'http://chatprivate.onrender.com/homePage'
=======
        const logindetails = await axios.post(`http://localhost:3000/login`, obj)
        if(logindetails.status === 200){
            localStorage.setItem('token', logindetails.data.token)
            localStorage.setItem('username', obj.username)
            window.location.href = 'http://localhost:3000/homePage'
>>>>>>> render
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