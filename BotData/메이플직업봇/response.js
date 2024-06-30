var cha = [["히어로",  "모험가",  "전사",  "STR",  "현재 HP가 최대 HP의 15% 이하가 되었을 때 자동 발동되어 3초 동안 1초마다 최대 HP의 20/23/26/29/32/35% 회복.\n재발동 대기시간 410/370/330/290/250/210초", "STR 10/20/40/80/100 증가"], 
["팔라딘",  "모험가",  "전사",  "STR",  "현재 HP가 최대 HP의 15% 이하가 되었을 때 자동 발동되어 3초 동안 1초마다 최대 HP의 20/23/26/29/32/35% 회복.\n재발동 대기시간 410/370/330/290/250/210초", "STR 10/20/40/80/100 증가"], 
["다크나이트",  "모험가",  "전사",  "STR",  "현재 HP가 최대 HP의 15% 이하가 되었을 때 자동 발동되어 3초 동안 1초마다 최대 HP의 20/23/26/29/32/35% 회복.\n재발동 대기시간 410/370/330/290/250/210초", "최대 HP 2/3/4/5/6% 증가"], 
["아크메이지(불,독)",  "모험가",  "마법사",  "INT", "공격한 적 중 최대 HP가 가장 높은 적에 대한 약점을 15% 확률로 파악,\n파악한 약점은 10초 동안 지속되며 최대 3회까지 중첩.\n중첩 당 데미지 1/1/2/2/3/3%,\n방어율 무시 1/1/2/2/3/3% 증가", "최대 MP 2/3/4/5/6% 증가"], 
["아크메이지(썬,콜)",  "모험가",  "마법사",  "INT", "공격한 적 중 최대 HP가 가장 높은 적에 대한 약점을 15% 확률로 파악,\n파악한 약점은 10초 동안 지속되며 최대 3회까지 중첩.\n중첩 당 데미지 1/1/2/2/3/3%,\n방어율 무시 1/1/2/2/3/3% 증가", "INT 10/20/40/80/100 증가"], 
["비숍",  "모험가",  "마법사",  "INT", "공격한 적 중 최대 HP가 가장 높은 적에 대한 약점을 15% 확률로 파악, \n파악한 약점은 10초 동안 지속되며 최대 3회까지 중첩.\n중첩 당 데미지 1/1/2/2/3/3%,\n방어율 무시 1/1/2/2/3/3% 증가", "INT 10/20/40/80/100 증가"], 
["보우마스터",  "모험가",  "궁수",  "DEX", "몬스터 컬렉션 등록 확률 10/15/20/25/30/35%, \n크리티컬 확률 3/4/6/7/9/10% 증가", "DEX 10/20/40/80/100 증가"], 
["신궁",  "모험가",  "궁수",  "DEX", "몬스터 컬렉션 등록 확률 10/15/20/25/30/35%, \n크리티컬 확률 3/4/6/7/9/10% 증가", "크리티컬 확률 1/2/3/4/5% 증가"], 
["패스파인더",  "모험가",  "궁수",  "DEX", "몬스터 컬렉션 등록 확률 10/15/20/25/30/35%, \n크리티컬 확률 3/4/6/7/9/10% 증가", "DEX 10/20/40/80/100 증가"], 
["나이트로드",  "모험가",  "도적",  "LUK", "적에게 상태 이상을 적용시키면 10초 동안 데미지 3/6/9/12/15/18% 증가\n재발동 대기시간 20초", "크리티컬 확률 1/2/3/4/5% 증가"], 
["섀도어",  "모험가",  "도적",  "LUK", "적에게 상태 이상을 적용시키면 10초 동안 데미지 3/6/9/12/15/18% 증가\n재발동 대기시간 20초", "LUK 10/20/40/80/100 증가"], 
["듀얼블레이드",  "모험가",  "도적",  "LUK", "적에게 상태 이상을 적용시키면 10초 동안 데미지 3/6/9/12/15/18% 증가\n재발동 대기시간 20초", "LUK 10/20/40/80/100 증가"], 
["바이퍼",  "모험가",  "해적",  "STR", "힘,민첩,지력,운 20/30/40/50/60/70,\n최대 HP,MP 350/525/700/875/1050/1225 증가, \n피격 데미지 5/7/9/11/13/15% 감소", "STR 10/20/40/80/100 증가"], 
["캡틴",  "모험가",  "해적",  "DEX", "힘,민첩,지력,운 20/30/40/50/60/70, \n최대 HP,MP 350/525/700/875/1050/1225 증가, \n피격 데미지 5/7/9/11/13/15% 감소", "소환수 지속 시간 4/6/8/10/12% 증가"], 
["캐논슈터",  "모험가",  "해적",  "STR", "힘,민첩,지력,운 20/30/40/50/60/70, \n최대 HP,MP 350/525/700/875/1050/1225 증가, \n피격 데미지 5/7/9/11/13/15% 감소", "STR 10/20/40/80/100 증가"], 
["소울마스터",  "시그너스",  "전사",  "STR", "공격력과 마력 7/9/11/13/15/17/19/21/23/25, \n상태 이상 내성 1/3/4/6/7/9/10/12/13/15, \n모든 속성 내성 1/3/4/6/7/9/10/12/13/15% 증가", "최대 HP 250/500/1000/2000/2500 증가"], 
["플레임위자드",  "시그너스",  "마법사",  "INT", "공격력과 마력 7/9/11/13/15/17/19/21/23/25, \n상태 이상 내성 1/3/4/6/7/9/10/12/13/15, \n모든 속성 내성 1/3/4/6/7/9/10/12/13/15% 증가", "INT 10/20/40/80/100 증가"], 
["윈드브레이커",  "시그너스",  "궁수",  "DEX", "공격력과 마력 7/9/11/13/15/17/19/21/23/25, \n상태 이상 내성 1/3/4/6/7/9/10/12/13/15, \n모든 속성 내성 1/3/4/6/7/9/10/12/13/15% 증가", "DEX 10/20/40/80/100 증가"], 
["나이트워커",  "시그너스",  "도적",  "LUK", "공격력과 마력 7/9/11/13/15/17/19/21/23/25, \n상태 이상 내성 1/3/4/6/7/9/10/12/13/15, \n모든 속성 내성 1/3/4/6/7/9/10/12/13/15% 증가", "LUK 10/20/40/80/100 증가"], 
["스트라이커",  "시그너스",  "해적",  "STR", "공격력과 마력 7/9/11/13/15/17/19/21/23/25, \n상태 이상 내성 1/3/4/6/7/9/10/12/13/15, \n모든 속성 내성 1/3/4/6/7/9/10/12/13/15% 증가", "STR 10/20/40/80/100 증가"], 
["미하일",  "시그너스",  "전사",  "STR", "본인 - 15/30초 동안 보호막이 생성, 최대 3/6번의 피해를 방어, 데미지 15/20% 증가. \n단, 최대 HP의 일정 비율로 피해를 입히는 공격에 한해 피해 10/20% 감소. \n재사용 대기시간: 180초\n타인 - 10/15초 동안 상태 이상 내성 100 증가. \n재사용 대기시간 120초", "최대 HP 250/500/1000/2000/2500 증가"], 
["블래스터",  "레지스탕스",  "전사",  "STR", "부활 시 1/2/3/4/5/6/7/8초 동안 무적 상태, 맵 이동 시 해제", "방어율 무시 1/2/3/5/6% 증가"], 
["배틀메이지",  "레지스탕스",  "마법사",  "INT", "부활 시 1/2/3/4/5/6/7/8초 동안 무적 상태, 맵 이동 시 해제", "INT 10/20/40/80/100 증가"], 
["와일드헌터",  "레지스탕스",  "궁수",  "DEX", "부활 시 1/2/3/4/5/6/7/8초 동안 무적 상태, 맵 이동 시 해제", "공격 시 20% 확률로 데미지 4/8/12/16/20% 증가"], 
["메카닉",  "레지스탕스",  "해적",  "DEX", "부활 시 1/2/3/4/5/6/7/8초 동안 무적 상태, 맵 이동 시 해제", "버프 지속 시간 5/10/15/20/25% 증가"], 
["제논",  "레지스탕스",  "하이브리드",  "STR,DEX,LUK", "모든 능력치 5/10% 증가", "STR·DEX·LUK 각각 5/10/20/40/50 증가"], 
["데몬슬레이어",  "레지스탕스",  "전사",  "STR", "보스 몬스터 공격시 데미지 10/15% 증가 \n(10의 포스 추가 흡수)", "모든 상태 이상 저항 1/2/3/4/5 증가"], 
["데몬어벤져",  "레지스탕스",  "전사",  "HP", "데미지 5/10% 증가", "보스 공격 시 데미지 1/2/3/5/6% 증가"], 
["아란",  "영웅",  "전사",  "STR", "영구적으로 콤보킬 구슬 경험치 획득량 400/600% 추가 획득", "적 타격 시 70%의 확률로 순수 HP의 2/4/6/8/10% 회복\n발동 시 다음 발동 확률이 감소하지만 효과가 2배 (10초마다 1번)"], 
["에반",  "영웅",  "마법사",  "INT", "해방된 룬의 힘 지속시간 30/50% 증가", "적 타격 시 70%의 확률로 순수 MP의 2/4/6/8/10% 회복\n발동 시 다음 발동 확률이 감소하지만 효과가 2배 (10초마다 1번)"], 
["루미너스",  "영웅",  "마법사",  "INT", "적 공격 시 방어율 무시 10/15% 적용", "INT 10/20/40/80/100 증가"], 
["메르세데스",  "영웅",  "궁수",  "DEX", "사용 시 에우렐로 귀환, 재사용 대기시간 1800초\n영구적으로 경험치 10/15% 추가 획득", "스킬 재사용 대기시간 2/3/4/5/6% 감소\n(1초 미만으로 줄어들지 않음)"], 
["팬텀",  "영웅",  "도적",  "LUK", "크리티컬 확률 10/15% 증가", "메소 획득량 1/2/3/4/5% 증가"], 
["은월",  "영웅",  "해적",  "STR", "사망에 이르는 공격을 당할 시, 5/10% 확률로 생존", "크리티컬 데미지 1/2/3/5/6% 증가"], 
["카이저",  "노바",  "전사",  "STR", "본인 - HP 5/10% 증가, 모프 게이지 단계당 데미지 2/3% 증가\n타인 - HP 10/15% 증가", "STR 10/20/40/80/100 증가"], 
["카인",  "노바",  "궁수",  "DEX", "적 8명 처치, 혹은 보스 몬스터에게 5번 공격 적중 시 사전 준비 1번 완료, \n사전 준비를 5번 마치면 20초 동안 데미지 9/17% 증가\n재발동 대기시간 40초", "DEX 10/20/40/80/100 증가"], 
["카데나",  "노바",  "도적",  "LUK", "캐릭터보다 레벨이 낮은 몬스터 공격 시 데미지 3/6% 증가, \n상태 이상에 걸린 몬스터 공격 시 데미지 3/6% 증가", "LUK 10/20/40/80/100 증가"], 
["엔젤릭버스터",  "노바",  "해적",  "DEX", "발동 시 10초 동안 스킬 데미지 60/90(타인 - 30/45)% 증가\n재사용 대기시간 90초", "DEX 10/20/40/80/100 증가"], 
["아델",  "레프",  "전사",  "STR", "같은 맵에 있는 자신을 포함한 파티원 1명 당 데미지 1/2% 증가, 최대 4/8%까지 증가. \n파티를 하지 않았을 때는 자신만 파티한 것으로 취급. \n보스 몬스터 공격 시 데미지 2/4% 증가", "STR 10/20/40/80/100 증가"], 
["일리움",  "레프",  "마법사",  "INT", "일정 거리 이동 시 발동되며 최대 6회 중첩가능, 지속시간 5초\n각 중첩당 데미지 1/2% 증가", "INT 10/20/40/80/100 증가"], 
["아크",  "레프",  "해적",  "STR", "전투 상태가 5초 지속되면 발동되며 최대 5회 중첩 가능, 지속시간 5초\n발동 시 데미지 1% 증가, 각 중첩당 데미지 1/2% 증가", "STR 10/20/40/80/100 증가"], 
["라라",  "아니마",  "마법사",  "INT", "데미지 5% 증가, 일반 몬스터 20명 처치 시 자연의 도움 발동, \n자연의 도움 발동 시 30초 동안 일반 몬스터 공격 시 데미지 7/11% 증가\n재발동 대기시간 30초", "INT 10/20/40/80/100 증가"], 
["호영",  "아니마",  "도적",  "LUK", "방어율 무시 5/10% 추가, HP가 100%인 몬스터 공격 시 데미지 9/14% 증가", "LUK 10/20/40/80/100 증가"], 
["제로",  "제로",  "전사",  "STR", "받는 데미지 3/6/9/12/15% 감소, 공격 시 대상의 방어율 2/4/6/8/10% 무시", "경험치 획득량 4/6/8/10/12% 증가"], 
["키네시스",  "키네시스",  "마법사",  "INT", "크리티컬 데미지 2/4% 증가", "INT 10/20/40/80/100 증가"], 
["칼리", "레프",  "도적",  "LUK", "데미지 5% 증가, 공격 시 100% 확률로 5초 동안 매초 최대 HP/MP의 2% 회복", "LUK 10/20/40/80/100 증가"]]


function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {

if(room =="자괴감"){
    var result = "";                                                                                                                                                                                                           
    var cnt = 0;
    var type = "";
    var subtype = "";

    msg = msg.replace("불독","아크메이지(불,독)");
    msg = msg.replace("썬콜","아크메이지(썬,콜)");
    msg = msg.replace("닼나","다크나이트"); 
if(msg == "/팔라")
    msg = msg.replace("팔라","팔라딘"); 
    msg = msg.replace("보마","보우마스터"); 
    msg = msg.replace("나로","나이트로드"); 
    msg = msg.replace("캐슈","캐논슈터"); 
    msg = msg.replace("듀블","듀얼블레이드"); 
    msg = msg.replace("소마","소울마스터"); 
    msg = msg.replace("플위","플레임위자드"); 
    msg = msg.replace("나워","나이트워커"); 
    msg = msg.replace("윈브","윈드브레이커"); 
    msg = msg.replace("윈블","윈드브레이커"); 
    msg = msg.replace("스커","스트라이커");
    if(msg == "/블래")
    msg = msg.replace("블래","블래스터"); 
    msg = msg.replace("데벤","데몬어벤져"); 
    msg = msg.replace("데벤져","데몬어벤져"); 
    msg = msg.replace("데벤저","데몬어벤져"); 
    msg = msg.replace("데슬","데몬슬레이어"); 
    msg = msg.replace("배메","배틀메이지"); 
    msg = msg.replace("와헌","와일드헌터"); 
if(msg == "/루미")
    msg = msg.replace("루미","루미너스"); 
if(msg == "/메르")
    msg = msg.replace("메르","메르세데스"); 
    msg = msg.replace("멜세","메르세데스"); 
    msg = msg.replace("메세","메르세데스"); 
    msg = msg.replace("엔버","엔젤릭버스터");
    msg = msg.replace("12움","일리움");    
if(msg == "/키네")
    msg = msg.replace("키네","키네시스");

    var inven1 = "https://m.inven.co.kr/board/maple/";
    var inven2 = "?category=";
    var jobCode = 2294;
    var jobName = "";

    for( i = 0; i < cha.length; i++ ) {
  if (msg == "/"+cha[i][0] ) 
{ 
    msg = msg.replace("/","");

    cnt = cnt+1;
    
    switch(cha[i][2]){
      case "전사":
         jobCode = 2294; break;
      case "마법사":
         jobCode = 2295; break;
      case "궁수":
         jobCode = 2296; break;
      case "도적":
         jobCode = 2297; break;
      case "해적":
      case "하이브리드":
         jobCode = 2298; break; }
    jobName = cha[i][0];
    jobName = jobName.replace("아크메이지","아크");
    jobName = jobName.replace(",","");
    jobName = jobName.replace("팬텀", "괴도팬텀");
   
    var inven = inven1 + jobCode + inven2 + jobName;

    result += " ["+cha[i][1]+": "+cha[i][2]+"]\n주스탯 : "+cha[i][3]+"\n\n링크 스킬 :\n"+cha[i][4]+"\n\n유니온 효과 :\n"+cha[i][5]
+ "\n\n직업 게시판\n" + inven;
  }
}  

if (cnt > 0) { replier.reply(msg+ result); }


}

}