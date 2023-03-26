import Ally from './assets/bot.svg'
import You from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}


function handleVideoChange() {
    const videoElement = document.getElementById("media-video");
    const video2Source = document.getElementById("video-2");
  
    videoElement.addEventListener("loadedmetadata", () => {
      videoElement.play();
    });
  
    videoElement.addEventListener("ended", () => {
      videoElement.src = video2Source.src;
      videoElement.loop = true;
      videoElement.load();
      videoElement.play();
    });
  }
  
  handleVideoChange();

  // Add this function to update the time
function updateTime() {
    const timeElement = document.getElementById("time");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    timeElement.innerText = `${hours}:${minutes}:${seconds}`;
  }
  
  // Call the updateTime function initially and every second afterward
  updateTime();
  setInterval(updateTime, 1000);
  
  // ... the rest of your script.js code
  
  

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    const prefix = isAi ? 'Ally1.0:' : 'You:';
    const message = value;
    return (
      `
        <div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
            <div class="profile">
              <img 
                src=${isAi ? Ally : You} 
                alt="${isAi ? 'Ally:' : 'You:'}" 
              />
            </div>
            <div class="message-container">
              <div class="prefix">${prefix}</div>
              <div class="message" id=${uniqueId}>${message}</div> <!-- Remove the space here -->
            </div>
          </div>
        </div>
      `
    );
}
  

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    const userChatStripe = document.createElement('div');
    userChatStripe.innerHTML = chatStripe(false, data.get('prompt'), 'You:');
    chatContainer.prepend(userChatStripe);

    // to clear the textarea input 
    form.reset();

    // bot's chatstripe
    const uniqueId = generateUniqueId();
    const botChatStripe = document.createElement('div');
    botChatStripe.innerHTML = chatStripe(true, "", uniqueId);
    chatContainer.prepend(botChatStripe);
    
    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('https://ally1-0.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt'),
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.Ally.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})
