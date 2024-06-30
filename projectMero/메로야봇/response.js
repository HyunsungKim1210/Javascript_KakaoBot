class Party{
    static totalPartyNumber = 0;

    static #increaseTotalPartyNumber(){
        this.totalPartyNumber += 1;
    }

    static decreaseTotalPartyNumber(){
        this.totalPartyNumber -= 1;
    }

    #partyMember;
    #partyBishopNumber;
    #partyCombatStatus;
    #wasInPartyMember;
    #partyDays;
    #targetBossCombatStatus;
    
     constructor(bossCombatStatus){
        this.#partyMember = [];
        this.#partyBishopNumber = 0;
        this.#partyCombatStatus = 0;
        this.#wasInPartyMember = [];
        this.#partyDays = ["월","화","수","목","금","토","일"];
        this.#targetBossCombatStatus = bossCombatStatus;
        Party.#increaseTotalPartyNumber();
     }
     get partyMember() {
        let partyMemberString = "";
        for(let i=0;i<this.#partyMember.length;++i){
            partyMemberString += this.#partyMember[i].name;
            if(i != this.#partyMember.length-1){
                partyMemberString += ",";
            }
        }
        partyMemberString += " "+this.getPartyClearTimeString();
        return partyMemberString;
     }

     get partyBishopNumber() {
        return this.#partyBishopNumber;
     }

     get partyCombatStatus() {
        return this.#partyCombatStatus;
     }

     set partyMember(newPartyMember){//반드시 isPartyFull과 ableDaysInserted가 선행되고 실행해야함!!!
        this.#partyMember.push(newPartyMember);
        if(newPartyMember.job == "비숍"){
            this.#partyBishopNumber += 1;
            this.#partyCombatStatus += parseInt(newPartyMember.stat) * 1.2;
        }
        else if(newPartyMember.job == "불독"){
            this.#partyCombatStatus += parseInt(newPartyMember.stat) * 1.4;
        }
        else if(newPartyMember.job == "엔젤릭버스터"){
            this.#partyCombatStatus += parseInt(newPartyMember.stat) + 7000000;
        }
        else{
            this.#partyCombatStatus += parseInt(newPartyMember.stat);
        }
     }

     removePartyMember(partyMember){
        let partyMemberIndex = -1;
        for(let i=0;i<this.#partyMember.length;++i){
            if(this.#partyMember[i].name == partyMember.name){
                partyMemberIndex = i;
            }
        }
        if(partyMemberIndex == -1){
            return -1;
        }
        if(this.#partyMember[partyMemberIndex].job == "비숍"){
            this.#partyCombatStatus -= parseInt(this.#partyMember[partyMemberIndex].stat) *1.2;
            this.#partyBishopNumber -= 1;
        }
        else if(this.#partyMember[partyMemberIndex].job == "불독"){
            this.#partyCombatStatus -= parseInt(this.#partyMember[partyMemberIndex].stat) * 1.4;
        }
        else if(this.#partyMember[partyMemberIndex].job == "엔젤릭버스터"){
            this.#partyCombatStatus -= parseInt(this.#partyMember[partyMemberIndex].stat) + 7000000;
        }
        else{
            this.#partyCombatStatus -= parseInt(this.#partyMember[partyMemberIndex.stat]);
        }
        this.#wasInPartyMember.push(this.#partyMember[partyMemberIndex].name);
        this.#partyMember.splice(partyMemberIndex,1);
     }
     isPartyFull(){
        return (this.#partyMember.length >= 6);
     }
     ableDaysIfInserted(partyMember){
        let ableDaysCount = 0;
        let tempPartyMemberDays = [...partyMember.days];
        let tempPartyDays = [...this.#partyDays];
        for(let i=0;i<tempPartyMemberDays.length;++i){
            for(let j=0;j<tempPartyDays.length;++j){
                if(tempPartyMemberDays.days[i] == tempPartyDays[j]){
                    ableDaysCount += 1;
                    tempPartyDays.splice(j,1);
                    break;
                }
            }
        }
        return ableDaysCount;
     }
     wasPartyMemberIn(partyMember){
        for(let i=0;i<this.#wasInPartyMember.length;++i){
            if(partyMember.name == this.#wasInPartyMember[i]){
                return true;
            }
        }
        return false;
     }
     getCombatStatusDifference(){//이 return 값에 (-)를 붙인게 인원 보충의 시급함이라고 볼 수 있음. 보스의 전투력이 파티 전투력보다 클 수록 새 인원의 필요성이 절실하니까.
        return this.#partyCombatStatus - this.#targetBossCombatStatus;
     }
     getPartyClearTimeString(){
        let difference = this.getCombatStatusDifference();
        let clearSec = 0.0;
        if(this.#partyMember.length == 1){
            clearSec = getSoloThirtyMinuteClearTime(difference);
            return "("+Math.floor(clearSec / 60) + "분 " + Math.floor(clearSec % 60) + "초" + ")";
        }
        else{
            clearSec = getPartyThirtyMinuteClearTime(difference);
            if(this.#partyBishopNumber == 0){//여기에 카더스크여도 120초 정도 더 추가하면 됨. 당장은 확인할 방법은 없지만.
                clearSec += 120;
            }
            return "("+Math.floor(clearSec / 60) + "분 " + Math.floor(clearSec % 60) + "초" + ")";
        }
     }
     canGetIn(partyMember){
        if((!this.wasPartyMemberIn(partyMember)) && (!this.isPartyFull) && (this.ableDaysIfInserted(partyMember) >0)){
            return true;
        } 
        return false;
     }
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMultiChat) {
    if ((room == "자괴감" || isGroupChat == false) && msg[0] == "/") {
        let fileName = "spec.json";
        if (Database.exists(fileName)) {
            let spec = Database.readObject(fileName);
            if(msg.split("/메로야").length == 2){
                //목표 시간 받기 [메로야 하진힐 시간10분 -델우,별빛의미]
                let requiredSec = -1;
                if(msg.split("시간").length == 2){
                    let requiredTimeString = msg.split("시간")[1].split(" ")[0];
                    if(requiredTimeString == ""){//시간 10분
                        replier.reply("시간 양식 오류. [시간]과[목표시간] 사이 공백 있음");
                        return;
                    }
                    requiredSec = changeClearTimeStringToSec(requiredTimeString);
                    if(requiredSec == -1){
                        replier.reply("시간받기오류");
                        return;
                    }
                }
                //제외할 멤버 리스트 [메로야 하진힐 -델우,별빛의미] 이 부분은 msg의 맨 마지막에 있어야함!!!
                let excludedMembersName = [];
                if(msg.split("-").length == 2){
                    excludedMembersName = msg.split("-")[1].split(",");                    
                }
                excludedMembersName.push("레몬릴","델우","서가엔버","뿔보섯","o낭만비숍","무지개하마","전희");
                //보스 이름 받는다
                let bossIndex = -1;
                let bossName = msg.split(" ")[1];
                //파티 짤 때 고려할 멤버 리스트 생성
                let memberList = [];
                let isSkip = false;                
                if(msg.split("멤버").length == 2){//[메로야 하진힐 멤버온솔,무지개하마,그것이캡틴,초냥비숍]
                    let requiredMembers = msg.split("멤버")[1].split(" ")[0].split(",");
                    for (let i = 0; i < spec.member.length - 1; ++i) {
                        //제외할 멤버인지 확인
                        for(let j=0;j<excludedMembersName.length;++j){
                            if(spec.member[i].name == excludedMembersName[j]){
                                excludedMembersName.splice(j,1);
                                isSkip = true;
                                break;
                            }
                        }
                        if(isSkip){
                            isSkip = false;
                            continue;
                        }
                        //플레이 중인지 확인
                        if (spec.member[i].isPlaying == "false") {
                            continue;
                        }
                        //보스일 경우          
                        if(spec.member[i].job == "이위로"){
                            //보스를 찾고 있는지 확인
                            if(bossIndex == -1){
                                //찾는 보스인지 확인
                                if(spec.member[i].name == bossName){
                                    bossIndex = i;
                                }
                            }  
                            continue;
                        }            
                        //넣여야하는 멤버인지 확인 후 추가
                        for(let j=0; j<requiredMembers.length;++j){
                            if(spec.member[i].name == requiredMembers[j]){
                                memberList.push(spec.member[i]);
                                requiredMembers.splice(j,1);
                                break;
                            }
                        }

                        //넣어야하는 멤버 다 넣었고, 보스도 찾았다면 탈출
                        if((requiredMembers.length == 0) && (bossIndex != -1)){
                            break;
                        }
                    }
                    if(excludedMembersName.length != 0){
                        replier.reply("제외할 멤버 오류");
                        return;
                    }
                    if(requiredMembers.length != 0){
                        replier.reply("넣어야하는 멤버 오류");
                        return;
                    }
                    if(bossIndex == -1){
                        replier.reply("보스 찾기 오류");
                        return;
                    }
                }
                else{//[메로야 하진힐]
                    for(let i=0;i<spec.member.length -1;++i){
                        //제외할 멤버인지 확인
                        for(let j=0;j<excludedMembersName.length;++j){
                            if(spec.member[i].name == excludedMembersName[j]){
                                excludedMembersName.splice(j,1);
                                isSkip = true;
                                break;
                            }
                        }
                        if(isSkip){
                            isSkip = false;
                            continue;
                        }
                        //플레이 중인지 확인
                        if (spec.member[i].isPlaying == "false") {
                            continue;
                        }
                        //보스일 경우 
                        if(spec.member[i].job == "이위로"){
                            //보스를 찾고 있는지 확인
                            if(bossIndex == -1){
                                //찾는 보스인지 확인
                                if(spec.member[i].name == bossName){
                                    bossIndex = i;
                                }
                            }  
                            continue;
                        }
                        //멤버 리스트에 넣는다
                        memberList.push(spec.member[i]);                                                
                    }
                    if(excludedMembersName.length != 0){
                        replier.reply("제외할 멤버 오류");
                        return;
                    }
                    if(bossIndex == -1){
                        replier.reply("보스 찾기 오류");
                        return;
                    }
                }
                //멤버 리스트 전투력 기준 정렬
                memberList.sort((a, b) => b.stat - a.stat);                
                //전투력 미달(빨콩) 배제; 보스 전투력의 25퍼 이하면 빨콩을 피할 수 없다고 가정
                let criteria = spec.member[bossIndex].stat / 4;
                let criteriaIndex = -1;
                for(let i=memberList.length -1;i>-1;--i){//가장 작은 전투력부터 올라간다
                    if(memberList[i].stat > criteria){
                        criteriaIndex = i +1;
                        break;
                    }
                }
                if(criteriaIndex < memberList.length){
                    memberList.splice(criteriaIndex);
                }
                //멤버 리스트 가능 요일 수 기준 정렬
                memberList.sort((a,b) => a.days.length - b.days.length);//0에 가까울수록 가능한 요일이 적다.
                //비숍 인덱스 확보
                let bishopIndexList = [];
                for(let i=0;i<memberList.length;++i){
                    if(memberList[i].job == "비숍"){
                        bishopIndexList.push(i);
                    }
                }//마찬가지로 0에 가까울수록 가능한 요일이 적을 것.                
                //파티 짜기;파티에 비숍이 없으면 clearSec가 2분 정도 증가.
                let minPartyNumber = Math.ceil(memberList.length / 6);
                let reply = "오차 1극딜\n";
                if(requiredSec == -1){//요구시간 없음
                    for(let i=minPartyNumber;i<memberList.length;i++){
                        let partyCombinationString = computePartyCombination();
                        if(partyCombinationString == "fail"){
                            break;
                        }
                        //조합 문자열이 나옴
                        reply += partyCombinationString;
                    }
                    if(reply == "오차 1극딜\n"){//나중에는 멤버 한 명씩 빼가며 다시 시도해보게 만들어야함.
                        replier.reply("조합을 찾을 수 없습니다");
                        return;
                    }
                    replier.reply(reply);
                    return;                    
                }
                else{//요구시간 있음
                    for(let i=minPartyNumber;i<memberList.length;i++){
                        let partyCombinationString = computePartyCombination();
                        if(partyCombinationString == "fail"){
                            break;
                        }
                        //조합 문자열이 나옴
                        let firstSeparation = partyCombinationString.split("{");
                        let isCombinationOk = true;
                        //{n}기준으로 1차로 나눔. 앞의 ""는 스킵.
                        for(let j=1;j<firstSeparation.length;++j){
                            //". " 기준으로 2차로 나눔
                            let secondSeparation = firstSeparation[j].split(". ");
                            //앞의 "n}\n1"을 스킵
                            for(let k=1;k<secondSeparation.length;++k){
                                //()안의 걸 저장
                                let clearTimeString = secondSeparation[k].split("(")[1].split(")")[0];
                                let partyClearTimeSec = changeClearTimeStringToSec(clearTimeString);
                                let isTimeOk = ((requiredSec - 180)<= partyClearTimeSec) && (partyClearTimeSec <= (requiredSec + 180));
                                if(!isTimeOk){
                                    isCombinationOk = false;
                                    break;
                                }
                            }
                            if(isCombinationOk){
                                reply += "{" + firstSeparation[j];
                            }
                        }
                    }
                    if(reply == "오차 1극딜\n"){//나중에는 멤버 한 명씩 빼가며 다시 시도해보게 만들어야함.
                        replier.reply("조합을 찾을 수 없습니다");
                        return;
                    } 
                    replier.reply(reply);
                    return;
                }
            } 
        }        
    }
}



function changeClearTimeStringToSec(clearTimeString){
    let clearSec = 0;
    let minSplice = clearTimeString.split("분");
    //XX분 받는다
    if(minSplice.length == 2){
        clearSec += parseInt(minSplice[0])*60;
    }
    //XX초 받는다
    let secSplice = clearTimeString.split("초");
    if(secSplice.length == 2){
        let minSpliceAfterSecSplice = secSplice[0].split("분");
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

function getSoloAbleCombatStatusDifference(targetClearSec){//결과는 만 단위
    return Math.exp((targetClearSec-3451.2) / (-347))-116.5711063;
}

function getPartyAbleCombatStatusDifference(targetClearSec){//결과는 만 단위
    return -1*Math.pow(10,4)*Math.log(targetClearSec / 1186.9);
}

function getSoloThirtyMinuteClearTime(combatStatusDifference){
    return -347*Math.log(combatStatusDifference + 116.5711063)+3451.2;
}

function getPartyThirtyMinuteClearTime(combatStatusDifference){
    return 1186.9*Math.exp(-1*Math.pow(10,-4)*combatStatusDifference);
}
function computePartyCombination(partyNumber,bossCombatStatus,memberList,bishopIndexList){//파티가 강할수록 가능한 요일이 적은게 맞다. 즉, 시간이 적은 멤버가 강한 파티에 들어가는 방식으로 간다. 이때 똑같이 강한 파티가 복수라면 가능한 요일이 많아지는 쪽으로 들어간다.
    let combinationString = "";
    let successCount = 0;
    //파티 리스트 선언
    let partyList = [];
    for(let i=0;i<partyNumber;++i){
        partyList.push(new Party(bossCombatStatus));
    }
    let insertedMemberIndexStack = [];
    for(let i=0;i<bishopIndexList.length;++i){
        let partyIndex = chooseInitialBishopWhichPartyToGoIn(partyList);
        if(partyIndex == -1){
            insertedMemberIndexStack.push(-1);
            break;
        }
        partyList[partyIndex].partyMember(bishopIndexList[i]);
        insertedMemberIndexStack.push(i);
    }
    //모든 파티에 비숍 분배 완료 혹은 비숍 먼저 소진됨.
    //이제 나머지 배분
    let previousPartyIndex = -1;
    for(let i=0;i<memberList.length;++i){
        //비숍일 경우 이미 파티에 들어가 있는지 확인
        if(memberList[i].job == "비숍"){
            let amI_IN = false;
            for(let j=0;j<insertedMemberIndexStack.length;++j){
                if(insertedMemberIndexStack[j] == i){
                    amI_IN = true;
                    break;
                }
            }
            if(amI_IN){
                continue;
            }
        }
        //멤버를 파티에 넣는다
        let partyIndex = chooseWhichPartyToGoIn(partyList,memberList[i]);
        if(partyIndex == -1){//어디에도 들어갈 수 없음
            if(insertedMemberIndexStack[insertedMemberIndexStack.length-1] != -1){
                partyIndex[previousPartyIndex].removePartyMember(memberList[i-1]);
                insertedMemberIndexStack.pop();
                i= i-2;
                continue;
            }
            else{
                return "fail";
            }
        }
        partyList[partyIndex].partyMember(memberList[i]);
        previousPartyIndex = partyIndex;
        insertedMemberIndexStack.push(i);
        if(i == memberList.length -1){//모두 배분 성공
            successCount += 1;
            combinationString += "{" + successCount+"}\n";
            for(let j=0; j<partyIndex.length;++j){
                combinationString += (j+1)+". "+partyIndex[j].partyMember+"\n";
            }
            //아웃풋 예시
            //{1}
            //1. 여우새,불말자 (9분30초)
            //2. 그것이캡틴,무지개하마 (5분30초)
            //{2}
            //1. 불말자,그것이캡틴 (4분50초)
            //2. 그것이캡틴,여우새 (10분1초)
        }
    }
    return combinationString;
}

function chooseWhichPartyToGoIn(partyList,partyMember){
    let choicesIndexList = [];
    for(let i=0;i<partyList.length;++i){
        if(partyList[i].canGetIn(partyMember)){
            choicesIndexList.push(i);
        }
    }
    if(choicesIndexList.length == 0){
        return -1;
    }
    if(choicesIndexList.length == 1){
        return choicesIndexList[0];
    }
    let choiceIndex = -1;
    for(let i=0;i<choicesIndexList.length-1;++i){
        //강한 파티 찾아 들어간다
        if(partyList[choicesIndexList[i]].getCombatStatusDifference() > partyList[choicesIndexList[i+1]].getCombatStatusDifference()){
            choiceIndex = i;
        }
        else if(partyList[choicesIndexList[i]].getCombatStatusDifference() < partyList[choicesIndexList[i+1]].getCombatStatusDifference()){
            choiceIndex = i+1;
        }
        else{//강한 파티가 복수라면 요일 많아지는 파티로 들어간다
            if(partyList[choicesIndexList[i]].ableDaysCount() >= partyList[choicesIndexList[i+1]].ableDaysCount()){
                choiceIndex = i;
            }
            else{
                choiceIndex = i+1;
            }
        }
    }
    return choiceIndex;    
}

function chooseInitialBishopWhichPartyToGoIn(partyList){
    let choicesIndexList = [];
    for(let i=0;i<partyList.length;++i){
        if(partyList[i].partyBishopNumber == 0){
            choicesIndexList.push(i);
        }
    }
    if(choicesIndexList.length == 0){
        return -1;
    }
    return choicesIndexList[0];    
}
