const electron = require("electron")
const {ipcRenderer} = electron

const emojis = document.getElementById("emojis")
const add = document.getElementById("add")

ipcRenderer.send("get_emojis")

ipcRenderer.on("rcv_emojis", (e, emojiList)=>{
	emojis.innerHTML = " "
	let currentDiv = null
	for(let i = 0;i<emojiList["emojis"].length;i++){
		if(i % 3 == 0 || i == 0){
			currentDiv = document.createElement("div")
			currentDiv.setAttribute("id", "flexdiv")
			emojis.appendChild(currentDiv)
		}
			let emojiImg = document.createElement("img")
			emojiImg.setAttribute("src", emojiList["emojis"][i]["logo"])
			emojiImg.setAttribute("url", emojiList["emojis"][i]["url"])
			emojiImg.addEventListener("mousedown", (e)=>{
				if(e.button===2){
					ipcRenderer.send("delete_emoji", emojiImg.getAttribute("url"))
				}else if(e.button===0){
					navigator.clipboard.writeText(emojiImg.getAttribute("url"));
				}
			})
			currentDiv.appendChild(emojiImg)
		}
})

add.addEventListener("keyup", (e)=>{
	if(e.keyCode===13 && add.value !== ""){
		ipcRenderer.send("add_emoji", add.value)
		add.value = ""
	}
})