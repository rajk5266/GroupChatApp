async function signup(event){
    try{
        event.preventDefault();

        const signupdetails = {
             name: event.target.name.value,
             email: event.target.email.value,
            password: event.target.password.value
        }
        const response = await axios.post('http://localhost:5000/signup', signupdetails)
        if(response.data){
            alert('user created successfully')

        }
       
        
    }catch(err){
        const error = err.response.data.message;
         alert(error)
    }
}