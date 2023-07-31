const token = { headers: {'Authorization' : localStorage.getItem('token')}}
// console.log(token)

$(document).ready(function(){
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
        });
window.addEventListener('DOMContentLoaded', async () => {
    getAllUsers()
})
async function getAllUsers(){
    try{
      const users = await axios.get('http://localhost:5000/getAllUsers', token)
      const names = users.data.names
    //   console.log(users.data.names)
      for(let i=0; i<names.length; i++){

          showUsers(names[i])
      }
    }catch(err){
        console.log(err)
    }
}

async function sendMessage(e){
  e.preventDefault()
  const message = document.getElementById('messageInput').value
  // console.log(message)
  const messageToSend = await axios.post('http://localhost:5000/messages',{message} , token)
}

function showUsers(name) {
    const contacts = document.querySelector('.contacts');
    const userItem = document.createElement('li');
    userItem.classList.add('active');
  
    const userDiv = document.createElement('div');
    userDiv.classList.add('d-flex', 'bd-highlight');
  
    const imgCont = document.createElement('div');
    imgCont.classList.add('img_cont');
  
    const userImg = document.createElement('img');
    userImg.classList.add('rounded-circle', 'user_img');
    userImg.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQceWscr6c86ViMmGsFmkCx9aSslCiIx83Z3Q&usqp=CAU';
  
    // const onlineIcon = document.createElement('span');
    // onlineIcon.classList.add('online_icon');
  
    const userInfo = document.createElement('div');
    userInfo.classList.add('user_info');
  
    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = name;
  
    // Uncomment the next lines if you want to display online status
    // const onlineStatus = document.createElement('p');
    // onlineStatus.textContent = `${name} is online`;
  
    // Append elements to create the desired structure
    imgCont.appendChild(userImg);
    // imgCont.appendChild(onlineIcon);
    userInfo.appendChild(usernameSpan);
    // Uncomment the next line to append the online status paragraph
    // userInfo.appendChild(onlineStatus);
    userDiv.appendChild(imgCont);
    userDiv.appendChild(userInfo);
    userItem.appendChild(userDiv);
    contacts.appendChild(userItem);
  }
  