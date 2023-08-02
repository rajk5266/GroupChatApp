const token = { headers: {'Authorization' : localStorage.getItem('token')}}
// console.log(token)

$(document).ready(function(){
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
        });
window.addEventListener('DOMContentLoaded', async () => {

  const storedMsg = localStorage.getItem('messages')
  if(storedMsg === null){
      console.log('null')
      getAllMessages(undefined)
  }else{
    const parsedMsg = JSON.parse(storedMsg)
    const lastMessageId = parsedMsg[parsedMsg.length-1].id
    console.log(lastMessageId)
    getAllMessages(lastMessageId)
  }
    getAllUsers()
    // getAllMessages()
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

function continueFetching(){
  setInterval(() => {
    getAllMessages()
  }, 1000)
}
async function getAllMessages(id){
  try{
    const messages = await axios.get(`http://localhost:5000/getAllMessages/${id}`, token)
   
    const newMessages = messages.data.usersMessages;
  
    const storedMessages = localStorage.getItem('messages')

    const parsedMessage = JSON.parse(storedMessages)

    const mergedMessage = parsedMessage.concat(newMessages) 

    const messageLimit = mergedMessage.slice(mergedMessage.length-10)

    localStorage.setItem('messages', JSON.stringify(messageLimit))
    
    for(let i=0; i<messageLimit.length; i++){
      showMessages(messageLimit[i])
    }
    // continueFetching()
  }catch(err){
    console.log(err)
  }
}

async function sendMessage(e){
  e.preventDefault()

  const message = document.getElementById('messageInput').value
  const date = new Date()
  const formattedDate = date.toString().slice(4, 21)
  const name = localStorage.getItem('name')
  // console.log(formattedDate)
  const obj = {
    // name,
    message,
    date: formattedDate,
    isOwnMessage:true
  }
  showMessages(obj)
  const messageToSend = await axios.post('http://localhost:5000/messages',{message,formattedDate} , token)
  // console.log(messageToSend)
  document.getElementById('messageInput').value = ''
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

  function showMessages(message) {
    const parentMessageContainer = document.getElementById('parentMessageContainer');

    const outerDiv = document.createElement('div');
    outerDiv.classList.add('d-flex', 'justify-content-start', 'mb-4');

    const messageContent = document.createElement('div');
    // console.log(message.isOwnMessage)
    const time = document.createElement('span')
    const name = document.createElement('span')
    if(message.isOwnMessage === true){
      messageContent.classList.add('msg_container_own');
      time.classList.add('own_message_time')
      // name.classList.add('own_message_name')
      message.name = ''
    }
    else{
      messageContent.classList.add('msg_container_others')
    
    }
    // console.log(message)
    name.textContent = message.name
    messageContent.textContent = message.message ;
    time.textContent = message.date
    // messageContent.prepend(document.createElement('br'))
    // messageContent.prepend(name)
    // messageContent.appendChild(document.createElement('br'))

    outerDiv.appendChild(messageContent);
   
    parentMessageContainer.appendChild(name)
    parentMessageContainer.appendChild(outerDiv);
    parentMessageContainer.appendChild(time)
    parentMessageContainer.appendChild(document.createElement('hr'))

    parentMessageContainer.scrollTop = parentMessageContainer.scrollHeight
}