const scriptName="조회.js";
const room_name=["제이드"];	//여기에 채팅방 이름을 입력하세요
const commander_name=["제이드","착뢰","친쯔"];	//명령어를 사용하게 할 사람 이름을 입력
const world_num=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const world_name=["리부트2","리부트","오로라","레드","이노시스","유니온","스카니아","루나","제니스","크로아","베라","엘리시움","아케인","노바","버닝"];

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
	if(room_name.indexOf(room)!=-1 && msg.indexOf('!조회 ') != -1){
		if(commander_name.indexOf(sender)==-1){
			return;
		}
		msg = msg.replace('!조회 ','');
		var name = msg.toLowerCase();

		for(var i=0 ; i<15 ; i++){
			var url = Utils.getWebText("https://maplestory.nexon.com/Ranking/World/Total?c="+msg+"&w="+world_num[i]);
			if(url.indexOf("랭킹정보가 없습니다.")==-1){
				var wor = world_name[i];
				break;
			}
			if(i==15){
				replier.reply('랭킹정보가 없습니다.');
				return;
			}
		}

		var url_2 = Utils.getWebText("https://maplestory.nexon.com/Ranking/Union?c="+msg);
		
		url = url.toLowerCase();
		url_2 = url_2.toLowerCase();

		var data = url.split('>'+name+'</a>')[1].split('</tr>')[0].replace(/(<([^>]+)>)/g, "");
		data = data.replace(/ /gi, '').replace(/\n\n\n/gi, '').replace(/\n\n/gi, '');
		data = data.split('\n');

		if(url_2.indexOf('랭킹정보가 없습니다.')!=-1)
			var bon = 'X';
		else
			var bon = 'O';

		var job = data[0].split('lv.')[0];
		var lev	= 'Lv.'+data[0].split('lv.')[1];
		var pop = data[2];
		var gld = data[3];
		if(!data[3])
			gld='없음';

		var str = '['+msg+']\n서버: '+wor+'\n직업: '+job+'\n레벨: '+lev+'\n인기도: '+pop+'\n길드: '+gld+'\n대표캐릭터 여부: '+bon;
		replier.reply(str);
	}
}