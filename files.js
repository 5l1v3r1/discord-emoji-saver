const path = require("path")
const fs = require("fs")

class FileManager{
	constructor(){
		this.dataPath = path.join(__dirname, "data")
		this.emojiJsonPath = path.join(this.dataPath, "emojis.json")
		this.emojiJson = this.getEmojiJson()
	}

	getEmojiJson(){
		return JSON.parse(fs.readFileSync(this.emojiJsonPath))
	}

	saveEmojiJson(baseurl){

		try{
			let urlbase = baseurl.split("?")
			let url = urlbase[0] + "?"
			url += urlbase[1].replace("96", "48")

			let basejson = {
				"logo":baseurl,
				"url":url
			}

			this.emojiJson["emojis"].push(basejson)
			this.saveEmojiJsonFile()
		}catch(e){

		}
		
	}

	deleteEmojiJson(baseurl){
		for (let i = 0; i<this.emojiJson["emojis"].length;i++){
			if(this.emojiJson["emojis"][i]["url"]===baseurl){
				 this.emojiJson["emojis"].splice(i,1)
			}
		}
		this.saveEmojiJsonFile()
	}

	saveEmojiJsonFile(){
		fs.writeFileSync(this.emojiJsonPath, JSON.stringify(this.emojiJson))
	}
}

module.exports = {FileManager}