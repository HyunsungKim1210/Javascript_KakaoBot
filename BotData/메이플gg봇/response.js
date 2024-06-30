function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMultiChat) {

if(room=="자괴감"){
   if(msg.split("/").length==2 &&msg.split("검색").length > 1)
      {
         msg = msg.split("/")[1];
         msg = msg.replace(" ","");
         msg = msg.replace("검색", "");
                     replier.reply("https://maple.gg/u/"+msg);}

    if(msg.split("/").length==2 &&(msg.split("스탯").length > 1
||msg.split("스탯").length > 1))
      {
         msg = msg.split("/")[1];
         msg = msg.replace(" ","");
         msg = msg.replace("스탯", "");
                     replier.reply("http://maplestats.com/demographic/"+msg);}

     if(msg.split("/").length==2 &&msg.split("리스펙").length > 1)
      {
         msg = msg.split("/")[1];
         msg = msg.replace(" ","");
         msg = msg.replace("리스펙", "");
                     replier.reply("http://re-spec.app/character/"+msg);}

     if(msg.split("/").length==2 &&msg.split("정보").length > 1)
      {
         msg = msg.split("/")[1];
         msg = msg.replace(" ","");
         msg = msg.replace("정보", "");
                     replier.reply("https://maple.asdfghjkkl11.com/search/"+msg);}}
}