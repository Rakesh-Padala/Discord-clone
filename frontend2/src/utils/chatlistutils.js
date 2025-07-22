export function getOtherUser(chatdoc, curuser) {
    if (chatdoc.users[0].name === curuser.name) {
        return chatdoc.users[1].name;
    } else {
        return chatdoc.users[0].name;
    }
}
export function getTrimmedChat(msg) {
    if (msg.length > 20) {
        return msg.substring(0, 20) + "...";
    }
    return msg;
}

