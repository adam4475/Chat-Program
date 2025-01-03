let userName = "";
const g_id = Math.floor(Math.random() * 10000000);

function scrub(text) {
	if (!text) {
		text = '';
	}
	text = text.replace(/&/g, '&amp;');
	text = text.replace(/>/g, '&gt;');
	text = text.replace(/</g, '&lt;');
	text = text.replace(/\n/g, '<br>');
	text = text.replace(/  /g, ' &nbsp;');
	return text;
}

function post_message(is_me, timestamp, text, userName) {
    timestamp = scrub(timestamp);
    text = scrub(text);
    let chats_table = document.getElementById('chats');
    let new_row = chats_table.insertRow();
    let cell = new_row.insertCell(0);
    let s = [];
    s.push('<div class="');
    s.push(is_me ? 'bubble_right' : 'bubble_left');
    s.push('">');
    s.push(`<span class="date_stamp">${timestamp}</span>`);
    s.push(`<span class="username">${userName}</span>`);
    s.push(`<br>`);
    s.push(`<code>${text}</code>`);
    s.push(`</span>`);
    cell.innerHTML = s.join('');
    cell.scrollIntoView({behavior:'smooth'});
}

//screen for entering name before chatting
function enterName(){
    const content = document.getElementById('content');
    content.innerHTML = `
        <div style ="text-align:center; margin-top:20%;"> 
            <label for="userName">Enter Username:</label>
            <input type="text" id="userName" style="font-size:24px;"> </input>
            <button onclick="startChat()"> Begin Chat </button>
        </div>`
}

//triggered in entername func intended to build off of that
function startChat(){
    const Name = document.getElementById("userName").value;
    userName = Name;

    if(userName){
        showChat();
        get_messages();
        setInterval(get_messages, 500);
    }
}

//shows the whole chat interface like proj5
function showChat(){
    const content = document.getElementById('content');
    //code from proj5
    content.innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100%; background:#808080; display:flex;">
            <div style="float:left; width:100%; display:flex; flex-flow:column; justify-content:space-around;">
                <table width="100%">
                    <tr>
                        <td>
                            <textarea id="chat_text" oninput="auto_grow_text_area(this)" style="box-sizing: border-box;"></textarea>
                        </td>
                        <td valign="bottom" width="80px">
                            <button onclick="on_post_message()">Post</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <br><br><br><br>
        <table id="chats" width="100%"></table>
        `
}

async function on_post_message() {
    let text_area = document.getElementById('chat_text');

    const message = {               //ecapsulate it in an object to it looks neater
        clientId: g_id,
        text: text_area.value,
        timestamp: new Date().toISOString(),
        is_me: true,
        userName: userName,
    };

 
    //fetch is a function built is JS to make network request
    const response = await fetch('/post_message',{
        method: 'POST',             //sends data to server
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
       post_message(true, message.timestamp, message.text, userName);
        text_area.value = '';
        auto_grow_text_area(text_area);
        text_area.focus();
        get_messages();

  
}

async function get_messages(){
    const response = await fetch('/get_messages')
    const messages = await response.json();

        const chats_table = document.getElementById('chats');           //searches for place on page to show messages, specificaly chats
        chats_table.innerHTML = '';         //clear chats to not mix old with new messages

        //use a forEach loop to go thru all messages and post them one by one
        messages.forEach(message => {
           const isMe = message.clientId === g_id
            post_message(isMe, message.timestamp, message.text, message.userName);                //message.clientId === g_id checks if client is same as user
       

        })
    
}


function auto_grow_text_area(el) {
	el.style.height = "5px";
    el.style.height = (el.scrollHeight)+"px";
}

function main() {
    let chats_table = document.getElementById('chats');
    if(!chats_table){

    
    let s = [];
	s.push('<div style="position:fixed; top:0; left:0; width:100%; background:#808080; display:flex;">'); // title bar
	s.push(' <div style="float:left; width:100%; display:flex; flex-flow:column; justify-content:space-around;">'); // buttons area
    s.push('<table width="100%"><tr><td>');
    s.push(`<textarea id="chat_text" oninput="auto_grow_text_area(this)" style="box-sizing: border-box;"></textarea>`);
    s.push('</td><td valign="bottom" width="80px">');
    s.push('<button onclick="on_post_message()">Post</button>');
    s.push('</td></tr></table>');
	s.push(' </div>'); // end buttons area
	s.push('</div>'); // end title bar
	s.push('<br><br><br><br>'); // space under the title bar
    s.push('<table id="chats" width="100%"></table>');
    let the_content = document.getElementById('content');
	the_content.innerHTML = s.join('');
    }
    // Set up the compose area
    let chat_text = document.getElementById('chat_text');
    auto_grow_text_area(chat_text);

    setInterval(get_messages, 500);   
    get_messages();
}


//replace main with this so that the page doesnt start until user enters name
window.onload = function(){
    enterName();
}