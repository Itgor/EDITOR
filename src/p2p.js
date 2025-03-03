(function () {

	var stC1 = 0; stC2=0;
   
	var chatNew = document.getElementById("chatnew");
	var bodyIdP = document.getElementById("FON");
	var fList = document.getElementById("FILES_LIST");
	var vidPlayer = document.getElementById("videoBLOB");
	
	var mBlogTtl = document.getElementById("sBlogTitle");
	var mBlogCnt = document.getElementById("sBlogCnt");
	var btnBlog = document.getElementById("blogBTN");
	
	var recvId = document.getElementById("receiver-id2");
	
	var sendDTBTN = document.getElementById("sendDataBTN");
	
	var lastPeerId = null;
	var peer = null; // own peer object
	var conn = null;
	
	var recvIdInput = document.getElementById("receiver-id");
	var status = document.getElementById("status");
	var message = document.getElementById("mesChat");
	var goButton = document.getElementById("goButton");
	var resetButton = document.getElementById("resetButton");
	var fadeButton = document.getElementById("fadeButton");
	var offButton = document.getElementById("offButton");
	var sendMessageBox = document.getElementById("sendMessageBox");
		
	var sendDataButton = document.getElementById("sendButton");
	var clearMsgsButton = document.getElementById("clearMsgsButton");
	var connectButton = document.getElementById("connect-button");
	//var infG = document.getElementById("INF_G");
	
	var cueString = "<span class=\"cueMsg\">Cue: </span>";

	/**
	 * Create the Peer object for our end of the connection.
	 *
	 * Sets up callbacks that handle any events related to our
	 * peer object.
	 */
	 function initialize() {
		// Create own peer object with connection to shared PeerJS server
		peer = new Peer(null, {
			debug: 2
		});

		peer.on('open', function (id) {
			//testID.innerHTML+=id;
			// Workaround for peer.reconnect deleting previous id
			if (peer.id === null) {
				console.log('Received null id from peer open');
				peer.id = lastPeerId;
			} else {
				lastPeerId = peer.id;
			}

			console.log('ID: ' + peer.id);
			recvId.innerHTML = peer.id;
			userID.value = peer.id;
			status.innerHTML = "Awaiting connection...";
			loaderStatus(0);
			sesionID = peer.id;
			
			testID.innerHTML="Awaiting connection...";
		});
		peer.on('connection', function (c) {
			// Allow only a single connection
			if (conn && conn.open) {
				c.on('open', function() {
					c.send("Already connected to another client");
					setTimeout(function() { c.close(); }, 500);
				});
				return;
			}

			conn = c;
			console.log("Connected to: " + conn.peer);
			status.innerHTML = "Connected:"+conn.peer;
			ready();
			loaderStatus(1);
			onlineStatus = 1;
			
			var serverID = document.getElementById("server-id");
			var servName = serverID.innerHTML;
			ses_id = conn.peer;
			var appID = recvId.innerHTML;
			var conID = servName+"|"+conn.peer+"|"+appID;

			addServer(conID);
			conn.send("SERVID"+":"+conID);

			testID.innerHTML="Connected to: " + conn.peer;
		});					
		peer.on('disconnected', function () {
			status.innerHTML = "Connection lost. Please reconnect";
			console.log('Connection lost. Please reconnect');

			// Workaround for peer.reconnect deleting previous id
			peer.id = lastPeerId;
			peer._lastServerId = lastPeerId;
			peer.reconnect();
		});
		peer.on('close', function() {
			conn = null;
			status.innerHTML = "Connection destroyed. Please refresh";
			console.log('Connection destroyed');
		});
		peer.on('error', function (err) {
			console.log(err);
			//alert('Test Local connection: ' + err);
		});
	};
	
	


	
	 /** CLIENT
	 * Triggered once a connection has been achieved.
	 * Defines callbacks to handle incoming data and connection events.
	 */
	function ready() {
		conn.on('data', function (data) {
		
		testID.innerHTML="Connected: [Online] "+conn.peer;

		//loaderStatus(1); //Active logo
		onlineStatus = 1;
		
		//SPLIT 1
		var serXY = data.split(':');				
		var serF = serXY[0];
		var serX = serXY[1];
		var serY = serXY[2];
		
		var serX1 = serXY[3];
		var serY1 = serXY[4];
		
		var serZ1 = serXY[5];
		//stC=serZ1;
			
		if(serX1===undefined || serY1===undefined)
		{
		contX1=globalSX;
		contY1=globalSY;
		}
		else
		{
		contX1=serX1;
		contY1=serY1;
		globalSX=serX1
		globalSY=serY1;
		}

		//var stC=0;
		//if(contX1>xSL){stC="OK";}else{stC="BAD";}
		
		//P2P SIDE 2
		if(serF=="XYP")
		{
			var serverID = document.getElementById("server-id");
			var servName = serverID.innerHTML;
			servName = "RECEIVER";
			stC2=stC;
			if(stC1==0 || stC1===undefined){stC=serX; servName = "RECEIVER"+stC;}
			globalBLOC(serX1,serY1,stC,2);
			//localBLOC(serX1,serY1,stC);
			//conn.send("MSG"+":"+servName+" | "+stC);
			var infoXY1 = document.getElementById("keyXY1").innerHTML = "RECEIVER: "+stC+" | "+serX;			
		}
		
				
		if(serF=="KEY")
		{
			blueRect.style.marginLeft = serX + "px";
			blueRect.style.marginTop = serY + "px";
			globalBLOC(serX1,serY1,stC,2);
			//localBLOC(serX1,serY1,stC);
			conn.send("XYP"+":"+stC); //TEST REVERS POSITION FROM PEER
			var infoXY1 = document.getElementById("keyXY").innerHTML = "X PEER: "+serX+" Y PEER: "+serY+"<br>GX: "+serX1+" GY: "+serY1+"<br>KEY 1:"+stC;	
		}
		if(serF=="SERVID")
		{
			//ADD NEW USER IN DB
			var serverID = document.getElementById("server-id");
			var servName = serverID.innerHTML;
			ses_id = conn.peer;
			var conID = servName+"|"+serX+"|"+serY+"|"+peer.id;
			conn.send("SERVID"+":"+servName+"|"+serX+"|"+peer.id);
			testID.innerHTML="SERVER";
		}
		if(serF=="DOT")
		{
			blueRect.style.marginLeft = serX + "px";
			blueRect.style.marginTop = serY + "px";
			doCan("click",serX, serY,20,20, colorN, "container");
		}
		if(serF=="SCANOUT")
		{
			imageBASE64(serX);
		}
		
		if(serF=="VID")
		{
			var vidPlayer = document.getElementById("videoBLOB").style.display="block";
			linkBlob(serX);
		}
		
		if(serF=="FDATA")
		{
			//alert("FDATA READY OK: "+serY);					
			var base64String = serY;
			var decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
			alert("INCOMING FILE NAME: "+decodedString);
			//testID.innerHTML+="FDATA READY"+serY+"|"+decodedString;
			saveData(serX,decodedString);
		}
		
		

			console.log("Data recieved");
			var cueString = "<span class=\"cueMsg\">Cue: </span>";
			switch (data) {
				case 'Go':
					go();
					addMessage(cueString + data);
					break;
				case 'Fade':
					fade();
					addMessage(cueString + data);
					break;
				case 'Off':
					off();
					addMessage(cueString + data);
					break;
				case 'Reset':
					reset();
					addMessage(cueString + data);
					break;
				default:
				
				
				if(serF=="MSG")
				{
					if(opclP==0)
					{
						newMes = newMes + 1;
						chatNew.innerHTML = newMes+" <span style='font-size: 1.0em; color: #0066FF;'>&#9993</span>";
						soundClick("NEW_MSG");
					}
					else
					{
						newMes = 0;
						chatNew.innerHTML = "";
					}
					
					addMessage("<span class=\"peerMsg\">Peer:</span> " + serX);
				}

				
					//addMessage("<span class=\"peerMsg\">Peer: </span>" + data);
				break;
			};
		});
		conn.on('close', function () {
			status.innerHTML = "Connection reset<br>Awaiting connection...";
			//conn = null;
			loaderStatus(0);
			testID.innerHTML="Peer Offline: Connection reset. Awaiting connection...";
			//infG.style.display="none";
		});
	}
	
	

	
	
	/** SERVER CONNECT [7-8-9]
	 * Create the connection between the two Peers.
	 *
	 * Sets up callbacks that handle any events related to the
	 * connection and data received on it.
	 */
	function join() {
		
		testID.innerHTML="Create the connection between the two Peers";
	   
	   
		// Close old connection
		if (conn) {
		   //conn.close();
			testID.innerHTML="Connection closed...";
		}

		// Create connection to destination peer specified in the input field
		conn = peer.connect(recvIdInput.value, {
			reliable: true
		});
		
		//ADD NEW USER IN DB
		var serverID = document.getElementById("server-id");
		var servName = serverID.innerHTML;
		ses_id = peer.id;
	
	
	
		conn.on('open', function () {
			status.innerHTML = "Connected to: " + conn.peer;
			console.log("Connected to: " + conn.peer);

			//ses_id = conn.peer;
			loaderStatus(1);
			onlineStatus = 1;						
			
			testID.innerHTML="Connected to: " + conn.peer;
			//infG.style.display="block";
			
			//ADD NEW USER IN DB

			var serverID = document.getElementById("server-id");
			var servName = serverID.innerHTML;
			
			//var servNS = localStorage.setItem("server-id", servName);
			//var servNG = localStorage.getItem("server-id");

			var sesID = recvIdInput.value;
			var conID = servName+"|"+conn.peer;
			addServer(conID);
			

			// Check URL params for comamnds that should be sent immediately
			var command = getUrlParam("command");
			if (command)
				conn.send(command);
		});
		// Handle incoming data (messages only since this is the signal sender)
		conn.on('data', function (data) {
		
		
		//PARS
		var serXY = data.split(':');
		
		var serF = serXY[0];
		
		var serX = serXY[1]; 
		var serY = serXY[2]; 
		
		//globalSX = serX;
		//globalSY = serY;

		var serX1 = serXY[3];
		var serY1 = serXY[4];
		
		var serZ1 = serXY[5];
		//stC=serZ1;


		if(serX1===undefined || serY1===undefined)
		{
		contX2=globalSX;
		contY2=globalSY;
		}
		else
		{
		contX2=serX1;
		contY2=serY1;
		globalSX=serX1
		globalSY=serY1;
		}

		
		//var stC=0;
		//if(contX1>xSL){stC="OK1";}else{stC="BAD1";}
		
		//P2P SIDE 1
		if(serF=="XYP")
		{
			var serverID = document.getElementById("server-id");
			var servName = serverID.innerHTML;
			servName = "SENDER";
			stC1=stC;
			if(stC2==0 || stC2===undefined){stC=serX; servName = "SENDER"+stC;}
			globalBLOC(serX1,serY1,stC,1);
			//localBLOC (serX1,serY1,stC)
			//conn.send("MSG"+":"+servName+" | "+stC);
			var infoXY1 = document.getElementById("keyXY2").innerHTML = "SENDER: "+stC+" | "+serX;	
		}					
		
		if(serF=="KEY")
		{
			blueRect.style.marginLeft = serX + "px";
			blueRect.style.marginTop = serY + "px";	
			globalBLOC(serX1,serY1,stC,1);
			//localBLOC(serX1,serY1,stC);
			conn.send("XYP"+":"+stC); //TEST REVERS POSITION FROM PEER
			var infoXY2 = document.getElementById("keyXY").innerHTML = "X KEY: "+serX+" Y KEY: "+serY+"<br>GX "+serX1+" GY "+serY1+"<br>KEY 2:"+stC;
		}
		if(serF=="DOT")
		{
			blueRect.style.marginLeft = serX + "px";
			blueRect.style.marginTop = serY + "px";
			doCan("click",serX, serY,20,20, colorN, "container");
		}
		if(serF=="SCAN")
		{
			conn.send("SCANOUT"+":"+scanBUF);
		}
		if(serF=="SCANOUT")
		{
			imageBASE64(serX);
		}

		if(serF=="SERVID")
		{						
			testID.innerHTML="SERVER";						
			//ADD NEW USER IN DB
			var serverID = document.getElementById("server-id");
			var servName = serverID.innerHTML;
			var sesID = recvIdInput.value;
			var conID = servName+"|"+serX+"|"+serY+"|"+conn.peer;

			var nowSES = peer.id;						
		}
		
		if(serF=="MSG")
		{
			var chatCP = document.getElementById('CHAT_CP');
			chatCP.style.display='block';				
			var blogCP = document.getElementById('BLOG_CP');
			blogCP.style.display='none';					
			if(opclP==0)
			{
				newMes = newMes + 1;
				chatNew.innerHTML = newMes+" <span style='font-size: 1.0em; color: #0066FF;'>&#9993</span>";
				soundClick("NEW_MSG");
			}
			else
			{
				newMes = 0;
				chatNew.innerHTML = "";
			}						
			addMessage("<span class=\"peerMsg\">Peer:</span> " + serX);
		}
		
		if(serF=="FDATA")
		{
			var base64String = serY;
			var decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
			//testID.innerHTML+="FDATA join"+serY+"|"+decodedString;
			alert("INCOMING FILE: "+decodedString);
			saveData(serX,decodedString);
		}		


		});
		conn.on('close', function () {					
			testID.innerHTML="Connection closed";						
			status.innerHTML = "Connection closed";
			loaderStatus(0);
			onlineStatus = 0;
		});
	};

	/**
	 * Get first "GET style" parameter from href.
	 * This enables delivering an initial command upon page load.
	 *
	 * Would have been easier to use location.hash.
	 */
	function getUrlParam(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null)
			return null;
		else
			return results[1];
	};

	/**
	 * Send a signal via the peer connection and add it to the log.
	 * This will only occur if the connection is still alive.
	 */
	 function signal(sigName) {
		if (conn && conn.open) {
			conn.send(sigName);
			console.log(sigName + " signal sent");
			addMessage(cueString + sigName);
		} else {
			testID.innerHTML="Connection closed";
			console.log('Connection is closed');
		}
	}

	goButton.addEventListener('click', function () {
		signal("Go");
	});
	resetButton.addEventListener('click', function () {
		signal("Reset");
	});
	fadeButton.addEventListener('click', function () {
		signal("Fade");
	});
	offButton.addEventListener('click', function () {
		signal("Off");
	});

	
	

	//MESSAGE
	var cnvC=0;
	function addMessage(msg)
	{	
		var now = new Date();
		var h = now.getHours();
		var m = addZero(now.getMinutes());
		var s = addZero(now.getSeconds());

		if (h > 12)
			h -= 12;
		else if (h === 0)
			h = 12;

		function addZero(t) {
			if (t < 10)
				t = "0" + t;
			return t;
		};
		
		var msgTime = h + ":" + m + ":" + s;

		//var imageD = document.createElement('img');
		//imageD.src='';
		//imageS.alt = "Your text here";

		
		var aC1 = document.getElementsByTagName('div');
		var body=document.getElementsByTagName('body')[0];
		var newDivC1 = document.createElement('div');

		var firstDivC1=document.getElementById('mesChat');
		var firstElemC1=firstDivC1.getElementsByTagName('div')[0];
		
		var divNumC1 = aC1.length;
		cnvC=cnvC+1;
		
		newDivC1.className = 'range_box_layer';	
		newDivC1.id = divNumC1;
		newDivC1.style.backgroundColor = '#f8fffe';
		newDivC1.innerHTML = '<span onmouseover=altMsg(1,"'+msgTime+'");return false; onmouseout=altMsg(0,"");return false>'+msg+'<span href="#" onclick=removeLayer('+divNumC1+');return false style="dislpay:block;position:absolute;float:right;right:0;padding-right:4px">&#215;</span></span><div id="altMsg"></div>';
		firstDivC1.insertBefore(newDivC1,firstElemC1);
		//firstDivC1.appendChild(imageD);

		//var lnum=document.getElementById('lnum');
		//lnum.innerHTML = cnvC;	
	}
	

	/*
	function addMessageOFF(msg) {
		var now = new Date();
		var h = now.getHours();
		var m = addZero(now.getMinutes());
		var s = addZero(now.getSeconds());

		if (h > 12)
			h -= 12;
		else if (h === 0)
			h = 12;

		function addZero(t) {
			if (t < 10)
				t = "0" + t;
			return t;
		};

		message.innerHTML = "<br><span class=\"msg-time\">" + h + ":" + m + ":" + s + "</span>  -  " + msg + message.innerHTML;
		
	};
	*/

	function clearMessages() {
		message.innerHTML = "";
		addMessage("Msgs cleared");
	};

	
	//CONTROLS
	window.addEventListener("keydown", function () {
			var lp = parseInt(blueRectStyle.marginLeft); 
			var tp = parseInt(blueRectStyle.marginTop); 
			if (conn && conn.open) {
			conn.send("KEY"+":"+lp+":"+tp+":"+xSL+":"+ySL+":"+stC);
			//infG.style.display="block";
			}
	});

	bodyIdP.addEventListener('click', function () {
		if (conn && conn.open) 
		{
			conn.send("DOT"+":"+ex+":"+ey);
			//infG.style.display="block";
			if(liveSCN==1)
			{
				saveIt(4,0,0,0,0);
				conn.send("SCANOUT"+":"+scanBUF);
			}
		}else {
			testID.innerHTML="Connection closed";
			console.log('Connection is closed');
		}
	});

	fList.addEventListener('click', function () {
		if(nowPLay!=0)
		{
			vidPlayer.style.display="block";
			conn.send("VID"+":"+nowPLay);
			nowPLay=0;
		}
	});
	
	//Listen for enter in message box
	sendMessageBox.addEventListener('keypress', function (e) {
		var event = e || window.event;
		var char = event.which || event.keyCode;
		if (char == '13')
			sendButton.click();
	});
	
	//Send message
	sendButton.addEventListener('click', function () {
		if (conn && conn.open) {
			var msg = sendMessageBox.value;
			sendMessageBox.value = "";
			var serverID = document.getElementById("server-id");
			var servName = serverID.innerHTML;
			//var servNG = localStorage.getItem("server-id");						
			//if(servNG){servName=servNG;}
			
			var mesSTR = msg.replace(/:/g, '&#58;');
			if(msg!='')
			{
				conn.send("MSG"+":"+servName+" | "+mesSTR);
				console.log("Sent: " + msg);
				addMessage("<span class=\"selfMsg\">Self: </span> " + msg);
			}
		} else {
			testID.innerHTML="Connection closed";
			console.log('Connection is closed');
		}
	});
	
	//Send BLOG message
	btnBlog.addEventListener('click', function () {
		if (conn && conn.open) {
			var ttlBlog = mBlogTtl.value;
			var msgBlog = mBlogCnt.value;
			//msgBlog = msgBlog.replace(/;/g, '&#59;');
			
			if(ttlBlog!="" || msgBlog!="")
			{
				doBlogDIV(ttlBlog);
				newBLOG(ttlBlog,msgBlog);
			}
			else{
				//alert("Empty");
			}	
			
			mBlogTtl.value = "";
			mBlogCnt.value = "";
			
		} else {
			testID.innerHTML="Connection closed";
			console.log('Connection is closed');
		}
	});
	
	
	//Send Data file
	sendDTBTN.addEventListener('click', function () {
		if (conn && conn.open)
		{
			//File to base64 string
			var buff = new Buffer(dataSend,"utf8");
			var base64data = buff.toString('base64');						
			//File name to base64 string
			var buff2 = new Buffer(dataNameT);
			var base64data2 = buff2.toString('base64');						
			conn.send("FDATA"+":"+ base64data+":"+base64data2);
		} 
		else 
		{
			testID.innerHTML="Connection closed";
			console.log('Connection is closed');
		}
	});
	

	
	//setInterval(function() { alert(sesionID+"|"+peer.id); }, 2500);
	//setInterval(function() { if(sesionID!=peer.id){initialize(); join();} ; }, 2500);
	setInterval(function() 
	{ 
		var cncBTN = document.getElementById("cn_"+sesionID);
		if(sesionID!=peer.id)
		{  
			join(); sesionID=peer.id; 						
			cncBTN.style.backgroundColor = '#CBEBFF';
		}
		else{ 
			//cncBTN.style.backgroundColor = '#EBEBEB';
		} ; 
	}, 500);
	
	

	// Clear messages box
	clearMsgsButton.addEventListener('click', clearMessages);
	// Start peer connection on click
	connectButton.addEventListener('click', join);

	// Since all our callbacks are setup, start the process of obtaining an ID
	initialize();
})();