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

const fileButton = document.getElementById('fileButton');
const mediaInput = document.getElementById('mediaInput');
const messageInput = document.getElementById('messageInput');
const fileSelectedMessage = document.getElementById('fileSelectedMessage');
const fileNameElement = document.getElementById('fileName');

fileButton.addEventListener('click', () => {
  mediaInput.click();
  fileSelectedMessage.style.display = 'none';
  // console.log(mediaInput.files)
});

mediaInput.addEventListener('change', () => {
  const selectedFile = mediaInput.files[0];
  // messageInput.disabled = true;
  if (selectedFile) {
    fileSelectedMessage.style.display = 'block';
    fileNameElement.textContent = selectedFile.name;
  } else {
    fileSelectedMessage.style.display = 'none';
  }
});

const sendMessage = async (event) => {
  event.preventDefault();

  const message = messageInput.value;
  const selectedFile = mediaInput.files[0];
  const username = localStorage.getItem('username');
  const DATE = new Date();
  const date = DATE.toString().slice(4, 21);
  const groupId = document.getElementById('sendMessageButton').dataset.groupId;
  // console.log(selectedFile.name)

  if (selectedFile) {
    console.log('selected media');
    // messageInput.disabled = true;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFile)

    fileReader.onload = async function () {
      const base64String = fileReader.result.split(',')[1];
      const payload = {
        username,
        media: base64String,
        type: 'image',
        date,
        isOwnMessage: true,
        groupId
      }
      // console.log(payload)
      const response = await axios.post('http://chatprivate.onrender.com/sendMediaFile', payload, token);
      // console.log(response)
      socket.emit('send-media', payload)
      // messageInput.disabled = false
      showMessages(payload)
    }
    const imageElement = document.createElement('img')
    imageElement.src = ``;
    document.body.appendChild(imageElement)
    mediaInput.value = '';
    fileNameElement.innerHTML = ''
  } else if (message) {

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
};


// async function sendMessage(e) {
//   e.preventDefault()

//   const message = document.getElementById('messageInput').value
//   const DATE = new Date()
//   const date = DATE.toString().slice(4, 21)
//   const username = localStorage.getItem('username')
//   const groupId = document.getElementById('sendMessageButton').dataset.groupId
// console.log(username)
//   const messageObj = {
//     username,
//     message,
//     date,
//     isOwnMessage: true,
//     groupId
//   }
//   console.log(messageObj)
//   showMessages(messageObj)
//   socket.emit('send-message', messageObj)
//   const messageSend = await axios.post('http://chatprivate.onrender.com/messages', messageObj, token)
//   // console.log(messageSend)
//   document.getElementById('messageInput').value = ''
// }

async function createGroup(e) {
  try {
    e.preventDefault();
    const obj = {
      groupName: e.target.groupName.value,
      username: localStorage.getItem('username')
    }
    console.log(obj, "[[[[")
    const createGroup = await axios.post('http://chatprivate.onrender.com/createGroup', obj, token)
    showGroups(createGroup.data.groupDetails)
  } catch (err) {
    console.log(err)
  }
}

async function getAllGroups() {
  try {

    const username = localStorage.getItem('username');
    const allGroups = await axios.get(`http://chatprivate.onrender.com/getAllGroups/${username}`, token)
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

  // const imgContainer = document.createElement('div');
  // imgContainer.classList.add('img_cont');

  // const userImg = document.createElement('img');
  // userImg.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQceWscr6c86ViMmGsFmkCx9aSslCiIx83Z3Q&usqp=CAU';
  // userImg.classList.add('rounded-circle', 'user_img');

  const groupInfo = document.createElement('div');
  groupInfo.classList.add('user_info');

  const GroupButton = document.createElement('button');
  GroupButton.textContent = `${group.groupname}`;
  GroupButton.classList.add('openGroupButton');
  GroupButton.id = group.id

  // groupInfo.appendChild(groupName);
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
    const admin = new Set(admins)
    const username = localStorage.getItem('username')

    document.getElementById('parentMessageContainer').innerHTML = ''
    const groupHeader = document.getElementById('group_headbar')

    const groupName = document.getElementById('groupName')
    groupName.textContent = group.groupname;

    const chatSection = document.getElementById('chatSection');
    if (admin.has(username)) {
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
          // if (!searchContainerExist) {
          showSearchBar()
          // }
        });

        showMembers.addEventListener('click', () => {
          const groupId = document.querySelector('.showMembers').dataset.groupId
          //  console.log(groupId)
          showMembersList(groupId)
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

    const messages = await axios.get(`http://chatprivate.onrender.com/getAllMessages/${id}/${groupId}`, token)
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
  const username = localStorage.getItem('username')
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

  // const searchSection = document.getElementById('search-option')
  // const userList = document.getElementById('userList')
  // userList.appendChild(searchBarContainer)
  // userList.appendChild(removeButton)
  searchSection.appendChild(searchBarContainer)
  // searchSection.appendChild(removeButton)

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
    const userResult = await axios.get(`http://chatprivate.onrender.com/searchUser/${user}`, token)
    // console.log("userExist",userResult)
    const username = userResult.data.user
    // console.log(username)
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

    btnDiv.appendChild(addToGroupButton)
    btnDiv.appendChild(cancelButton)

    usernameLi.appendChild(btnDiv)

    searchSection.appendChild(usernameLi)

    addToGroupButton.onclick = () => {
      addToGroup(username)
      userFoundSection.innerHTML = ''
    }
    cancelButton.onclick = () => {
      usernameLi.remove();

      // userFoundSection.removeAttribute('style')
    }


  } catch (err) {
    console.log('err', err.response.data)

    alert(err.response.data.message)
  }
}

async function addToGroup(username) {
  try {
    // console.log("usserto addd",username)
    const Button = document.getElementById('sendMessageButton');
    const groupId = Button.dataset.groupId;
    // console.log(groupId)
    const addUserToGroup = await axios.post(`http://chatprivate.onrender.com/addUserToGroup/${groupId}`, { username }, token)
    // console.log(addUserToGroup)
    alert(`${username} added to group`)
  } catch (err) {
    if (err.response.status === 305) {
      alert(err.response.data.message)
    }
  }
}

async function showMembersList(groupId) {
  try {

    const groupMembers = await axios.get(`http://chatprivate.onrender.com/getGroupMemebersList/${groupId}`, token)

    const users = groupMembers.data;
    // console.log(users)
    const modalBody = document.getElementById('groupMembersModalBody')
    modalBody.innerHTML = '';

    const userList = document.createElement('ul');
    userList.classList.add('list-group');

    for (let i = 0; i < users.length; i++) {
      const admin = users[i].isAdmin;
      const username = users[i].username

      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');

      function makeAdminTag() {
        // listItem.innerHTML = ''
        const adminTag = document.createElement('span')
        adminTag.classList.add('admin')
        listItem.textContent = username;
        adminTag.textContent = 'Admin'
        // adminTag.style.backgroundColor = 'grey'
        listItem.appendChild(adminTag)
      }

      function makeMemberTag() {
        const ButtonDiv = document.createElement('div');

        const makeAdminButton = document.createElement('button')
        const removeMemberButton = document.createElement('button')
        makeAdminButton.classList.add('make-admin-btn')
        removeMemberButton.classList.add('remove-member-Button')
        makeAdminButton.dataset.groupId = groupId;
        removeMemberButton.dataset.groupId = groupId;

        listItem.textContent = username;
        makeAdminButton.textContent = 'Make Admin';
        removeMemberButton.textContent = 'Remove';
        ButtonDiv.appendChild(makeAdminButton)
        ButtonDiv.appendChild(removeMemberButton)
        // listItem.appendChild(makeAdminButton)
        listItem.appendChild(ButtonDiv)

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
    const removeMember = await axios.delete(`http://chatprivate.onrender.com/removeMember/${groupId}/${username}`, token)
    removeMemberTag()
  } catch (err) {
    console.log(err)
  }

}

async function makeAdmin(groupId, username, makeAdminTag) {
  try {
    console.log('make admin')
    const makeAdmin = await axios.put(`http://chatprivate.onrender.com/makeMemberAdmin/${groupId}/${username}`, token)
    console.log(makeAdmin)
    if (makeAdmin.status === 200) {
      makeAdminTag()
    }

  } catch (err) {
    console.log(err)
  }
}








