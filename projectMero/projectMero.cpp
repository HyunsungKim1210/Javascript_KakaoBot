#include <iostream>
#include <fstream>
#include <cstring>
#include <vector>
#include <regex>

using namespace std;

class Character
{
    protected:
        string name;
        double combatStatus;
    public:
        Character(string name, double combatStatus) : 
        name(name), combatStatus(combatStatus) {} 

        string getName() const {return name;}
        double getCombatStatus() const {return combatStatus;}
        
};

class Player : public Character
{
    private:
    public:
        Player(string name, double combatStatus) :
        Character(name, combatStatus) 
        {
            if(name.compare("불독") == 0)
            {
                combatStatus *= 1.5;
            }
        }


};

class Boss : public Character 
{
    public:
        Boss(string name, double combatStatus) : 
        Character(name, combatStatus) {}

        int computeClearTime(double partyCombatStatus)
        {
            if(partyCombatStatus < this->combatStatus)
            {
                return -1;
            }
            else
            {
                double magnification = partyCombatStatus / this->combatStatus;
                if(magnification >= 2.35){
                    return 1800 / (magnification * (magnification - 0.2));
                }
                else{
                    return 1800 / (magnification * (magnification + 0.2));
                }
                return 1800 / magnification; // 더 자세한 공식은 데이터 수집 필요
            }//무하는 하진힐 mag가 2 나와야함. 실상은 1.3;왼/오=1.5
            //반대로 하스우는 7.5. 실상은 2.8;왼/오=2.67
            //여우새는 노진힐 1.36. 실상은 1.025;;왼/오=1.3
            //즉, 전투력차이가 많이 날수록 mag가 더 커져야함. 적으면 적게 커지고.
            //한마디로 곱으로 접근하는게 맞아보임. 특히 제곱쪽.
            //근데 스펙 차이가 적을수록 더 큰 값을 곱해야하고, 스펙차이가 클수록
            //더 작은 값을 곱해야함. 로그랑 뭔가 비슷하지 않나?
        }

        void convertToMinSec(int seconds, int time[])
        {
            time[0] = seconds / 60;
            time[1] = seconds % 60;
        }

};

class Party 
{
    private:
        double partyCombatStatus;
    public:
        Party(const vector<Player> &users)
        {
            partyCombatStatus = 0;
            for(int i=0; i<users.size(); i++)
            {
                partyCombatStatus += users[i].getCombatStatus();
            }
        }
        double getCombatStatus() const {return partyCombatStatus;}
};


vector<string> extractFields(const string& json) {
    vector<string> fields;

    // "name" 필드 추출
    size_t namePos = json.find("\"name\":");
    if (namePos != string::npos) {
        size_t nameStart = json.find('"', namePos + 7);  // 이후의 큰따옴표 찾기
        size_t nameEnd = json.find('"', nameStart + 1);  // 그 다음 큰따옴표 찾기

        if (nameStart != string::npos && nameEnd != string::npos) {
            fields.push_back(json.substr(nameStart + 1, nameEnd - nameStart - 1));
        }
    }

    // "stat" 필드 추출
    size_t statPos = json.find("\"stat\":");
    if (statPos != string::npos) {
        size_t statStart = json.find_first_of("0123456789", statPos + 7);  // 숫자 시작 위치 찾기
        size_t statEnd = json.find(',', statStart + 1);  // 그 다음 쉼표 찾기

        if (statStart != string::npos && statEnd != string::npos) {
            fields.push_back(json.substr(statStart, statEnd - statStart));
        }
    }

    // "isPlaying" 필드 추출
    size_t isPlayingPos = json.find("\"isPlaying\":");
    if (isPlayingPos != string::npos) {
        size_t isPlayingStart = isPlayingPos + 12;  // ":" 이후부터 값 시작
        size_t isPlayingEnd = json.find(',', isPlayingStart);  // 다음 쉼표 찾기

        if (isPlayingEnd == string::npos) {
            isPlayingEnd = json.find('}', isPlayingStart);  // 만약 쉼표가 없으면 '}' 찾기
        }

        if (isPlayingEnd != string::npos) {
            fields.push_back(json.substr(isPlayingStart, isPlayingEnd - isPlayingStart));
        }
    }

    return fields;
}
//projectMero의 1차적인 목표는 파티가 특정 보스를 클리어하는 예산 시간 출력.
//그러기 위해선 먼저 보스들과 플레이어 데이터를 받고
//파티 전투력과 보스 전투력을 비교해서 예상 시간을 출력한다.
//맑음 유튜브 솔격 전투력이 30분 기준이고, 그거의 2배가 15분 정도로 잡는다.
int main()
{
    //보스 인스턴스 선언
    vector<Boss> bossList;
    bossList.push_back(Boss("하드스우", 25000000));
    bossList.push_back(Boss("하드데미안", 25000000));
    bossList.push_back(Boss("노말진힐라", 40000000));
    bossList.push_back(Boss("하드루시드", 45000000));
    bossList.push_back(Boss("카오스더스크", 48000000));
    bossList.push_back(Boss("하드윌",50000000));
    bossList.push_back(Boss("하드듄켈", 55000000));
    bossList.push_back(Boss("하드진힐라", 55000000));
    bossList.push_back(Boss("카오스가엔슬", 60000000));
    //플레이어 인스턴스 선언
    vector<Player> users;
    //플레이어 읽어오기
    ifstream readFile;
    readFile.open("/home/hyunsungkim/Desktop/Kakao_Bot/database/spec.json");

    if(readFile.is_open()){
        cout << "File open success" << endl;
        for (int lineNumber = 1; !readFile.eof(); lineNumber++){
            string line;
            getline(readFile, line);
            if(lineNumber == 1){
                continue;
            }
            vector<string> splitLine = extractFields(line);
            if(splitLine.size() == 0){
                continue;
            }
            if(splitLine[2].compare("false") == 0){
                continue;
            }
            users.push_back(Player(splitLine[0],stod(splitLine[1])));
        }
    }
    else{
        cout << "File open fail" << endl;
        exit(1);
    } 
    readFile.close();
    //파티 선언
    vector<string> partyMemberName;
    bool isContinueInput = true;
    while(isContinueInput){
        cout << "파티 멤버 이름?" << endl;
        string member;
        cin >> member;
        partyMemberName.push_back(member);

        cout << "계속하면 1 입력" << endl;
        cin >> isContinueInput;
    }
    if(partyMemberName.size() == 0){
        cout << "파티 멤버가 없습니다" << endl;
        exit(0);
    }
    vector<Player> partyMember;
    for(int i=0; i<partyMemberName.size(); i++){
        for(int j=0; j<users.size();j++){
            if(partyMemberName[i].compare(users[j].getName()) == 0){
                partyMember.push_back(users[j]);
                break;
            }
        }
    }
    if(partyMemberName.size() != partyMember.size()){
        cout << "이름을 잘못입력했습니다" << endl;
        exit(1);
    }
    Party usersParty(partyMember);
    //어떤 보스 잡을건지 입력
    string bossName;
    cout << "잡을 보스 이름 입력" << endl;
    cin >> bossName;
    int bossIndex = -1;
    for(int i=0; i<bossList.size();i++){
        if(bossName.compare(bossList[i].getName()) == 0){
            bossIndex = i;
        }
    }
    if(bossIndex == -1){
        cout << "일치하는 보스 없음" << endl;
    }

    
    //파티 전투력과 보스 전투력 비교
    int clearSec = bossList[bossIndex].computeClearTime(usersParty.getCombatStatus());
    int time[2] = {0,0};
    bossList[bossIndex].convertToMinSec(clearSec, time);
    //출력

    cout << "예상 "<<  bossList[bossIndex].getName() << " 클리어 시간은" << endl;
    cout << time[0] << "분" << time[1] << "초 입니다" << endl;

    return 0;
}