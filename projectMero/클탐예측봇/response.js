function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMultiChat) {
    if ((room == "자괴감" || isGroupChat == false) && msg[0] == "/") {
        var fileName = "spec.json";
        if (Database.exists(fileName)) {
            var spec = Database.readObject(fileName);
            if(msg.split("/예측").length == 2){
                var list = [];
                for (var i = 0; i < spec.member.length - 1; ++i) {
                    if (spec.member[i].isPlaying){
                        list.push(spec.member[i]);
                    }
                }

                //보스 이름 받는다
                var bossIndex = -1;
                if(msg.split(" ").length == 3){
                    var bossName = msg.split(" ")[1];
                    for(var i=0; i<list.length; ++i){
                        if(list[i].job != "이위로"){
                            continue;
                        }
                        var keywords = list[i].keyword;
                        for(var j = 0; j<keywords.length; ++j){
                            if(keywords[j] == bossName){
                                bossIndex = i;
                                break;
                            }
                        }
                    }
                    if(bossIndex == -1){
                        replier.reply("보스 이름을 찾을 수 없습니다.");
                        return;
                    }
                }
                else{
                    var errorReply = "입력 오류.\n[예측][][보스이름][][파티 멤버 이름(,)]\n로 적어주세요.";
                    replier.reply(errorReply);
                    return;
                }
                var reply = "예상 ";
                reply += list[bossIndex].name;
                reply += " 클리어 시간은\n";
                //파티 전투력 받는다
                var partyMemberList = [];
                var partyCombatStatus = 0;
                var printCombatStatus = "(파티 구성원 전투력: ";
                var isParty = false;
                if(msg.split(" ")[2].split(",").length <= 1){//파티 멤버 한 명
                    for(var i = 0; i<list.length;++i){
                        var keywords = list[i].keyword;
                        for(var j=0; j<keywords.length;++j){
                            if(keywords[j] == msg.split(" ")[2]){
                                partyMemberList.push(list[i]);
                                if(list[i].job == "불독"){
                                    partyCombatStatus += parseInt(list[i].stat) * 1.4;
                                    printCombatStatus += changeNumberToString(list[i].stat * 1.4);
                                }
                                else if(list[i].job == "비숍"){
                                    partyCombatStatus += parseInt(list[i].stat) * 1.2;
                                    printCombatStatus += changeNumberToString(list[i].stat * 1.2);
                                }
                                else if(list[i].job == "엔젤릭버스터"){
                                    partyCombatStatus += parseInt(list[i].stat) + 7000000;
                                    printCombatStatus += changeNumberToString(parseInt(list[i].stat + 7000000));
                                }
                                else{
                                    partyCombatStatus += parseInt(list[i].stat);
                                    printCombatStatus += changeNumberToString(list[i].stat);
                                }
                                break;
                            }
                        }
                    }
                    if(partyCombatStatus == 0){
                        var tempCombatStatus = changeStringToNumber(msg.split(" ")[2]);
                        if(tempCombatStatus == NaN){
                            replier.reply("파티 멤버를 찾을 수 없습니다.");
                            return;
                        }
                        //숫자 전투력일 경우
                        else{
                            partyCombatStatus += tempCombatStatus;
                            printCombatStatus += changeNumberToString(tempCombatStatus);
                        }
                    }
                    isParty = false;
                }
                else{//파티 멤버 다수
                    for(var partyMemberNumber =0; partyMemberNumber<msg.split(" ")[2].split(",").length;++partyMemberNumber){
                        var previousPartyCombatStatus = partyCombatStatus;
                        for(var i=0; i<list.length;++i){
                            var keywords = list[i].keyword;
                            for(var j=0;j<keywords.length;++j){
                                if(msg.split(" ")[2].split(",")[partyMemberNumber] == keywords[j]){
                                    partyMemberList.push(list[i]);
                                    if(list[i].job == "불독"){
                                        partyCombatStatus += parseInt(list[i].stat) * 1.4;
                                        printCombatStatus += changeNumberToString(parseInt(list[i].stat) * 1.4);
                                    }
                                    else if(list[i].job == "비숍"){
                                        partyCombatStatus += parseInt(list[i].stat) * 1.2;
                                        printCombatStatus += changeNumberToString(parseInt(list[i].stat) * 1.2);
                                    }
                                    else if(list[i].job == "엔젤릭버스터"){
                                        partyCombatStatus += parseInt(list[i].stat) + 7000000;
                                        printCombatStatus += changeNumberToString(parseInt(list[i].stat)+7000000);
                                    }
                                    else{
                                        partyCombatStatus += parseInt(list[i].stat);
                                        printCombatStatus += changeNumberToString(parseInt(list[i].stat));
                                    }
                                    break;
                                }
                            }
                        }

                        if(previousPartyCombatStatus == partyCombatStatus){
                            var tempCombatStatus = changeStringToNumber(msg.split(" ")[2].split(",")[partyMemberNumber]);
                            if(tempCombatStatus == NaN){
                                var memberFindError = "파티 멤버를 찾을 수 없습니다. 오류 파티원 이름:\n";
                                memberFindError += msg.split(" ")[2].split(",")[partyMemberNumber];
                                replier.reply(memberFindError);
                                return;
                            }
                            //숫자 전투력일 경우
                            else{
                                partyCombatStatus += tempCombatStatus;
                                printCombatStatus += changeNumberToString(tempCombatStatus);
                            }
                        }
                        if(partyMemberNumber != msg.split(" ")[2].split(",").length-1){
                            printCombatStatus += "+";
                        }
                    }
                    isParty = true;
                }
                printCombatStatus += "\n파티 전투력은: " + changeNumberToString(partyCombatStatus) + ")\n";
                reply += printCombatStatus;
                //예상시간 산출
                if(partyCombatStatus < list[bossIndex].stat){
                    replier.reply("깰 수 없습니다.");
                    return;
                }
                var magnification = 0.0;
                var difference = (partyCombatStatus - list[bossIndex].stat)/10000;
                magnification = partyCombatStatus / list[bossIndex].stat;
                var clearSec = 0;
                if(list[bossIndex].name != "하검마"){
                    if(isParty){
                        clearSec = getPartyThirtyMinuteClearTime(difference);
                    }
                    else{
                        clearSec = getSoloThirtyMinuteClearTime(difference);
                    }

                }
                else{
                    if(difference >= 7500000){
                        clearSec = 3600 / (magnification*magnification*(1-(difference/2)/100000000));
                    }
                    else{
                        clearSec = 3600 / (magnification*magnification*(1+(difference/2)/100000000));
                    }
                }
                //예상시간 출력
                reply += Math.floor(clearSec / 60) + "분 " + Math.floor(clearSec % 60) + "초 입니다(오차 1 극딜)";
                replier.reply(reply);
            }
        }
    }
}

function changeStringToNumber(paraString){
    var tempString = paraString;
    if(tempString.split("억").length > 1){
        tempString = tempString.split("억")[0] + tempString.split("억")[1];
    }
    return parseInt(tempString) * 10000;
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

function getSoloThirtyMinuteClearTime(combatStatusDifference){
    return -347*Math.log(combatStatusDifference + 116.5711063)+3451.2;
}

function getPartyThirtyMinuteClearTime(combatStatusDifference){
    return 1186.9*Math.exp(-1*Math.pow(10,-4)*combatStatusDifference);
}


