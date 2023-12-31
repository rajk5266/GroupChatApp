const token = { headers: { 'Authorization': localStorage.getItem('token') } }

$(document).ready(function () {
  $('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
  });
});

const socket = io('http://chatprivate.onrender.com')

socket.on('connect', () => {
  console.log('connected')
})

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

    // console.log(obj)
    console.log(message)
    // messageInput.disabled = false;
    const messageObj = {
      username,
      message,
      date,
      isOwnMessage: true,
      groupId
    };

    socket.emit('send-message', messageObj);
    showMessages(messageObj)
    const messageSend = await axios.post('http://chatprivate.onrender.com/messages', messageObj, token)
    messageInput.value = ''; 
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
      username: localStorage.getItem('username')
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

  const singleGroup = document.createElement('li');
  singleGroup.classList.add('groupLi')

  const groupDiv = document.createElement('div');
  groupDiv.classList.add('d-flex', 'bd-highlight');

  const groupInfo = document.createElement('div');
  groupInfo.classList.add('user_info');

  const GroupButton = document.createElement('button');
  GroupButton.textContent = `${group.groupname}`;
  GroupButton.classList.add('openGroupButton');
  GroupButton.id = group.id

  groupInfo.appendChild(groupName);
  groupInfo.appendChild(GroupButton);

  groupDiv.appendChild(groupInfo);
  singleGroup.appendChild(groupDiv);

  groupLists.appendChild(singleGroup);

  GroupButton.addEventListener('click', () => {
    const button = document.getElementById('sendMessageButton')
    button.dataset.groupId = group.id
    loadMessageSection(group)
  })
}

async function loadMessageSection(group) {
  try {
    socket.on('receive-message', messageObj => {
      // console.log('receive message')
      console.log(messageObj)
      showMessages(messageObj)
    })
    socket.on('receive-media', mediaObj => {
      console.log(mediaObj)
      showMessages(mediaObj)
    })
    const admins = group.admin.split(',')
    console.log(admins)
    const admin = new Set(admins)
    console.log(admin)
    const username = localStorage.getItem('username')

    document.getElementById('parentMessageContainer').innerHTML = ''
    const groupHeader = document.getElementById('group_headbar')

    const groupName = document.getElementById('groupName')
    groupName.textContent = group.groupname;

    const chatSection = document.getElementById('chatSection');
    if (adminSet.has(username)) {
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
        showMembers.dataset.groupId = group.id

        groupHeader.appendChild(adddmemberbtn)
        groupHeader.appendChild(showMembers)

        adddmemberbtn.addEventListener('click', () => {
          showSearchBar()
        });

        showMembers.addEventListener('click', () => {
          const groupId = document.querySelector('.showMembers').dataset.groupId
          showMembersList(group)
        })
      }
    }
    else{
      const showMembers = document.querySelector('.showMembers')
      if (showMembers) {
        showMembers.dataset.groupId = group.id;
      } else {
        const showMembers = document.createElement('button');

        showMembers.textContent = 'view Members';
        showMembers.classList = 'showMembers'
        showMembers.dataset.groupId = group.id

        groupHeader.appendChild(showMembers)
        showMembers.addEventListener('click', () => {
          const groupId = document.querySelector('.showMembers').dataset.groupId
          //  console.log(groupId)
          showMembersList(group)
        })
      }
    }
    chatSection.style.display = 'block';

    const storedMsg = localStorage.getItem(`${group.id}`)
    if (storedMsg === null) {
      // console.log('null')
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
    // console.log(messages)

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
  // console.log(message)
  const parentMessageContainer = document.getElementById('parentMessageContainer');

  const outerDiv = document.createElement('div');
  outerDiv.classList.add('d-flex', 'justify-content-start', 'mb-4');

  const messageContent = document.createElement('div');
  const time = document.createElement('span')
  const name = document.createElement('span')
  const decodedMessage = decodeURIComponent(message.message)

  if (decodedMessage.startsWith('https')) {
    const imageElement = document.createElement('img');
    imageElement.src = message.message;
    imageElement.classList.add('chat-image');
    if (message.username == username) {
      messageContent.classList.add('msg_container_own');
      time.classList.add('own_message_time')
      message.name = ''
    }
    else {
      messageContent.classList.add('msg_container_others')
      time.classList.add('others_message_time');
      name.textContent = message.username
    }
    messageContent.appendChild(imageElement);
  }
  else if (message.type === 'image') {
    // If the message type is 'image', assume it's image data from socket event
    const imageElement = document.createElement('img');
    imageElement.src = `data:image/jpeg;base64,${message.media}`;
    imageElement.classList.add('chat-image');
    messageContent.appendChild(imageElement);

    if (message.username == username) {
      messageContent.classList.add('msg_container_own');
      time.classList.add('own_message_time');
      message.name = '';
    } else {
      messageContent.classList.add('msg_container_others');
      time.classList.add('others_message_time');
      name.textContent = message.username;
    }
  }
  
  else {
    // console.log('messages')
    if (message.username == username) {
      messageContent.classList.add('msg_container_own');
      time.classList.add('own_message_time')
      message.name = ''
    }
    else {
      messageContent.classList.add('msg_container_others')
      time.classList.add('others_message_time');
      name.textContent = message.username
    }
    messageContent.textContent = message.message;
  }
  time.textContent = message.date
  outerDiv.appendChild(messageContent);
  parentMessageContainer.appendChild(name)
  parentMessageContainer.appendChild(outerDiv);
  parentMessageContainer.appendChild(time)
  parentMessageContainer.appendChild(document.createElement('hr'))
  parentMessageContainer.scrollTop = parentMessageContainer.scrollHeight
}



let searchContainerExist = false;
const searchSection = document.getElementById('search-option');

function showSearchBar() {

  searchSection.innerHTML = '';

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
  searchSection.appendChild(searchBarContainer)

  searchContainerExist = true;

  searchButton.onclick = () => {
    const inputValue = searchInput.value
    handleSearchUser(inputValue)
  }
  const modalBody = document.getElementById('groupMembersModalBody')
  modalBody.innerHTML = '';
  modalBody.appendChild(searchSection);

  const groupMembersModal = new bootstrap.Modal(document.getElementById('groupMembersModal'));
  groupMembersModal.show();
}

async function handleSearchUser(user) {
  try {
    const userResult = await axios.get(`http://localhost:5000/searchUser/${user}`, token)
    // console.log("userExist",userResult)
    const username = userResult.data.user
    const userFoundSection = document.getElementById('userList')
    userFoundSection.style.display = 'block';

    const usernameLi = document.createElement('li')
    usernameLi.classList.add('searchedUser')
    usernameLi.style.textDecoration = 'none';

    const btnDiv = document.createElement('div')

    const addToGroupButton = document.createElement('button')
    addToGroupButton.textContent = 'Add';

    const cancelButton = document.createElement('button')
    cancelButton.textContent = 'X';

    usernameLi.textContent = `${username}`
    usernameLi.appendChild(addToGroupButton)
    usernameLi.appendChild(cancelButton)

    usernameLi.appendChild(btnDiv)
    searchSection.appendChild(usernameLi)

    addToGroupButton.onclick = () => {
      addToGroup(username)
      userFoundSection.innerHTML = ''
    }
    cancelButton.onclick = () => {
      usernameLi.remove();
    }
  } catch (err) {
    console.log('err', err.response.data)
    alert(err.response.data.message)
  }
}

async function addToGroup(username) {
  try {
    const Button = document.getElementById('sendMessageButton');
    const groupId = Button.dataset.groupId;
    // console.log(groupId)
    const addUserToGroup = await axios.post(`http://localhost:5000/addUserToGroup/${groupId}`, { username }, token)
    // console.log(addUserToGroup)
    alert(`${username} added to group`)
  } catch (err) {
    if (err.response.status === 305) {
      alert(err.response.data.message)
    }
  }
}

async function showMembersList(group) {
  try {
    
    const groupMembers = await axios.get(`http://localhost:5000/getGroupMemebersList/${groupId}`, token)

    const users = groupMembers.data;
    console.log(users)
    const modalBody = document.getElementById('groupMembersModalBody')
    modalBody.innerHTML = '';

    const userList = document.createElement('ul');
    userList.classList.add('list-group');

    for (let i = 0; i < users.length; i++) {
      const admin = users[i].isAdmin;
      const username = users[i].username

      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');

      function makeAdminTag(x) {
        const adminTag = document.createElement('span')
        adminTag.classList.add('admin')
        listItem.textContent = username;
        adminTag.textContent = 'Admin'
        adminTag.style.backgroundColor = 'grey'
        listItem.appendChild(adminTag)
      }
      function makeMemberTag() {
        const makeAdminButton = document.createElement('button')
        const removeMemberButton = document.createElement('button')
        makeAdminButton.classList.add('make-admin-btn')
        removeMemberButton.classList.add('remove-member-Button')
        makeAdminButton.dataset.groupId = groupId;
        removeMemberButton.dataset.groupId = groupId;

        listItem.textContent = username;
        makeAdminButton.textContent = 'Make Admin';
        removeMemberButton.textContent = 'Remove'
        listItem.appendChild(makeAdminButton)
        listItem.appendChild(removeMemberButton)

        removeMemberButton.addEventListener('click', () => {
          removeMember(groupId, username, removeMemberTag)
        })

        makeAdminButton.addEventListener('click', () => {
          makeAdmin(groupId, username, makeAdminTag)
        })
      }


      if (admin === true) {
        makeAdminTag()
      } else {
        makeMemberTag()
      }
      userList.appendChild(listItem);

      const removeMemberTag = () => {
        listItem.innerHTML = `${username} - removed from group`
      }
    }
    modalBody.appendChild(userList);
    const groupMembersModal = new bootstrap.Modal(document.getElementById('groupMembersModal'));
    groupMembersModal.show();
  } catch (err) {
  }
}

async function removeMember(groupId, username, removeMemberTag) {
  try {
    const removeMember = await axios.delete(`http://localhost:5000/removeMember/${groupId}/${username}`, token)
    removeMemberTag()
  } catch (err) {
    console.log(err)
  }
}

async function makeAdmin(groupId, username, makeAdminTag) {
  try {
    console.log('make admin')
    // console.log(groupId, username)
    // let x = 1;
    // if(x == 1){
    //   makeAdminTag()
    // }
    const makeAdmin = await axios.put(`http://localhost:5000/makeMemberAdmin/${groupId}/${username}`, token)
    console.log(makeAdmin)
    if(makeAdmin.status === 200){
      makeAdminTag()
    }
  } catch (err) {
    console.log(err)
  }
}

const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/'
})








