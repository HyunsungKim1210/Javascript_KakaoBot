function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {

if(room=="단톡"||room=="자괴감"){
  if(msg=="가위"||msg=="바위"||msg=="보"){
var a = Math.floor(Math.random() * 3);
var answer = "";

   switch(a){
     case 0:
     answer = "가위";
     break;
     case 1:
     answer = "바위";
     break;
     case 2:
     answer = "보";
     break;
   }
replier.reply(answer);
if(msg==answer){replier.reply("비김ㅡㅡ");}
else if((msg=="가위"&&answer=="보")||(msg=="바위"&&answer=="가위")||(msg=="보"&&answer=="바위"))
{replier.reply(sender+" 승!!");}
else{replier.reply(sender+" 패ㅋ");}
}
}
}