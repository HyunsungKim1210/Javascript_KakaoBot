function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMultiChat) {
    if (room == "DebugRoom" || isGroupChat == false) {
        if (msg == "추가") {
            replier.reply("/추가 닉:테스트 직업:테스트 무릉:0 전투력:0");
        }
        if (msg == "수정") {
            replier.reply("/수정 닉:테스트 키워드:테스트 활동:true");
        }

        var fileName = "spec.json";
        if (Database.exists(fileName)) {
            var spec = Database.readObject(fileName);

            var isDefault = msg.split("/").length == 2 && msg.split(" ").length > 1;

            var isAdd = msg.split("추가").length == 2;
            var isEdit = msg.split("수정").length == 2;

            if (isDefault) {
                if (isAdd) {
                    var length = spec.member.length;
                    spec.member[length] = spec.member[length - 1];//얘는 값복사
                    var newMember = spec.member[length-1];
                    newMember.isPlaying = true;//얘는 주소복사인듯?

                    if (msg.split("닉:").length == 2) {
                        var name = msg.split("닉:")[1].split(" ")[0];
                        newMember.name = name;
                        newMember.keyword[0] = name;
                    }else {
                        replier.reply("닉네임을 입력하세요");
                        return;
                    }
                    if (msg.split("직업:").length == 2) {
                        var job = msg.split("직업:")[1].split(" ")[0];
                        newMember.job = job;
                    }else {
                        replier.reply("직업을 입력하세요");
                        return;
                    }
                    if (msg.split("무릉:").length == 2) {
                        var moorng = msg.split("무릉:")[1].split(" ")[0];
                        newMember.moorng = moorng;
                    }else newMember.moorng = "0";
                    if (msg.split("수로:").length == 2) {
                        var suro = msg.split("수로:")[1].split(" ")[0];
                        newMember.suro = suro;
                    }
                    if (msg.split("전투력:").length == 2) {
                        var stat = msg.split("전투력:")[1].split(" ")[0];
                        newMember.stat = stat;
                    }else newMember.stat = 0;
                    if (msg.split("키워드:").length >= 2) {                            
                        var keywords = [];
                        keywords = msg.split("키워드:")[1].split(" ")[0].split(",");
                        for (var i = 0; i < keywords.length; ++i) {
                            newMember.keyword[i+1] = keywords[i];
                        }
                    }
                    if(msg.split("요일:").length >= 2) {
                        var days = msg.split("요일:")[1].split(" ")[0].split(",");
                        for (var i = 0; i<days.length; ++i){
                            newMember.days[i] = days[i];
                        }
                    }else newMember.days = [];
                } else if (isEdit) {
                    var index = -1;
                    //수정할 캐릭터 인덱스 찾기
                    if (msg.split("닉:").length == 2) {
                        var name = msg.split("닉:")[1].split(" ")[0];
                        for (var i = 0; i < spec.member.length - 1; ++i) {
                            if (spec.member[i].name == name) {
                                index = i;
                            }
                        }
                    }
                    //수정
                    if (index == -1) {
                        replier.reply("그런애없음");
                        return;
                    } else {
                        var thisMember = spec.member[index];
                        if (msg.split("직업:").length == 2) {
                            var job = msg.split("직업:")[1].split(" ")[0];
                            thisMember.job = job;
                        }
                        if (msg.split("활동:").length == 2) {
                            var isPlaying = (msg.split("활동:")[1].split(" ")[0] == "true");
                            thisMember.isPlaying = isPlaying;
                        }
                        if (msg.split("키워드:").length >= 2) {
                            var keywords = [];
                            keywords = msg.split("키워드:")[1].split(" ")[0].split(",");
                            var count = thisMember.keyword.length;
                            for (var i = count; i < count + keywords.length; ++i) {//현존에 이어붙여 추가
                                thisMember.keyword[i] = keywords[i - count];
                            }
                        }
                        if (msg.split("요일:").length >= 2) {
                            var days = msg.split("요일:")[1].split(" ")[0].split(",");
                            for(var i=0; i<days.length;++i){
                                thisMember.days[i] = days[i];//기존에 아예 덮어쓰기
                            }
                        }

                    }
                }
                if(!(isAdd||isEdit)) return;
                //바뀐 spec 출력하는듯
                Database.writeString(fileName, JSON.stringify(spec));

                var spec2 = Database.readObject(fileName);

                var reply = "[파티원 스펙]";
                var keywords = [];

                for (var i = 0; i < spec2.member.length - 1; ++i) {
                    keywords = spec2.member[i].keyword;

                    reply += "\n" + spec2.member[i].name + " - " + spec2.member[i].job +
                        "\n약 " + spec2.member[i].moorng + "층"
                        + "\n전투력 : " + spec2.member[i].stat / 10000 + "만"
                        + "\n키워드 : " + keywords +"\n";
                    
                        var days = spec2.member[i].days;
                        reply += "요일 : " + days +"\n";
                }
                replier.reply(reply);
            }
        }
    }
}