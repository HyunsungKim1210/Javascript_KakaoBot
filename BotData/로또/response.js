function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName) {
if(room=="단톡"||room=="자괴감"){
  if(msg=="/로또"){
    var nums = [0,0,0,0,0,0];
    var i = 0;
    var isExist = false;

    while(nums[5]==0){
      var num =
      Math.floor(Math.random()*45);

      for(var j=0; j<i; j++){
        if(num==nums[j]-1){
          isExist=true;
        }
      }
      
      if(!isExist){
        nums[i]=num+1;
        i++;
      }
      isExist = false;
    }

    nums.sort(function(a, b) { return a - b; });

    replier.reply(nums[0]+", "+nums[1]+", "+nums[2]+", "+nums[3]+", "+nums[4]+", "+nums[5]+"입니다.");
  }
}
}