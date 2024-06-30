function response(room, msg, sender, isGroupChat, replier) {
    if ((room == "자괴감" || isGroupChat == false) && msg[0] == "/") {
        var fileName = "spec.json";
        if (Database.exists(fileName)) {
            var spec = Database.readObject(fileName);

            if (msg.split("리스펙").length == 2) return;

            if (msg == "/스펙") {
                var reply = "[파티원 스펙]";
                var list = [];
                for (var i = 0; i < spec.member.length - 1; ++i) {
                    if (spec.member[i].isPlaying) {
                        list.push(spec.member[i]);
                    }
                }
                list.sort((a, b) => b.stat - a.stat);
                for(var i = 0; i < list.length; ++i){
                    var stat = "";
                    if (list[i].stat > 100000000) {
                        stat = parseInt(list[i].stat / 100000000) + "억 " + (list[i].stat % 100000000) / 10000 + "만";
                    }
                    else if (list[i].stat > 10000) {
                        stat = list[i].stat / 10000 + "만";
                    }
                    else
                    {
                        stat = list[i].stat;
                    }
                    var isBoss = (list[i].job == "이위로");
                    if(isBoss && list[i-1].job != "이위로") reply += "\n";
                    
                    reply += "\n" + (isBoss ? "★" : "") + list[i].name + " - " + list[i].job +
                        " (약 " + stat + ", " + list[i].moorng + "층)";
                    if(isBoss && list[i+1].job != "이위로") reply += "\n";
                }
                replier.reply(reply);
                return;
            }

            var isDefault = msg.split("/").length == 2 && msg.split(" ").length > 1;
            var isSpec = msg.split("스펙").length > 1;
            var isMoorng = msg.split("층").length > 1;
            var isStat = msg.split("만").length > 1;
            var isStatus = msg.equals("상태창!");

            if ((isDefault && (isSpec || isMoorng || isStat))
                ||isStatus) {

                msg = msg.replace("/", "");

                msg = msg.replace("스펙", "");
                msg = msg.replace("층", "");
                
                var man = msg.split("만").length;
                if(man > 2) msg = msg.substring(0, msg.length -1);

                var regex = /[^0-9]/g;

                var name = msg.split(" ")[0]
                var data = msg.split(" ")[1];

                if(isSpec && name.length == 0)
                {
                    name = data;
                }
                if(isStat){
                    data = data.replace(regex, "");
                    if(data.length == 0) isStat = false;
                }
                
                if(isStatus) {
                    isSpec = true;
                    name = sender;
                }

                var reply = "";

                var i = 0;
                for (; i < spec.member.length; ++i) {
                    var keywords = spec.member[i].keyword;
                    for (var j = 0; j < keywords.length; ++j) {
                        if (keywords[j] == name) {
                            if (isSpec) {
                                var stat = "0";
                                if (spec.member[i].stat > 100000000) {
                                    stat = parseInt(spec.member[i].stat / 100000000) + "억 " + (spec.member[i].stat % 100000000) / 10000 + "만";
                                }
                                else if (spec.member[i].stat > 10000) {
                                    stat = spec.member[i].stat / 10000 + "만";
                                }
                                else {
                                    stat = spec.member[i].stat;
                                }
                                reply = "[" + spec.member[i].name + " 스펙]\n (전투력 약 " + stat + ", " + spec.member[i].moorng + "층)";
                                reply += "\n http://re-spec.app/character/" + spec.member[i].name;
                            }
                            else if (isMoorng) {
                                spec.member[i].moorng = data;
                                reply = spec.member[i].name + " 약 " + spec.member[i].moorng + "층으로 수정 완료.";
                            }
                            else if (isStat) {
                                spec.member[i].stat = data * 10000;
                                reply = spec.member[i].name + " 약 " + data + "만으로 수정 완료.";
                            }else return;
                            break;
                        }
                    }
                    if (j < keywords.length) break;
                }

                if (i < spec.member.length) {
                    replier.reply(reply);

                    if (isMoorng || isStat)
                        Database.writeString(fileName, JSON.stringify(spec));
                }
                else {
                    replier.reply("그런애없음");
                }
            }
        }
    }
}