function response(room, msg, sender, isGroupChat, replier, ImageDB) {
    if(room=="알림X방"||room=="ㄹㅇㅋㅋ"||room=="자괴감"||room=="단톡"){
        replier.markAsRead();
    }

    if(msg.split("(광고)").length>1){
        replier.markAsRead();
    }
}