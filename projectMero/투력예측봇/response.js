function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMultiChat) {
    if ((room == "자괴감" || isGroupChat == false) && msg[0] == "/") {
        var fileName = "spec.json";
        if (Database.exists(fileName)) {
            var spec = Database.readObject(fileName);
            if(msg.split("/전투력예측").length == 2){
                //보스 이름 받는다
                var bossIndex = -1;
                if(msg.split(" ").length == 3){
                    var bossName = msg.split(" ")[1];
                    for (var i = 0; i < spec.member.length - 1; ++i) {
                        if(spec.member[i].name == bossName){
                            bossIndex = i;
                            break;
                        }
                    }
                    if(bossIndex == -1){
                        replier.reply("보스 이름을 찾을 수 없습니다");
                        return;
                    }
                }
                else{
                    replier.reply("[전투력예측_보스이름_XX분XX초]로 입력해주세요");
                    return;
                }
                //목표 시간 받는다
                var targetClearSec = changeClearTimeStringToSec(msg.split(" ")[2]);
                if(targetClearSec == -1){
                    replier.reply("[XX분XX초]\n[XX분]\n[XX초]\n로 입력해주세요");
                    return;
                }
                //예상 전투력 출력
                var reply = "예상 파티 전투력은\n";
                var requiredCombatStatus = getSoloAbleCombatStatusDifference(targetClearSec)*10000;
                if((typeof spec.member[bossIndex].stat) == "string"){
                    requiredCombatStatus += parseInt(spec.member[bossIndex].stat);
                }
                else if((typeof spec.member[bossIndex].stat) == "number"){
                    requiredCombatStatus += spec.member[bossIndex].stat;
                }
                else{
                    replier.reply("보스 전투력이 string도 number도 아닙니다");
                    return;
                }
                reply += changeNumberToString(requiredCombatStatus) + "\n입니다";
                replier.reply(reply);
                return;
            }
        }        
    }
}

function changeClearTimeStringToSec(clearTimeString){
    var clearSec = 0;
    var minSplice = clearTimeString.split("분");
    //XX분 받는다
    if(minSplice.length == 2){
        clearSec += parseInt(minSplice[0])*60;
    }
    //XX초 받는다
    var secSplice = clearTimeString.split("초");
    if(secSplice.length == 2){
        var minSpliceAfterSecSplice = secSplice[0].split("분");
        //XX분XX초일 경우
        if(minSpliceAfterSecSplice.length == 2){
            clearSec += parseInt(minSpliceAfterSecSplice[1]);
        }
        //XX초일 경우
        else{
            clearSec += parseInt(minSpliceAfterSecSplice[0]);
        }
    }
    if(clearSec != 0){
        return clearSec;
    }
    else{
        return -1;
    }
}

function getSoloAbleCombatStatusDifference(targetClearSec){
    return Math.exp((targetClearSec-3451.2) / (-347))-116.5711063;
}

function getPartyAbleCombatStatusDifference(targetClearSec){
    return -1*Math.pow(10,4)*Math.log(targetClearSec / 1186.9);
}

function changeNumberToString(paraNumber){
    var tempNumber = Math.floor(paraNumber / 10000);
    if(tempNumber >= 10000){
        return Math.floor(tempNumber / 10000) + "억" + Math.floor(tempNumber % 10000) + "만";
    }
    else{
        return tempNumber + "만";
    }
}
