/*
    A basic Theme that applies a chat-message-like border, header, and frame around the output.
*/


const { Theme } = require("../../core/Theme");

class ChatTheme extends Theme {
    static width = 80;

    static addBanner(message) {
        let barrier = '-'.repeat(this.width);
        let tempMessage = message;
        tempMessage.content = `${barrier}\n${message.content}\n${barrier}`;
        return tempMessage;
    }

    static addHeader(message) {
        let tempMessage = message;
        let header = `From ${tempMessage.author} @ ${tempMessage.location}:`
        tempMessage.content = `${header}\n${tempMessage.content}`;
        return tempMessage;
    }

    static addFrame(message) {
        let tempMessage = message;
        tempMessage.content = `\n${tempMessage.content}\n`;
        return tempMessage;
    }
}

module.exports = { ChatTheme };
