const token = { headers: { 'Authorization': localStorage.getItem('token') } }
// console.log(token)

$(document).ready(function () {
  $('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
  });
});
window.addEventListener('DOMContentLoaded', async () => {

  const storedMsg = localStorage.getItem('messages')
  // console.log(storedMsg)
  // if (storedMsg === null) {
  //   // console.log('null')
  //   await getAllMessages(undefined)
  // }
  // else {
  //   const parsedMsg = JSON.parse(storedMsg);
  //   const lastMessageId = parsedMsg[parsedMsg.length - 1].id
  //   await getAllMessages(lastMessageId)
  // }
  // getAllUsers()
  getAllGroups()
})
async function getAllUsers() {
  try {
    // const users = await axios.get('http://localhost:5000/getAllUsers', token)
    // const usernames = users.data.usernames
    // //   console.log(users.data.names)
    // for (let i = 0; i < usernames.length; i++) {
    //   showUsers(usernames[i])
    // }
    // const searchUser = await axios.get
  } catch (err) {
    console.log(err)
  }
}

function continueFetching() {
  setInterval(() => {
    getAllMessages()
  }, 1000)
}



async function sendMessage(e) {
  e.preventDefault()

  const message = document.getElementById('messageInput').value
  const DATE = new Date()
  const date = DATE.toString().slice(4, 21)
  const name = localStorage.getItem('name')
  const groupId = document.getElementById('sendMessageButton').dataset.groupId

  const obj = {
    // name,
    message,
    date,
    isOwnMessage: true,
    groupId
  }
  showMessages(obj)
  const messageSend = await axios.post('http://localhost:5000/messages',obj, token)
  console.log(messageSend)
  document.getElementById('messageInput').value = ''
}

// function showUsers(name) {
//   const contacts = document.querySelector('.contacts');
//   const userItem = document.createElement('li');
//   userItem.classList.add('active');

//   const userDiv = document.createElement('div');
//   userDiv.classList.add('d-flex', 'bd-highlight');

//   const imgCont = document.createElement('div');
//   imgCont.classList.add('img_cont');

//   const userImg = document.createElement('img');
//   userImg.classList.add('rounded-circle', 'user_img');
//   userImg.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQceWscr6c86ViMmGsFmkCx9aSslCiIx83Z3Q&usqp=CAU';

//   // const onlineIcon = document.createElement('span');
//   // onlineIcon.classList.add('online_icon');

//   const userInfo = document.createElement('div');
//   userInfo.classList.add('user_info');

//   const usernameSpan = document.createElement('span');
//   usernameSpan.textContent = name;

//   // Uncomment the next lines if you want to display online status
//   // const onlineStatus = document.createElement('p');
//   // onlineStatus.textContent = `${name} is online`;

//   // Append elements to create the desired structure
//   imgCont.appendChild(userImg);
//   // imgCont.appendChild(onlineIcon);
//   userInfo.appendChild(usernameSpan);
//   // Uncomment the next line to append the online status paragraph
//   // userInfo.appendChild(onlineStatus);
//   userDiv.appendChild(imgCont);
//   userDiv.appendChild(userInfo);
//   userItem.appendChild(userDiv);
//   contacts.appendChild(userItem);

//   contacts.scrollTop = contacts.scrollHeight
// }

async function createGroup(e) {
  try {
    e.preventDefault();
    // const groupName = e.target.groupName.value
    // console.log(groupName)
    const obj = {
      groupName: e.target.groupName.value
    }
    const createGroup = await axios.post('http://localhost:5000/createGroup', obj, token)
    console.log(createGroup)
    showGroups(createGroup.data.groupDetails)
  } catch (err) {
    console.log(err)
  }
}

async function getAllGroups() {
  try {
    const allGroups = await axios.get('http://localhost:5000/getAllGroups', token)
    const groups = allGroups.data.groups
    // console.log(groups)
    for (let i = 0; i < groups.length; i++) {

      showGroups(groups[i])
    }
  } catch (err) {
    console.log(err)
  }
}

async function showGroups(group) {
  // console.log(group.id)
  const groupLists = document.querySelector('.contacts');
  
  // Create a new <li> element for each group
  const singleGroup = document.createElement('li');
  // singleGroup.classList.add('active');

  // Create the inner elements for the group
  const groupDiv = document.createElement('div');
  groupDiv.classList.add('d-flex', 'bd-highlight');

  // const imgContainer = document.createElement('div');
  // imgContainer.classList.add('img_cont');

  // const userImg = document.createElement('img');
  // userImg.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQceWscr6c86ViMmGsFmkCx9aSslCiIx83Z3Q&usqp=CAU';
  // userImg.classList.add('rounded-circle', 'user_img');

  const groupInfo = document.createElement('div');
  groupInfo.classList.add('user_info');

  const groupName = document.createElement('span');
  groupName.textContent = group.groupname;

  const GroupButton = document.createElement('button');
  GroupButton.textContent = 'Open group';
  GroupButton.classList.add('openGroupButton');
  GroupButton.id = group.id

  groupInfo.appendChild(groupName);
  groupInfo.appendChild(GroupButton);
  // groupDiv.appendChild(imgContainer);
  groupDiv.appendChild(groupInfo);
  singleGroup.appendChild(groupDiv);
  

  // Append the <li> element to the <ul> with class "contacts"
  groupLists.appendChild(singleGroup);
  GroupButton.addEventListener('click', () => {
    const button = document.getElementById('sendMessageButton')
    button.dataset.groupId = group.id

    // document.getElementById('sendMessageButton').style.display = 'block'

   

    // console.log(group.id)
    // loadMessageSection(group.id)

    // console.log(storedMsg)

    // getAllMessages(1, group.id)
    loadMessageSection(group.groupname, group.id)
  })
}

async function loadMessageSection(groupname, id) {
  try {
    document.getElementById('parentMessageContainer').innerHTML = ''
    // document.getElementById('group_headbar').innerHTML = ''
    const groupHeader = document.getElementById('group_headbar')
    // groupHeader.removeChild(document.getElementById('addMemberButton'))

    // console.log(groupname, id)
    const groupName = document.getElementById('groupName')
    groupName.textContent = groupname

    const adddmemberbtn = document.getElementById('addMemberButton')
    // console.log("button",adddmemberbtn)
    const chatSection = document.getElementById('chatSection');
    if(adddmemberbtn){
      adddmemberbtn.dataset.id = id
    }else{
      const addButton = document.createElement('button')
  
      addButton.textContent = 'Add Member'
      addButton.id = 'addMemberButton'
      addButton.dataset.groupId = id
      groupHeader.appendChild(addButton)
    }
    chatSection.style.display = 'block';
   
    // const groupMessages = await axios.get('http://localhost:5000/')

    const storedMsg = localStorage.getItem(`${id}`)
    console.log('storedmessage',storedMsg)
    if (storedMsg === null) {
      // console.log('null')
      await getAllMessages(undefined , id)
    }
    else {
      const parsedMsg = JSON.parse(storedMsg);
      const lastMessageId = parsedMsg[parsedMsg.length - 1].id
      console.log(lastMessageId)
      await getAllMessages(lastMessageId, id)
    }
    // getAllMessages()
  } catch (err) {
    console.log(err)
  }
}

async function getAllMessages(id, groupId) {
  try {
    console.log('id', id)
    console.log('groupId', groupId)
    const messages = await axios.get(`http://localhost:5000/getAllMessages/${id}/${groupId}`, token)
    console.log(`${groupId}`,messages)
    const newMessages = messages.data.usersMessages;
    const storedMessages = localStorage.getItem(`${groupId}`)
    if (storedMessages == null && newMessages.length == 0) {
      return
    }
    // console.log(newMessages)
    if (!storedMessages) {
      if (newMessages.length < 10) {
        localStorage.setItem(`${groupId}`, JSON.stringify(newMessages))
        for (let i = 0; i < newMessages.length; i++) {
          showMessages(newMessages[i])
        }
      } else {
        let newmsg = newMessages.slice(newMessages.length - 10)
        // console.log(newmsg)
        localStorage.setItem(`${groupId}`, JSON.stringify(newmsg))
        for (let i = 0; i < newmsg.length; i++) {
          showMessages(newmsg[i])
        }
      }
    }
    else {
      let parsedMessage = JSON.parse(storedMessages)
      const mergedMessage = parsedMessage.concat(newMessages)
      if (mergedMessage.length > 10) {
        const messageLimit = mergedMessage.slice(mergedMessage.length - 10)
        localStorage.setItem(`${groupId}`, JSON.stringify(messageLimit))
        for (let i = 0; i < messageLimit.length; i++) {
          showMessages(messageLimit[i])
        }
      }
      else {
        const messageLimit = mergedMessage
        localStorage.setItem(`${groupId}`, JSON.stringify(messageLimit))
        for (let i = 0; i < messageLimit.length; i++) {
          showMessages(messageLimit[i])
        }
      }
    }

    // continueFetching()
  } catch (err) {
    console.log(err)
  }
}

function showMessages(message) {
  console.log("showmessages",message)
  const parentMessageContainer = document.getElementById('parentMessageContainer');

  const outerDiv = document.createElement('div');
  outerDiv.classList.add('d-flex', 'justify-content-start', 'mb-4');

  const messageContent = document.createElement('div');
  // console.log(message.isOwnMessage)
  const time = document.createElement('span')
  const name = document.createElement('span')
  if (message.isOwnMessage === true) {
    messageContent.classList.add('msg_container_own');
    time.classList.add('own_message_time')
    message.name = ''
  }
  else {
    messageContent.classList.add('msg_container_others')
    time.classList.add('others_message_time')
  }
  // console.log(message)
  name.textContent = message.name
  messageContent.textContent = message.message;
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






