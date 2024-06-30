function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {
   if(room=="단톡"||room=="자괴감"){
      var length = msg.split("vs").length;
      var msgs = msg.split("vs");
      var it = -1;
      var shelvy = -1;

      if(length>1){

      for(var i=0; i<length; ++i){
         if(msgs[i]=="")return;
         if(msgs[i].split("그것").length==2 && sender != "뭐비숍인데") it=i;
      }
      for(var i=0; i<length; ++i){
         if(msgs[i]=="")return;
         if(msgs[i].split("셸비").length==2&&(msgs[i].split("일진").length==2||msgs[i].split("날라리").length==2||msgs[i].split("양아치").length==2)) shelvy=i;
      }

      var coin = Math.floor(Math.random() * length);
      if(it!=-1) coin=it;
      if(shelvy!=-1) coin=shelvy;
      
      replier.reply(msgs[coin]);
      }
      var msg1 = "";
      if(msg.split("↑↓").length>1)
      msg1 = msg.split("↑↓")[0];
      if(msg.split("업다운").length>1)
      msg1 = msg.split("업다운")[0];

      if(msg1!=""){
      var coin = Math.floor(Math.random() * 2);
      
      replier.reply(msg1 + (coin == 0 ? "↑" : "↓"));
      }
}
}