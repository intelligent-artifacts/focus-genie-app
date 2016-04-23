function focusDemo(args) {
    var me = this;
    if (!args.callURL) {
        console.log('Call URL not defined');
        return;
    }
    this.callURL=args.callURL;
    if (!args.containingElement) {
        console.log('Containing Element not defined');
        return;
    }
    this.containingElement=$(args.containingElement)[0];
    if(!this.containingElement){
        console.log('Containing Element not found');
        return;        
    }
    
    var newContainer=document.createElement('div');
    this.containingElement.appendChild(newContainer);
    this.containingElement=newContainer;
    this.containingElement.className='focusMainContainer';
    
    if (args.callDelay){
        this.callDelay=args.callDelay;
    }else this.callDelay=1000;
    if (args.targetReachedDelay) {
        this.targetReachedDelay=args.targetReachedDelay;
    }else this.targetReachedDelay=2000;
    if (args.frameSpeed) {
        this.frameSpeed=args.frameSpeed;
    }else this.frameSpeed=30;
    if (args.actorZoom) {
        this.actorZoom=args.actorZoom;
    }else actorZoom=1.0;
    
    if (args.spawnArea) {
        this.spawnArea=args.spawnArea;
    }else this.spawnArea=[0.5,0.5];
    
    this.canvas=document.createElement('canvas');
    this.containingElement.appendChild(this.canvas);
    this.ctx=this.canvas.getContext("2d");
    this.canvas.className='focusCanvas';
    this.canvas.width=this.containingElement.clientWidth;
    this.canvas.height=this.containingElement.clientHeight;
    
    this.spawnAreaMarker=document.createElement('div');
    this.containingElement.appendChild(this.spawnAreaMarker);
    this.spawnAreaMarker.className='spawnAreaMarker';
    var w=this.spawnArea[0]*this.canvas.width;var h=this.spawnArea[1]*this.canvas.height;
    this.spawnAreaMarker.style.width=w+'px';
    this.spawnAreaMarker.style.height=h+'px';
    this.spawnAreaMarker.style.left=(this.canvas.width-w)/2+'px';
    this.spawnAreaMarker.style.top=(this.canvas.height-h)/2+'px';
    this.spawnAreaZone=[(this.canvas.width-w)/2,(this.canvas.height-h)/2,w,h];
    
    this.tableContainer=document.createElement('div');
    this.containingElement.appendChild(this.tableContainer);
    this.tableContainer.className='dataTable';

    this.assets=new resourcesManager(this);
    //loading images
    this.assets.LoadImage('happy','assets/img/happy.png');
    this.assets.LoadImage('normal','assets/img/normal.png');
    this.assets.LoadImage('sad','assets/img/sad.png');
    this.assets.LoadImage('apple','assets/img/apple.png');
    this.assets.LoadImage('cupcake','assets/img/cupcake.png');
    this.assets.LoadImage('strawberry','assets/img/strawberry.png');
    this.assets.LoadImage('boom','assets/img/boom.png');
    this.assets.LoadImage('bomb','assets/img/bomb.png');
    //starting load
    this.assets.Start(null,null);
    
    this.food=['apple','cupcake','strawberry'];
/*    this.apple=new sprite(this,'apple',100,100,{moveSpeed:5});
    this.bomb=new sprite(this,'bomb',200,100,{});
    this.boom=new sprite(this,'boom',300,100,{spriteW:130,spriteSize:25,frameSpeed:1.1,repeat:true});
    this.apple.move(200,500);
    
    this.actors=[this.apple,this.bomb,this.boom];*/
    this.actors=[];
    this.readyForCalls=true;
    this.outputRez=null;
    this.status=false;
    
    this.random=random;function random(max){
        var ret=Math.floor(Math.random()*max);
        return ret;
    }

    this.makeCall=makeCall;function makeCall(type,sendData,successCall){
        var result = 'none';                    
                    switch (type) {
                        case('observe'):
                            if (sendData[0].strings.length) {
                                console.log('---sending :----- observe '+sendData[0].strings[0]+' vectors: '+sendData[0].vectors[0][0]+','+sendData[0].vectors[0][1]+' / '+sendData[0].vectors[1][0]+','+sendData[0].vectors[1][1]+'    '+JSON.stringify(sendData));
                            }else console.log('---sending :----- observe scalars:'+sendData[0].scalars[0]+'    '+JSON.stringify(sendData));
                            break;
                        case('getOutputData'):
                            console.log('---sending :----- getOutputData ',sendData);
                            break;
                        default:if(type !='getWM' && type!='showDecisionTable')console.log('!!!!!!!!!!!!!!error-unknown type:'+type+'!!!!!!!!!!!!!!'+'    '+JSON.stringify(sendData));
                    }
        //console.log('>>>>>'+type);
        var d = {"jsonrpc": "1.0", "id":1, "method": type, "params": sendData };
        $.ajax({
            type : "POST",
            url : this.callURL,
            data: JSON.stringify(d),
            cache: false,
            dataType: "json",
            async: true,
            success : function(data) {
                result = data.result.message;                    
                    switch (type) {
                        case('observe'):
                            if (sendData[0].strings.length) {
                                console.log('+++success :+++++ observe '+sendData[0].strings[0]+' vectors: '+sendData[0].vectors[0][0]+','+sendData[0].vectors[0][1]+' / '+sendData[0].vectors[1][0]+','+sendData[0].vectors[1][1]+'    '+JSON.stringify(result));
                            }else console.log('+++success :+++++ observe scalars:'+sendData[0].scalars[0],result);
                            break;
                        case('getOutputData'):
                            console.log('+++success :+++++ getOutputData :'+result.vectors[0][0]+','+result.vectors[0][1]+'( => '+(result.vectors[0][0]+me.actors[0].x)+','+(result.vectors[0][1]+me.actors[0].y+')')+'    '+JSON.stringify(result));
                            break;
                        default:if(type !='getWM' && type!='showDecisionTable')console.log('!!!!!!!!!!!!!!error-unknown type:'+type+'!!!!!!!!!!!!!!'+'    '+JSON.stringify(result));
                    }
                if (successCall) {
                    var func=eval(successCall);
                    if (func)func.call(me,result);
                }
                //if (type!='getWM')me.makeCall('getWM',[],showWM);
                return result;
            },
            error: function( data, status, error ) {
                me.readyForCalls=true;
                console.log("FAILED! queryPrimitive",data,status,error);
            }
        });
        return result;
    }
    
    this.outputResult=outputResult;function outputResult(result){
        //console.log(result);
    }

    this.storeResult=storeResult;function storeResult(result){
        this.outputRez=result;
    }
    
    this.roundOver=roundOver;function roundOver(ret){
        //console.log('round over',ret);
        this.status=false;
    }
    
    this.showTable=showTable;function showTable(ret){
        var html='';
        for(i=0;i<ret.length;i++){
            html+='<div class="displayTableRow">';
                html+='<div>'+ret[i][0]+'</div>';
                html+='<div>'+Math.round(ret[i][1]*1000)/10+' %</div>';
            html+='</div>';
        }
        this.tableContainer.innerHTML=html;;
    }
    
    this.showWM=showWM;function showWM(ret){
        var s=document.getElementById('status');
        s.innerHTML=ret;
        //console.log(ret);
    }
    
    this.spawnItems=spawnItems;function spawnItems(){
        this.actors[0]=new sprite(this,'normal',this.spawnAreaZone[0]+this.random(this.spawnAreaZone[2]),this.spawnAreaZone[1]+this.random(this.spawnAreaZone[3]),{moveSpeed:5});
        if (this.random(2)) {
            this.actors[1]=new sprite(this,this.food[this.random(this.food.length)],this.spawnAreaZone[0]+this.random(this.spawnAreaZone[2]),this.spawnAreaZone[1]+this.random(this.spawnAreaZone[3]),{});
        }else{
            this.actors[1]=new sprite(this,'bomb',this.spawnAreaZone[0]+this.random(this.spawnAreaZone[2]),this.spawnAreaZone[1]+this.random(this.spawnAreaZone[3]),{moveSpeed:5});
        }
        if (this.actors[1].ID=='bomb')target='bomb';else target='food';
        //console.log('spawned '+target);        
        this.getResponse();
    }

    this.getResponse=getResponse;function getResponse(){
        //console.log('getting new coords');
        this.status='getResponse';
        var target;
        if (this.actors[1].ID=='bomb')target='bomb';else target='food';
        ret=this.makeCall('observe',[{'vectors':[[this.actors[0].x,this.actors[0].y],[this.actors[1].x,this.actors[1].y]],'strings':[target],'scalars':[]}],getOutputData);
    }

    this.getOutputData=getOutputData;function getOutputData(ret){
        this.makeCall('showDecisionTable',[],showTable);
        this.makeCall('getOutputData',[],move);
    }
    
    this.move=move;function move(ret){
        //console.log('move');
        var x=ret.vectors[0][0];
        var y=ret.vectors[0][1];
        this.status='moving';
        this.actors[0].move(this.actors[0].x+x,this.actors[0].y+y);
        if (this.actors[0].Tx<0 || this.actors[0].Tx>this.canvas.width || this.actors[0].Ty<0 || this.actors[0].Ty>this.canvas.height) {//going out of bounds
            if (this.actors[1].ID=='bomb') {
                //console.log('running from bomb - happy :100');
                this.actors[0].ID='happy';
                this.status='waiting;'
                var rez=this.makeCall('observe',[{'strings': [], 'vectors': [], 'scalars': [100]}],roundOver);
            }else{
                //console.log('running from food - sad :-100');
                this.actors[0].ID='sad';
                this.status='waiting;'
                var rez=this.makeCall('observe',[{'strings': [], 'vectors': [], 'scalars': [-100]}],roundOver);
            }
        }
    }
    
    this.Dist=Dist;function Dist(x1,y1,x2,y2){
        var Dx=x1-x2;
        var Dy=y1-y2;
        return Math.sqrt(Dx*Dx+Dy*Dy);
    }
    
    this.waitNewRound=waitNewRound;function waitNewRound(ret){
        //console.log('wait new round',ret);
        me.status='waiting';
        //me.actors=[];me.status=false;console.log('start new round');
        setTimeout(function(){me.actors=[];me.status=false;},me.targetReachedDelay);
    }
    
    this.checkTargetReached=checkTargetReached;function checkTargetReached(){
        if(this.actors[0].x==this.actors[1].x && this.actors[0].y==this.actors[1].y){
            if (this.actors[1].ID=='bomb') {//boom !
                this.actors[1]=new sprite(this,'boom',this.actors[1].x,this.actors[1].y,{spriteW:130,spriteSize:25,frameSpeed:1.1,repeat:false});
                this.actors[0].ID='sad';
                //console.log('moved on bomb - sad');
                this.status='waiting';
                var rez=this.makeCall('observe',[{'strings': [], 'vectors': [], 'scalars': [-100]}],waitNewRound);
            }else if (this.actors[1].ID!='boom'){//hide food
                this.actors.splice(1,1);
                this.actors[0].ID='happy';
                //console.log('moved on food - happy');
                this.status='waiting';
                var rez=this.makeCall('observe',[{'strings': [], 'vectors': [], 'scalars': [100]}],waitNewRound);
            }
            return(true);
        }
        return(false);
    }

    this.checkRound=checkRound;function checkRound(){
        switch (this.status) {
            case('waiting'):
                break;
            case('getResponse'):
                break;
            case('moving'):
                if(!this.checkTargetReached()){
                    if(this.actors[0].Tx==this.actors[0].x && this.actors[0].Ty==this.actors[0].y){//destination reached
                        this.getResponse();
                    }else if (this.actors[0].x<0 || this.actors[0].x>this.canvas.width || this.actors[0].y<0 || this.actors[0].y>this.canvas.height){//gone out of bounds
                        waitNewRound('out of bounds');
                    }
                }
                break;
            default:
                if (this.actors.length<=0)this.spawnItems();
                //else if(this.actors[0].Tx==this.actors[0].x && this.actors[0].Ty==this.actors[0].y)waitNewRound();//destination reached
                else if (this.actors[0].x<0 || this.actors[0].x>this.canvas.width || this.actors[0].y<0 || this.actors[0].y>this.canvas.height)waitNewRound('out of bounds 2');//gone out of bounds
        }
    }
    
    this.Run=Run;function Run(){
        this.assets.Run();if(this.assets.show)return;
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        for(i=0;i<this.actors.length;i++)this.actors[i].Run();
        this.checkRound();        
    }
    
    this.RunInterval=setInterval(function(){me.Run();},this.frameSpeed);
    this.Run();
}

function sprite(parent,ID,X,Y,args) {
    this.x=this.Tx=X;
    this.y=this.Ty=Y;
    this.parent=parent;
    this.ID=ID;
    if(args.moveSpeed)this.moveSpeed=args.moveSpeed;else this.moveSpeed=1;
    if(args.repeatFrames)this.repeatFrames=args.repeatFrames;else this.repeatFrames=false;
    if(args.turn)this.turn=args.turn;else this.turn=false;
    if(args.spriteW)this.spriteW=args.spriteW;else this.spriteW=false;
    if(args.spriteH)this.spriteH=args.spriteH;else this.spriteH=this.spriteW;
    if(args.spriteSize)this.spriteSize=args.spriteSize;else this.spriteSize=0;
    if(args.frameSpeed)this.frameSpeed=args.frameSpeed;else this.frameSpeed=1;
    if(args.repeat)this.repeat=args.repeat;else this.repeat=false;
    this.frame=0;
    this.angle=0.0;
    this.move=move;function move(x,y){
        this.Tx=x;this.Ty=y;
    }
    this.drawPic=drawPic;function drawPic(ID,x,y,zoom,angle){
        var image=this.parent.assets.Data.Images[ID];
        if (angle) {
            this.parent.assets.drawRotPic(image,x-(zoom*image.width/2),y-(zoom*image.height/2),zoom,angle,zoom*image.width/2,zoom*image.height/2,this.parent.ctx,1.0);
        }else{
            this.parent.assets.drawPic(image,x-(zoom*image.width/2),y-(zoom*image.height/2),zoom,this.parent.ctx,1.0);
        }
    }
    
    this.drawClipPic=drawClipPic;function drawClipPic(ID,x,y,zoom,angle,sx,sy,swidth,sheight){
        var image=this.parent.assets.Data.Images[ID];
        if (angle) {
            this.parent.assets.drawRotPicClip(image,x-(zoom*swidth/2),y-(zoom*sheight/2),zoom,angle,zoom*swidth/2,zoom*sheight/2,this.parent.ctx,1.0,sx,sy,swidth,sheight);
        }else{
            this.parent.assets.drawPicClip(image,x-(zoom*swidth/2),y-(zoom*sheight/2),zoom,this.parent.ctx,1.0,sx,sy,swidth,sheight);
        }
    }
    this.Run=Run;function Run(){
        var id=this.ID;        
        if (this.Tx!=this.x || this.Ty!=this.y){
            var Dx=this.Tx-this.x;
            var Dy=this.Ty-this.y;
            var L=Math.sqrt(Dx*Dx+Dy*Dy);
            if (L>this.moveSpeed) {
                Dx*=this.moveSpeed/L;Dy*=this.moveSpeed/L;
            }
            this.x+=Dx;this.y+=Dy;
        }
        if (this.spriteSize) {
            this.frame+=this.frameSpeed;
            if (this.frame>this.spriteSize){
                if(this.repeat)this.frame-=this.spriteSize;
                else this.frame=this.spriteSize-1;
            }
            var frame=Math.floor(this.frame);
            var image=this.parent.assets.Data.Images[id];
            var sw=this.spriteW;
            var sh=this.spriteH;
            var maxRow=Math.floor(image.width/sw);
            var sx=Math.floor(frame%maxRow)*sw;
            var sy=Math.floor(frame/maxRow)*sh;
            this.drawClipPic(id,this.x,this.y,parent.actorZoom,this.angle,sx,sy,sw,sh);
        }
        else this.drawPic(id,this.x,this.y,parent.actorZoom,this.angle);
    }
}

function resourcesManager(parent){
    this.parent=parent;
	this.funcCall=false;
	this.objCall=false;
	this.show=false;
	this.Data={
		Images:{},
		Files:{},
		Sounds:{}
	}
	this.queue={
		Images:[],
		Files:[],
		Sounds:[]
	}
	this.queueStart={
		Images:[],
		Files:[],
		Sounds:[]
	}
	this.fileCount=0;
	this.filesLoaded=0;
	
	this.queueEmpty=queueEmpty;function queueEmpty(src){
//		console.log(src+' '+this.queue.Images.length+' '+this.queue.Files.length+' '+this.queue.Sounds.length);
		if(this.queue.Images.length || this.queue.Files.length || this.queue.Sounds.length){if(src)console.log('resources loading pending, loading of "'+src+'" failed');return(false);}
		return(true);
	}
	
	this.LoadFile=LoadFile;function LoadFile(id,src){
		if(!this.queueEmpty(src))return(false);
		var str='';
  		var xmlHttp=new XMLHttpRequest();if (!xmlHttp){alert ("Your browser does not support AJAX!");return;}
		xmlHttp.manager=this;
  		xmlHttp.onreadystatechange=function(){
    		if(xmlHttp.readyState==4){
				var i;
				i=this.manager.queue.Files.indexOf(id);
				if(i>=0)this.manager.queue.Files.splice(i,1);
				i=this.manager.queueStart.Files.indexOf(id);
				if(i>=0)this.manager.queueStart.Files.splice(i,1);
				if(this.manager.Data.Files[id])this.manager.Data.Files[id]=null;
		        this.manager.Data.Files[id]=unescape(xmlHttp.responseText);
				this.manager.filesLoaded++;
		    }
		  }
		  xmlHttp.open("GET",src,true);
		  this.queueStart.Files.push(id);
		  xmlHttp.send(null);
	}
	
	
	this.LoadSound=LoadSound;function LoadSound(id,src_mp3,src_ogg){
		if(!this.queueEmpty(src_mp3))return(false);
		if(this.Data.Sounds[id])this.Data.Sounds[id]=null;
		this.Data.Sounds[id]=new Caudio();
		this.Data.Sounds[id].LoadSound(src_mp3,src_ogg);
		this.queueStart.Sounds.push(id);
	}
	
	this.LoadImage=LoadImage;function LoadImage(id,src){
		var i;
		if(!this.queueEmpty(src))return(false);
		if(this.Data.Images[id])this.Data.Images[id]=null;
		this.Data.Images[id]=new Image();
		this.Data.Images[id].loaded=false;
		this.Data.Images[id].manager=this;
		this.Data.Images[id].onload=function(){
			this.loaded=true;
			i=this.manager.queue.Images.indexOf(this.src);
			if(i>=0)this.manager.queue.Images.splice(i,1);
			i=this.manager.queueStart.Images.indexOf(this.src);
			if(i>=0)this.manager.queueStart.Images.splice(i,1);
			this.manager.filesLoaded++;
		}
		this.Data.Images[id].src=src;
		this.queueStart.Images.push(this.Data.Images[id].src);
	}
	
	this.Start=Start;function Start(functionCall,obj){
		var i;
		this.queue=this.queueStart;
		this.queueStart={
			Images:[],
			Files:[],
			Sounds:[]
		}
		this.funcCall=functionCall;
		this.objCall=obj;
		this.fileCount=this.queue.Images.length+this.queue.Sounds.length+this.queue.Files.length;
		this.filesLoaded=0;
		this.show=true;
	}
    
   	this.drawRotPic=drawRotPic;function drawRotPic(image,X,Y,zoom,angle,Px,Py,ctx,scale){
		if(!ctx)return;
        if (!image.tagName || image.tagName.toLowerCase()!='img') image=this.Data.Images[image];
		ctx.save();
		ctx.translate((X+Px)*scale,(Y+Py)*scale);
		ctx.rotate(angle);
		ctx.drawImage(image,-Px*scale,-Py*scale,image.width*scale*zoom,image.height*scale*zoom);
		ctx.restore();
	}

   	this.drawRotPicClip=drawRotPicClip;function drawRotPicClip(image,X,Y,zoom,angle,Px,Py,ctx,scale,sx,sy,swidth,sheight){
		if(!ctx)return;
        if (!image.tagName || image.tagName.toLowerCase()!='img') image=this.Data.Images[image];
		ctx.save();
		ctx.translate((X+Px)*scale,(Y+Py)*scale);
		ctx.rotate(angle);
		ctx.drawImage(image,sx,sy,swidth,sheight,-Px*scale,-Py*scale,swidth*scale*zoom,sheight*scale*zoom);
		ctx.restore();
	}
    
	this.drawPic=drawPic;function drawPic(image,X,Y,zoom,ctx,scale){
		if(!ctx)return;
        if (!image.tagName || image.tagName.toLowerCase()!='img') image=this.Data.Images[image];
		ctx.drawImage(image,X*scale,Y*scale,image.width*scale*zoom,image.height*scale*zoom);
	}

	this.drawPicClip=drawPicClip;function drawPicClip(image,X,Y,zoom,ctx,scale,sx,sy,swidth,sheight){
		if(!ctx)return;
        if (!image.tagName || image.tagName.toLowerCase()!='img') image=this.Data.Images[image];
        ctx.drawImage(image,sx,sy,swidth,sheight,X*scale,Y*scale,swidth*scale*zoom,sheight*scale*zoom);
	}
    
    this.drawLoading=drawLoading;function drawLoading(loaded,max){
        this.parent.ctx.clearRect(0,0,this.parent.canvas.width,this.parent.canvas.height);
        if (loaded<max) {
            this.parent.ctx.font="20px arial";
            //console.log("Loading "+(Math.round(loaded/max*100))+' %');
            this.parent.ctx.fillText("Loading "+(Math.round(loaded/max*100))+' %',10,50);
        }else{
            //console.log('Loading complete');
        }
    }

    this.log=log;function log(msg){
        console.log(msg);
    }

	this.Run=Run;function Run(){
		if(!this.show)return;
		var i;
		for(i=0;i<this.queue.Sounds.length;i++)if(this.Data.Sounds[this.queue.Sounds[i]].ready()){this.queue.Sounds.splice(i,1);i=0;this.filesLoaded++;}
		if(this.queueEmpty()){
			this.drawLoading(this.fileCount,this.fileCount);
			this.show=false;
			var func=eval(this.funcCall);
			if(!this.objCall)this.objCall=this;
			if(func)func.call(this.objCall);
			return;
		}
        //drawing the loading screen (should be on top of everything else, if stuff needs to pause while this is going, set a flag to mark that a load is in progress)
        this.drawLoading(this.filesLoaded,this.fileCount);
	}
}