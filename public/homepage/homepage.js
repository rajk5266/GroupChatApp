const token = { headers: { 'Authorization': localStorage.getItem('token') } }

$(document).ready(function () {
  $('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
  });
});

window.addEventListener('DOMContentLoaded', async () => {
  getAllGroups()
})

// async function getAllUsers() {
//   try {
//     // const users = await axios.get('http://localhost:5000/getAllUsers', token)
//     // const usernames = users.data.usernames
//     // //   console.log(users.data.names)
//     // for (let i = 0; i < usernames.length; i++) {
//     //   showUsers(usernames[i])
//     // }
//     // const searchUser = await axios.get
//   } catch (err) {
//     console.log(err)
//   }
// }

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
  const messageSend = await axios.post('http://localhost:5000/messages', obj, token)
  console.log(messageSend)
  document.getElementById('messageInput').value = ''
}

async function createGroup(e) {
  try {
    e.preventDefault();
    const obj = {
      groupName: e.target.groupName.value,
      username : localStorage.getItem('username')
    }
// console.log(obj, "[[[[")
    const createGroup = await axios.post('http://localhost:5000/createGroup', obj, token)
    showGroups(createGroup.data.groupDetails)
  } catch (err) {
    console.log(err)
  }
}

async function getAllGroups() {
  try {
    const username = localStorage.getItem('username');
    const allGroups = await axios.get(`http://localhost:5000/getAllGroups/${username}`, token)
    // console.log(allGroups)
    const groups = allGroups.data.groups
   
    for (let i = 0; i < groups.length; i++) {
      showGroups(groups[i])
    }
  } catch (err) {
    console.log(err)
  }
}

async function showGroups(group) {
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

  groupLists.appendChild(singleGroup);

  GroupButton.addEventListener('click', () => {
    const button = document.getElementById('sendMessageButton')
    button.dataset.groupId = group.id

    loadMessageSection(group)
    // document.getElementById('search-option').innerHTML = '';
    // document.getElementById('userList').innerHTML = ''
  })

  // showMembers.addEventListener('click', () => {

  //   showMembersList(group.id)
  // })
}

async function loadMessageSection(group) {
  try {
    const username = localStorage.getItem('username')
   
    document.getElementById('parentMessageContainer').innerHTML = ''
    const groupHeader = document.getElementById('group_headbar')
    
    const groupName = document.getElementById('groupName')
    groupName.textContent = group.groupname;

    const chatSection = document.getElementById('chatSection');
    if(group.admin === username){
      const adddmemberbtn = document.querySelector('.addMemberButton')
      const showMembers = document.querySelector('.showMembers')
      if (adddmemberbtn || showMembers) {
        adddmemberbtn.dataset.groupId = group.id;
        showMembers.dataset.groupId = group.id;
      } else {
        const adddmemberbtn = document.createElement('button')
        const showMembers = document.createElement('button');
  
        adddmemberbtn.textContent = 'Add Member'
        adddmemberbtn.classList = 'addMemberButton'
        adddmemberbtn.dataset.groupId = group.id
        
        showMembers.textContent = 'view Members';
        showMembers.classList = 'showMembers'
        showMembers.dataset.groupId= group.id
        
        groupHeader.appendChild(adddmemberbtn)
        groupHeader.appendChild(showMembers)
  
        adddmemberbtn.addEventListener('click', () => {
          if (!searchContainerExist) {
            showSearchBar()
          }
        });
  
        showMembers.addEventListener('click', () => {
  
        })
      }
    }

    
    chatSection.style.display = 'block';

    // const groupMessages = await axios.get('http://localhost:5000/')

    const storedMsg = localStorage.getItem(`${group.id}`)
    if (storedMsg === null) {
      console.log('null')
      await getAllMessages(undefined, group.id)
    }
    else {
      const parsedMsg = JSON.parse(storedMsg);
      const lastMessageId = parsedMsg[parsedMsg.length - 1].id
      // console.log(lastMessageId)
      await getAllMessages(lastMessageId, group.id)
    }
  } catch (err) {
    console.log(err)
  }
}

async function getAllMessages(id, groupId) {
  try {

    const messages = await axios.get(`http://localhost:5000/getAllMessages/${id}/${groupId}`, token)

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

let searchContainerExist = false

function showSearchBar() {

  const searchBarContainer = document.createElement('div');
  searchBarContainer.classList.add('search-bar-container');

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', 'Search User')
  searchInput.setAttribute('required', '')
  searchInput.classList.add('search-input');

  const searchButton = document.createElement('button');
  searchButton.textContent = 'Search';
  searchButton.classList.add('search-button');

  searchBarContainer.appendChild(searchInput);
  searchBarContainer.appendChild(searchButton);

  const removeButton = document.createElement('button')
  removeButton.id = 'removeButton'
  removeButton.textContent = 'X';
  removeButton.onclick = () => {
    searchSection.innerHTML = '';
    searchContainerExist = false
  }

  const searchSection = document.getElementById('search-option')
  // const userList = document.getElementById('userList')
  // userList.appendChild(searchBarContainer)
  // userList.appendChild(removeButton)
  searchSection.appendChild(searchBarContainer)
  searchSection.appendChild(removeButton)

  searchContainerExist = true;

  searchButton.onclick = () => {
    const inputValue = searchInput.value
    handleSearchUser(inputValue)
  }
}

async function handleSearchUser(user) {
  try {
    const userResult = await axios.get(`http://localhost:5000/searchUser/${user}`, token)
    // console.log("userExist",userResult)
    const username = userResult.data.user
    // console.log(username)
    const userFoundSection = document.getElementById('userList')
    userFoundSection.style.display = 'block';

    const usernameLi = document.createElement('li')
    const addToGroupButton = document.createElement('button')
    addToGroupButton.textContent = 'Add';

    const cancelButton = document.createElement('button')
    cancelButton.textContent = 'X';

    usernameLi.textContent = `${username}`
    usernameLi.appendChild(addToGroupButton)
    usernameLi.appendChild(cancelButton)

    userFoundSection.appendChild(usernameLi)

    addToGroupButton.onclick = () => {
      addToGroup(username)
      userFoundSection.innerHTML = ''
    }
    cancelButton.onclick = () => {
      userFoundSection.innerHTML = ''
      userFoundSection.removeAttribute('style')
    }


  } catch (err) {
    console.log('err', err.response.data)

    alert(err.response.data.message)
  }
}

async function addToGroup(username) {
  try{
    // console.log("usserto addd",username)
    const Button = document.getElementById('sendMessageButton');
    const groupId = Button.dataset.groupId;
    // console.log(groupId)
    const addUserToGroup = await axios.post(`http://localhost:5000/addUserToGroup/${groupId}`, { username }, token)
    console.log(addUserToGroup)
    alert(`${username} added to group`)
  }catch(err){
    if(err.response.status === 305){
      alert(err.response.data.message)
    }
  }
}

async function showMembersList(groupId) {
  try {
    console.log('--->', groupId)
  } catch (err) {
    
  }
}






