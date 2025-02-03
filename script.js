let prompt = document.querySelector("#prompt")
let chatContainer = document.querySelector(".chat-container")
let imagebtn = document.querySelector("#image")
let submitbtn=document.querySelector("#submit")
let image=document.querySelector("#image img")
let imageInput = document.querySelector("#image input")

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAuXRtSh2l9czF3WWNFobR6xIyzSktfrA4"

async function generateResponse(aiChatbox) {
    let text = aiChatbox.querySelector(".ai-chat-area")

    let RequestOption={
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body: JSON.stringify({
            "contents":[
                {"parts":[{text:user.message},(user.file.data?[{inline_data:user.file}]:[])

                ]
                }
            ]
        })

    }
     try{
   let response = await fetch(Api_Url,RequestOption)
   let data = await response.json()
   let apiResponse= data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g, "$1").replace(/\n/g, "<br>").trim()
   text.innerHTML = apiResponse

     }
     catch(error){
        console.log(error);
     }
     finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"}) 
        image.src=`img.svg`
        image.classList.remove("choose")
        user.file={}
       }
}


let user={
    message:null,
    file:{
        mime_type: null,
        data: null,
    }
}


function createChatbox(html,classes){
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}

function handlechatResponse(userMessage){
    user.message = userMessage
    let html = `<img src="Pheonix.jpg" alt="" id="userImage" width="50">
            <div class="user-chat-area">
            ${user.message}
            ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
            </div>`
    prompt.value=""
    let userChatbox = createChatbox(html,"user-chat-box")   
    chatContainer.appendChild(userChatbox)   
    
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

    setTimeout(()=>{
    let html =`<img src="CANN-removebg-preview.png" alt="" id="aiImage" width="60">
            <div class="ai-chat-area">
            <img src="loading.webp" alt="" class="load" width="50">
            </div>`
    let aiChatbox = createChatbox(html,"ai-chat-box")        
    chatContainer.appendChild(aiChatbox)
    generateResponse(aiChatbox)

    },600)
}

prompt.addEventListener("keydown", (e)=>{
    if(e.key=="Enter"){
        handlechatResponse(prompt.value)
    }
})
submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value)
})

imageInput.addEventListener("change",()=>{
    const file = imageInput.files[0]
    if(!file) return
    let reader = new FileReader()
    reader.onload=(e)=>{
        let base64string = e.target.result.split(",")[1] 
        user.file={
            mime_type: file.type,
            data: base64string,
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
    }
    
    reader.readAsDataURL(file);
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})