function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, isMultiChat) {
    if ((room == "자괴감" || isGroupChat == false) && msg[0] == "/") {
Log.i("start",false);
      var fileName = "spec.json";
      if (Database.exists(fileName)) {
        var spec = Database.readObject(fileName);
        if (msg.split("/메로야").length == 2) {
          // 목표 시간 받기 [메로야 하진힐 시간10분 -델우,별빛의미]
          var requiredSec = -1;
          if (msg.split("시간").length == 2) {
            var requiredTimeString = msg.split("시간")[1].split(" ")[0];
            if (requiredTimeString == "") { // 시간 10분
              replier.reply("시간 양식 오류. [시간]과[목표시간] 사이 공백 있음");
              return;
            }
            requiredSec = changeClearTimeStringToSec(requiredTimeString);
            if (requiredSec == -1) {
              replier.reply("시간받기오류");
              return;
            }
          }
          // 제외할 멤버 리스트 [메로야 하진힐 -델우,별빛의미] 이 부분은 msg의 맨 마지막에 있어야함!!!
          var excludedMembersName = [];
          if (msg.split("-").length == 2) {
            excludedMembersName = msg.split("-")[1].split(",");
          }
          excludedMembersName.push("레몬릴", "델우", "서가엔버", "뿔보섯", "o낭만비숍", "무지개하마", "전희");
          // 보스 이름 받는다
          var bossIndex = -1;
          var bossName = msg.split(" ")[1];
          // 파티 짤 때 고려할 멤버 리스트 생성
          var memberList = [];
          var isSkip = false;
          if (msg.split("멤버").length == 2) { // [메로야 하진힐 멤버온솔,무지개하마,그것이캡틴,초냥비숍]
            var requiredMembers = msg.split("멤버")[1].split(" ")[0].split(",");
            for (var i = 0; i < spec.member.length - 1; ++i) {
              // 제외할 멤버인지 확인
              for (var j = 0; j < excludedMembersName.length; ++j) {
                if (spec.member[i].name == excludedMembersName[j]) {
                  excludedMembersName.splice(j, 1);
                  isSkip = true;
                  break;
                }
              }
              if (isSkip) {
                isSkip = false;
                continue;
              }
              // 플레이 중인지 확인
              if (spec.member[i].isPlaying == "false") {
                continue;
              }
              // 보스일 경우          
              if (spec.member[i].job == "이위로") {
                // 보스를 찾고 있는지 확인
                if (bossIndex == -1) {
                  // 찾는 보스인지 확인
                  if (spec.member[i].name == bossName) {
                    bossIndex = i;
                  }
                }
                continue;
              }
              // 넣여야하는 멤버인지 확인 후 추가
              for (var j = 0; j < requiredMembers.length; ++j) {
                if (spec.member[i].name == requiredMembers[j]) {
                  memberList.push(spec.member[i]);
                  requiredMembers.splice(j, 1);
                  break;
                }
              }
  
              // 넣어야하는 멤버 다 넣었고, 보스도 찾았다면 탈출
              if ((requiredMembers.length == 0) && (bossIndex != -1)) {
                break;
              }
            }
            if (excludedMembersName.length != 0) {
              replier.reply("제외할 멤버 오류");
              return;
            }
            if (requiredMembers.length != 0) {
              replier.reply("넣어야하는 멤버 오류");
              return;
            }
            if (bossIndex == -1) {
              replier.reply("보스 찾기 오류");
              return;
            }
          } else { // [메로야 하진힐]
            for (var i = 0; i < spec.member.length - 1; ++i) {
              // 제외할 멤버인지 확인
              for (var j = 0; j < excludedMembersName.length; ++j) {
                if (spec.member[i].name == excludedMembersName[j]) {
                  excludedMembersName.splice(j, 1);
                  isSkip = true;
                  break;
                }
              }
              if (isSkip) {
                isSkip = false;
                continue;
              }
              // 플레이 중인지 확인
              if (spec.member[i].isPlaying == "false") {
                continue;
              }
              // 보스일 경우 
              if (spec.member[i].job == "이위로") {
                // 보스를 찾고 있는지 확인
                if (bossIndex == -1) {
                  // 찾는 보스인지 확인
                  if (spec.member[i].name == bossName) {
                    bossIndex = i;
                  }
                }
                continue;
              }
              // 멤버 리스트에 넣는다
              memberList.push(spec.member[i]);
            }
            if (excludedMembersName.length != 0) {
              replier.reply("제외할 멤버 오류");
              return;
            }
            if (bossIndex == -1) {
              replier.reply("보스 찾기 오류");
              return;
            }
          }
          // 멤버 리스트 전투력 기준 정렬
          memberList.sort(function (a, b) {
            return b.stat - a.stat;
          });
          // 전투력 미달(빨콩) 배제; 보스 전투력의 25퍼 이하면 빨콩을 피할 수 없다고 가정
          var criteria = spec.member[bossIndex].stat / 4;
          var criteriaIndex = -1;
          for (var i = memberList.length - 1; i > -1; --i) { // 가장 작은 전투력부터 올라간다
            if (memberList[i].stat > criteria) {
              criteriaIndex = i + 1;
              break;
            }
          }
          if (criteriaIndex < memberList.length) {
            memberList.splice(criteriaIndex);
          }
          // 멤버 리스트 가능 요일 수 기준 정렬
          memberList.sort(function (a, b) {
            return a.days.length - b.days.length;
          }); // 0에 가까울수록 가능한 요일이 적다.
          //가능한 요일이 없는 사람 제외
          var busyMemberList = [];
          var minimumNonBusyMemberIndex = -1;
          var busyMemberString = "";
          for(var i=0;i<memberList.length;++i){
            if(memberList[i].days.length > 0){
              minimumNonBusyMemberIndex = i;
              break;
            }
          }
          if(minimumNonBusyMemberIndex === -1){
            replier.reply("보스 갈 시간이 있는 멤버가 없습니다.");
            return;
          }
          if(minimumNonBusyMemberIndex > 0){
            busyMemberList = memberList.splice(0,minimumNonBusyMemberIndex);
            busyMemberString += busyMemberList.map(member => member.name).join(",") + "은 보스 갈 시간이 없습니다\n";
          }
          // 비숍 인덱스 확보
          var bishopIndexList = [];
          for (var i = 0; i < memberList.length; ++i) {
            if (memberList[i].job == "비숍") {
              bishopIndexList.push(i);
            }
          } // 마찬가지로 0에 가까울수록 가능한 요일이 적을 것.                
          // 파티 짜기;파티에 비숍이 없으면 clearSec가 2분 정도 증가.
          var minPartyNumber = Math.ceil(memberList.length / 6);
          var reply = "오차 1극딜\n";
          if (requiredSec == -1) { // 요구시간 없음
            for (var i = memberList.length; i <= memberList.length; ++i) {//파티수 최대로 할때 어차피 모든 경우의 수가 다 나옴.
              Log.i("compute start"+i,false);
              var partyCombinationString ="";
               partyCombinationString = computePartyCombination(i,spec.member[bossIndex].stat,memberList,bishopIndexList);
              if (partyCombinationString == "\n") {
                break;
              }
              // 조합 문자열이 나옴
              reply += removeOverlappedCases(partyCombinationString);
            }
            if (reply == "오차 1극딜\n") { // 나중에는 멤버 한 명씩 빼가며 다시 시도해보게 만들어야함.
              replier.reply("조합을 찾을 수 없습니다");
              return;
            }
            replier.reply(busyMemberString+reply);
            return;
          } else { // 요구시간 있음
            for (var i = minPartyNumber; i <= memberList.length; ++i) {
              var partyCombinationString = computePartyCombination(i,spec.member[bossIndex].stat,memberList,bishopIndexList);
              if (partyCombinationString == "\n") {
                break;
              }
              // 조합 문자열이 나옴
              var firstSeparation = partyCombinationString.split("{");
              var isCombinationOk = true;
              // {n}기준으로 1차로 나눔. 앞의 ""는 스킵.
              for (var j = 1; j < firstSeparation.length; ++j) {
                // ". " 기준으로 2차로 나눔
                var secondSeparation = firstSeparation[j].split(". ");
                // 앞의 "n}\n1"을 스킵
                for (var k = 1; k < secondSeparation.length; ++k) {
                  // ()안의 걸 저장
                  var clearTimeString = secondSeparation[k].split("(")[1].split(")")[0];
                  var partyClearTimeSec = changeClearTimeStringToSec(clearTimeString);
                  var isTimeOk = ((requiredSec - 180) <= partyClearTimeSec) && (partyClearTimeSec <= (requiredSec + 180));
                  if (!isTimeOk) {
                    isCombinationOk = false;
                    break;
                  }
                }
                if (isCombinationOk) {
                  reply += "{" + firstSeparation[j];
                }
              }
            }
            if (reply == "오차 1극딜\n") { // 나중에는 멤버 한 명씩 빼가며 다시 시도해보게 만들어야함.
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
  
  
function Party(bossCombatStatus) {
    this.partyMember = [];
    this.partyBishopNumber = 0;
    this.partyCombatStatus = 0;
    this.wasInPartyMember = [];
    this.partyDays = ["월", "화", "수", "목", "금", "토", "일"];
    this.targetBossCombatStatus = bossCombatStatus;
  
    Party.increaseTotalPartyNumber();
  }
  
  Party.totalPartyNumber = 0;
  
  Party.increaseTotalPartyNumber = function () {
    this.totalPartyNumber += 1;
  };
  
  Party.decreaseTotalPartyNumber = function () {
    this.totalPartyNumber -= 1;
  };
  
  Party.prototype.insertPartyMember = function (newPartyMember) {
   var leftFreeMemory5 = java.lang.Runtime.getRuntime().freeMemory();
   this.partyMember.push(newPartyMember);
    
    switch (newPartyMember.job) {
        case "비숍":
            this.partyBishopNumber += 1;
            this.partyCombatStatus += parseInt(newPartyMember.stat) * 1.2;
            break;
        case "불독":
            this.partyCombatStatus += parseInt(newPartyMember.stat) * 1.4;
            break;
        case "엔젤릭버스터":
            this.partyCombatStatus += parseInt(newPartyMember.stat) + 7000000;
            break;
        default:
            this.partyCombatStatus += parseInt(newPartyMember.stat);
    }

    this.partyDays = this.getNewDaysList(newPartyMember);
};

  Party.prototype.getPartyClearTimeString = function () {
    var difference = this.getCombatStatusDifference() / 10000;
    var clearSec = 0.0;

    if (this.partyMember.length == 1) {
        clearSec = getSoloThirtyMinuteClearTime(difference);
    } else {
        clearSec = getPartyThirtyMinuteClearTime(difference);

        if (this.partyBishopNumber == 0) {
            clearSec += 120;
        }
    }

    var minutes = Math.floor(clearSec / 60);
    var seconds = Math.floor(clearSec % 60);

    return "(" + minutes + "분 " + seconds + "초" + ")";
};
  
  Party.prototype.getCombatStatusDifference = function () {
    return this.partyCombatStatus - this.targetBossCombatStatus;
  };
  
  Party.prototype.isPartyFull = function () {
    return this.partyMember.length >= 6;
  };
  
  Party.prototype.ableDaysIfInserted = function (partyMember) {
    var ableDaysCount = 0;
    
    for (var i = 0; i < partyMember.days.length; ++i) {
        if (this.partyDays.includes(partyMember.days[i])) {
            ableDaysCount += 1;
        }
    }

    return ableDaysCount;
};

Party.prototype.getNewDaysList = function (partyMember) {
  var newDaysList = [];

  for (var i = 0; i < partyMember.days.length; ++i) {
      if (this.partyDays.includes(partyMember.days[i])) {
          newDaysList.push(partyMember.days[i]);
      }
  }

  return newDaysList;
};

Party.prototype.getCurrentDaysList = function () {
    if(this.partyMember.length <1){
        return ["월","화","수","목","금","토","일"];
 }   
    var newDaysList = this.partyMember[0].days;
    for(var i=0;i<this.partyMember.length-1;++i){
        newDaysList = getOverlappedDaysList(newDaysList,this.partyMember[i+1].days);
 }
    return newDaysList;
};

Party.prototype.printCurrentDaysList = function() {
  var printString = this.partyDays.map(day => day).join(",");
  return "["+printString+"]";  
}
  
  Party.prototype.wasPartyMemberIn = function (partyMember) {
    for (var i = 0; i < this.wasInPartyMember.length; ++i) {
      if (partyMember.name == this.wasInPartyMember[i]) {
//Log.i(true,false);
        return true;
      }
    }
//Log.i(false,false);
    return false;
  };
  
  Party.prototype.removePartyMember = function (partyMember) {
"use strict";
    var partyMemberIndex = -1;
  
    for (var i = 0; i < this.partyMember.length; ++i) {
      if (this.partyMember[i].name == partyMember.name) {
        partyMemberIndex = i;
        break;
      }
    }
  
    if (partyMemberIndex == -1) {
Log.i("리무브 인덱스 못 찾음",false);
      return -1;
    }
  
    if (this.partyMember[partyMemberIndex].job == "비숍") {
      this.partyCombatStatus -= parseInt(this.partyMember[partyMemberIndex].stat) * 1.2;
      this.partyBishopNumber -= 1;
    } else if (this.partyMember[partyMemberIndex].job == "불독") {
      this.partyCombatStatus -= parseInt(this.partyMember[partyMemberIndex].stat) * 1.4;
    } else if (this.partyMember[partyMemberIndex].job == "엔젤릭버스터") {
      this.partyCombatStatus -= parseInt(this.partyMember[partyMemberIndex].stat) + 7000000;
    } else {
      this.partyCombatStatus -= parseInt(this.partyMember[partyMemberIndex].stat);
    }
  
    this.wasInPartyMember.push(partyMember.name);
//Log.i(this.wasInPartyMember[this.wasInPartyMember.length-1],false);
    this.partyMember.splice(partyMemberIndex, 1);

    this.partyDays = this.getCurrentDaysList();

  };
  
  Party.prototype.canGetIn = function (partyMember) {
    if (!this.wasPartyMemberIn(partyMember) && !this.isPartyFull() && this.ableDaysIfInserted(partyMember) > 0) {
      return true;
    }
    return false;
  };

  Party.prototype.printPartyMember = function () {
    var printString = this.partyMember.map(member => member.name).join(",");
    if (printString !== "") {
        printString += " " + this.printCurrentDaysList();
        printString += " " + this.getPartyClearTimeString();
    }
    return printString;
};

  Party.prototype.eraseMemberName = function (partyMember) {
    var nameIndex = this.wasInPartyMember.indexOf(partyMember.name);//못찾으면 -1이 들어감
   if(nameIndex == -1){
return;
} this.wasInPartyMember.splice(nameIndex,1);
  };

  


  function changeClearTimeStringToSec(clearTimeString) {
    var clearSec = 0;
  
    var minSplice = clearTimeString.split("분");
    // XX분 받는다
    if (minSplice.length == 2) {
      clearSec += parseInt(minSplice[0]) * 60;
    }
  
    // XX초 받는다
    var secSplice = clearTimeString.split("초");
    if (secSplice.length == 2) {
      var minSpliceAfterSecSplice = secSplice[0].split("분");
      // XX분XX초일 경우
      if (minSpliceAfterSecSplice.length == 2) {
        clearSec += parseInt(minSpliceAfterSecSplice[1]);
      }
      // XX초일 경우
      else {
        clearSec += parseInt(minSpliceAfterSecSplice[0]);
      }
    }
  
    if (clearSec != 0) {
      return clearSec;
    } else {
      return -1;
    }
  }
  
  function getSoloAbleCombatStatusDifference(targetClearSec) {
    // 결과는 만 단위
    return Math.exp((targetClearSec - 3451.2) / (-347)) - 116.5711063;
  }
  
  function getPartyAbleCombatStatusDifference(targetClearSec) {
    // 결과는 만 단위
    return -1 * Math.pow(10, 4) * Math.log(targetClearSec / 1186.9);
  }
  
  function getSoloThirtyMinuteClearTime(combatStatusDifference) {
    return -347 * Math.log(combatStatusDifference + 116.5711063) + 3451.2;
  }
  
  function getPartyThirtyMinuteClearTime(combatStatusDifference) {
    return 1186.9 * Math.exp(-1 * Math.pow(10, -4) * combatStatusDifference);
  }
  
  
  function  computePartyCombination(partyNumber, bossCombatStatus, memberList, bishopIndexList) {

    var combinationString = "";
    var successCount = 0;
    var endlessLoop = 0;
    var middleCount = 0;
    var finalCount = 0;
  
    // 파티 리스트 선언
    Log.i("파티 리스트 선언",false);
    var partyList = [];
    for (var i = 0; i < partyNumber; ++i) {
      partyList.push(new Party(bossCombatStatus));
    }
    var insertedMemberIndexStack = [];
 //비숍 넣는다
    Log.i("비숍 넣는다",false);
   for (var i = 0; i < bishopIndexList.length; ++i) {

      var partyIndex = chooseInitialBishopWhichPartyToGoIn(partyList);
      if (partyIndex === -1) {
        insertedMemberIndexStack.push([-1,-1]);
        break;//다음 조합을 찾는다.
      }
      partyList[partyIndex].insertPartyMember(memberList[bishopIndexList[i]]);
      insertedMemberIndexStack.push([bishopIndexList[i],partyIndex]);
    }
  
    // 모든 파티에 비숍 분배 완료 혹은 비숍 먼저 소진됨.
    // 이제 나머지 배분
    Log.i("이제 나머지 배분",false);
    for (var i = 0; i < memberList.length; ++i) {
endlessLoop +=1;
//if(endlessLoop > 100){
//Log.i("무한루프",false);
//return "무한루프";}
      // 비숍일 경우 이미 파티에 들어가 있는지 확인
      if (memberList[i].job === "비숍") {
        var am_I_In = false;
        for (var j = 0; j < insertedMemberIndexStack.length; ++j) {
          if (insertedMemberIndexStack[j][0] === i) {
            am_I_In = true;
            break;
          }
        }
        if (am_I_In) {
          continue;
        }
      }
 
        // 멤버를 파티에 넣는다
        Log.i("멤버를 파티에 넣는다",false);
        var partyIndex = chooseWhichPartyToGoIn(partyList, memberList[i]);
//Log.i(i+"는 "+partyIndex+"로",false);
        // 어디에도 들어갈 수 없음
        if (partyIndex == -1) {

            if ((insertedMemberIndexStack.length >0)&&(insertedMemberIndexStack[insertedMemberIndexStack.length - 1][0] != -1)) {
middleCount +=1;
//Log.i("중간 "+middleCount,false);
//Log.i(insertedMemberIndexStack[insertedMemberIndexStack.length-1][0]+" "+insertedMemberIndexStack[insertedMemberIndexStack.length-1][1],false);


        partyList[insertedMemberIndexStack[insertedMemberIndexStack.length-1][1]].removePartyMember(memberList[insertedMemberIndexStack[insertedMemberIndexStack.length-1][0]]);

                for(var j=0;j<partyList.length;++j){
                    partyList[j].eraseMemberName(memberList[i]);
                }
                insertedMemberIndexStack.pop();
                i = i - 2;
                continue;
            }
            else {
                combinationString += "\n";
                return combinationString;
            }
        }

 partyList[partyIndex].insertPartyMember(memberList[i]);

 insertedMemberIndexStack.push([i,partyIndex]);
  
      if (i == memberList.length - 1) {
finalCount +=1;
Log.i("마지막 "+finalCount,false);
//Log.i(insertedMemberIndexStack[insertedMemberIndexStack.length-1][0]+" "+insertedMemberIndexStack[insertedMemberIndexStack.length-1][1],false);
//combinationString += "k";
        // 모두 배분 성공
        successCount += 1;
//Log.i("성공횟수 "+successCount,false);
        combinationString += "{" + successCount + "}\n";
        var nonEmptyPartyNumber = 1;
       for (var j = 0; j < partyList.length; ++j) {
          if(partyList[j].printPartyMember() === ""){
           continue;
         }
         combinationString += nonEmptyPartyNumber + ". " + partyList[j].printPartyMember() + "\n";
          nonEmptyPartyNumber += 1;
       }
//return combinationString;이러면 됨.
        // 아웃풋 예시
        // {1}
        // 1. 여우새,불말자 [월,화](9분30초)
        // 2. 그것이캡틴,무지개하마 [수,목](5분30초)
        // {2}
        // 1. 불말자,그것이캡틴 [금,토](4분50초)
        // 2. 그것이캡틴,여우새 [월,일](10분1초)
        //다음 조합을 찾는다

 partyList[insertedMemberIndexStack[insertedMemberIndexStack.length-1][1]].removePartyMember(memberList[insertedMemberIndexStack[insertedMemberIndexStack.length-1][0]]);

    insertedMemberIndexStack.pop();
        i -= 1;

        continue;

      }    
    }
    return combinationString;
  }
  
  function chooseWhichPartyToGoIn(partyList, partyMember) {
    var choicesIndexList = [];
    for (var i = 0; i < partyList.length; ++i) {
      if (partyList[i].canGetIn(partyMember)) {
//Log.i("파티인덱스 "+i,false);
        choicesIndexList.push(i);
      }
    }
  
    if (choicesIndexList.length == 0) {
      return -1;
    }
  
    if (choicesIndexList.length == 1) {
      return choicesIndexList[0];
    }
  
    var choiceIndex = 0;
    for (var i = 0; i < choicesIndexList.length - 1; ++i) {
      // 강한 파티 찾아 들어간다
      if (partyList[choicesIndexList[choiceIndex]].getCombatStatusDifference() > partyList[choicesIndexList[i + 1]].getCombatStatusDifference()) {
        continue;
      } else if (partyList[choicesIndexList[choiceIndex]].getCombatStatusDifference() < partyList[choicesIndexList[i + 1]].getCombatStatusDifference()) {
        choiceIndex = i + 1;
      } else {
        // 강한 파티가 복수라면 요일 많아지는 파티로 들어간다
        if (partyList[choicesIndexList[choiceIndex]].ableDaysIfInserted(partyMember) >= partyList[choicesIndexList[i + 1]].ableDaysIfInserted(partyMember)) {
          continue;
        } else {
          choiceIndex = i + 1;
        }
      }
    }
choiceIndex = choicesIndexList[choiceIndex];
    return choiceIndex;
  }
  
  function chooseInitialBishopWhichPartyToGoIn(partyList) {
    var choicesIndexList = [];
    for (var i = 0; i < partyList.length; ++i) {
      if (partyList[i].partyBishopNumber == 0) {
        choicesIndexList.push(i);
      }
    }
  
    if (choicesIndexList.length == 0) {
      return -1;
    }
    return choicesIndexList[0];
  }

function getOverlappedDaysList(firstDaysList,secondDaysList) {
    var newDaysList = [];
    for(var i=0;i<firstDaysList.length;++i){
        if(secondDaysList.includes(firstDaysList[i])){
            newDaysList.push(firstDaysList[i]);
  }
 }
    return newDaysList;
}

function splitCombinationStringWithEachCase(partyCombinationString){
  var caseArray = partyCombinationString.split("{");
  //쓸데없는 빈칸 지움
  caseArray.splice(0,1);
  //"}\n"도 지움
  for(var i=0;i<caseArray.length;++i){
    caseArray[i] = caseArray[i].split("}\n")[1];     
  }
  return caseArray;
}

function splitCaseArrayWithEachParty(caseArray){
  var caseArrayWithPartyArray = [];
  for(var i=0;i<caseArray.length;++i){
    var tempArray = caseArray[i].split("\n");
    //마지막 의미없는 공백은 지운다
    tempArray.splice(tempArray.length-1,1);
    if(i === caseArray.length-1){//마지막꺼는 \n이 하나 더 들어가있음!!!
      tempArray.splice(tempArray.length-1,1);
    }
    //"1. " 이런 것도 지운다
    for(var j=0;j<tempArray.length;++j){
      tempArray[j] = tempArray[j].split(". ")[1];
    }
    caseArrayWithPartyArray.push(tempArray);
  }
  return caseArrayWithPartyArray;
}

function removeOverlappedCases(partyCombinationString) {
  var caseArray = splitCombinationStringWithEachCase(partyCombinationString);
  var caseArrayWithPartyArray = splitCaseArrayWithEachParty(caseArray);
  var resultArray = [];
  for(var i=0;i<caseArrayWithPartyArray.length;++i){//비교 기준
    var partyArrayLengthOfCurrentCase = caseArrayWithPartyArray[i].length;
    var isOverlapped = false;
    for(var j=i+1;j<caseArrayWithPartyArray.length;++j){//비교 대상
      if(partyArrayLengthOfCurrentCase != caseArrayWithPartyArray[j].length){
        continue;
      }
      var isTheSame = true;
      for(var k=0;k<partyArrayLengthOfCurrentCase;++k){//같은 case인지 체크
        if(!(caseArrayWithPartyArray[j].includes(caseArrayWithPartyArray[i][k]))){
          Log.i("비교기준:"+caseArrayWithPartyArray[i][k],false);
          isTheSame = false;
          break;
        }
      }
      if(isTheSame){
        isOverlapped = true;
        break;
      }
    }
    if(isOverlapped){
      continue;
    }
    else{
      resultArray.push(caseArray[i]);
    }
  }
  var returnString = "";
  for(var i=0;i<resultArray.length;++i){
    returnString += "{"+(i+1)+"}\n";
    returnString += resultArray[i] + "\n";
  }
  return returnString;
}
  