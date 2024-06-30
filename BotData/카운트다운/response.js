function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
if(room=="단톡"||room=="자괴감"){
  if(msg.indexOf("/카운트 ")==0){
  var cnt = msg.replace("/카운트 ","");
  
  if(!Number.isInteger(parseInt(cnt)) ||(cnt.split('.').length>1)){replier.reply("[bot] 정수만 입력 가능합니다.");}
  else if(cnt<=10&&cnt>0){
    for(var i=0 ; i<cnt ; i++){
        replier.reply(cnt-i);
    java.lang.Thread.sleep(1000);
   }replier.reply("Go!");
  }else{
        replier.reply("[bot] 카운트다운은 1~10초까지만 가능합니다!");
  }
}
}
}