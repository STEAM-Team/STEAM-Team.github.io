	var //M=1, //set in index.html instead
		handlrot = 0,
		handrrot = 0,
		handerot = 0,

		__Centerx	= 480,
		__Centery	= 480,
		__Crot	 	= 0,
		__Crota	 	= -1.44,
		__HBx	 	= 30,
		__HBy	 	= -700,
		__Hdist	 	= 1174,
		__Lrot	 	= 0,
		__Lrota	 	= 2.5,
		__Larm1	 	= 120,
		__Larm2	 	= 860,
		__Rrot	 	= 0,
		__Rrota	 	= -3.6,
		__Rarm1	 	= 100,
		__Rarm2	 	= 1050,
		__Ext	 	= 75,
		__Erot	 	= 0,	// v2 variables !!!
		__Erota	 	= 0,
		__Earm	 	= 0,
			
		AM = Math.PI/180,
		CW, CH,
		
		handsX, handsY,
		H1X, H1Y, H2X, H2Y,
		H1arm1X, H1arm1Y, H2arm1X, H2arm1Y,
		DRX, DRY, DReX, DReY, DRaX, DRaY,
		
		FX, FY,
		
		LX, LY,
		FirstX, FirstY,
		firstPoint = true,
		
		freeze = false,
		totalLength = 0,
		
		brightness = 1,
		livespeed = 1,
		nolivespeed = 50,
		speed = nolivespeed,
		colormode = 0,
		livedisplay = false,
		variablewidth = true,
		
		notsornd = true,
		
		captioninvalid = true,
		invalidatecaption = false,
		
		cleandraw = false,
		canupload = false,
		
		cutpixels = true,
		
		baseoffsxmin = -300, baseoffsxmax = 300,
		baseoffsymin = -600, baseoffsymax = 0,
		handdistmin = 0, handdistmax = 800,
		
		end;

		
	// Drawing here...

	function scrollFunc(ev){
		if(window.pageYOffset>1200){
			console.log('User has scrolled at least 1100 px!');
		
			// start loop!
				$(window).bind("resize", onResize );
				setCleandraw( true );
				if( !parseHash() ) setFormValues();
				clr();
				window.raf = (function(){
					return 	window.requestAnimationFrame       ||
							window.webkitRequestAnimationFrame ||
							window.mozRequestAnimationFrame    ||
							function( callback ) {
								window.setTimeout( callback, 100/6 );
							};
				})();
				mainloop();
				//testtext();
				//UIreset();
			
					//reset();
					$("p.title").each(function() { replaceWithSVGText( $( this ), true, 6, 6  ); });
					replaceWithSVGText( $("#footer a"), true, 1, 1 );		
				
		}
		
	}
	window.onscroll = scrollFunc;
	
	
	var canvas = document.getElementById("theBitmap"),
		ctx = canvas.getContext("2d"),
		canvas2 = document.getElementById("theBitmapOverlay"),
		ctx2 = canvas2.getContext("2d"),
		canvas3 = document.getElementById("theBitmapTextOverlay"),
		ctx3 = canvas3.getContext("2d"),
		canvasb = document.getElementById("buffer"),
		ctxb = canvasb.getContext("2d"),
		W=960, H=960, bw = 480, bh = 480;
	
	canvas.width = W*M;
	canvas.height = H*M;
	canvas2.width = W*M;
	canvas2.height = H*M;
	canvas3.width = W*M;
	canvas3.height = H*M;
	canvasb.width = bw;
	canvasb.height = bh;
	canvasb.style.width = "240px";
	canvasb.style.height = "240px";

	function onResize() {

		var ch = window.innerHeight;
		if( CH == ch ) return;
		CH = ch; 
		if( CH < 480 ) CH = 480;
		if( CH < H ) {
			CW = W*(CH/H);
		} else {
			CH = H, CW = W;
		}
		canvas.style.width = CW+"px";
		canvas.style.height = CH+"px";
		canvas2.style.width = CW+"px";
		canvas2.style.height = CH+"px";
		canvas3.style.width = CW+"px";
		canvas3.style.height = CH+"px";
	
		$("#gallery").css( { top: CW+"px", "min-width": CH+"px" } );
		
	}
	onResize();
	//ctx2.scale(M, M);
	//ctx3.scale(M, M);
	ctx2.globalCompositeOperation = 'screen';
		
	function clr() {
		ctx.fillStyle = /*"#FFFFFF";*/ "transparent";
		ctx.fillRect(0,0,W*M,H*M);
		ctx.fillStyle = "transparent";
	}
	function alphafillcanvas( ctx, a ) {
		var imgd = ctx.getImageData(0, 0, W*M, H*M),
		    pix = imgd.data;
		
		for (var i = 0, n = pix.length; i <n; i += 4) {
			pix[i + 3] = pix[i + 3] * a;
		}
		
		ctx.putImageData(imgd, 0, 0);
	}

	function mainloop() {
		window.raf( mainloop );

		if( !freeze ) {
	 		clearmech();
	
			for( var i=0; i<speed; i++ ) {

				calc();
				
				draw();
				__Crot = doRot( __Crot, __Crota);
				__Lrot = doRot( __Lrot, __Lrota );
				__Rrot = doRot( __Rrot, __Rrota );
				__Erot = doRot( __Erot, __Erota );
				if( freeze ) break;
			}
			
			drawmech();
		}
		
		//setTimeout( mainloop, 16 );
	}
	function doRot( rot, rota ) {
		return (rot + rota + 360)%360;
	}
	function calc() {
		
		handsX = __Centerx + __HBx;
		handsY = __Centery + __HBy;
		
		H1X = handsX - __Hdist/2;
		H1Y = handsY;
		H2X = handsX + __Hdist/2;
		H2Y = handsY;

		H1arm1X = Math.cos( __Lrot*AM )*__Larm1 + H1X;
		H1arm1Y = Math.sin( __Lrot*AM )*__Larm1 + H1Y;
		
		H2arm1X = Math.cos( __Rrot*AM )*__Rarm1 + H2X;
		H2arm1Y = Math.sin( __Rrot*AM )*__Rarm1 + H2Y;
		
		
		var dx = H2arm1X-H1arm1X,
			dy = H2arm1Y-H1arm1Y,
			D = Math.sqrt( dx*dx + dy*dy ),
			
			gamma = Math.acos( (__Rarm2*__Rarm2 + __Larm2*__Larm2 - D*D)/(2*__Rarm2*__Larm2) ),
			alpha = Math.asin( __Rarm2/(D/Math.sin(gamma)) ),
			beta = Math.asin( __Larm2/(D/Math.sin(gamma)) ),
			delta = Math.asin( dy/D );
			
		if( __Larm2 > __Rarm2 ) {
			beta = Math.PI-alpha-gamma;
		} 
		if( __Rarm2 > __Larm2  ) {
			alpha = Math.PI-beta-gamma;
		} 
			
		var H1a = alpha+delta,
			H2a = Math.PI-(beta-delta),
			Exa = __Erot*AM;
			
		DRX = H1arm1X + Math.cos( H1a )*__Larm2;
		DRY = H1arm1Y + Math.sin( H1a )*__Larm2;

		DReX = H2arm1X + Math.cos( H2a )*(__Rarm2+__Ext);
		DReY = H2arm1Y + Math.sin( H2a )*(__Rarm2+__Ext);
		
		
		DRaX = DReX + Math.cos( H2a+Exa )*__Earm;
		DRaY = DReY + Math.sin( H2a+Exa )*__Earm;
		
		var nx = DRaX - __Centerx,
			ny = DRaY - __Centery,
			
			nd = Math.sqrt( nx*nx + ny*ny ),
			na;
			
		if( nd==0 ) {
			na = 0;
		} else {
			na = Math.asin( ny/nd );
		}
			
		if( nx<0 ) {
			na = Math.PI - na;
		}
		//console.log( na +" - "+ nd );
		
		na = na + AM*__Crot;
		
		noplot = ( nd>479 && cutpixels );
		if( noplot ) nd = 479;
		
		FX = __Centerx + Math.cos( na )*nd;
		FY = __Centery + Math.sin( na )*nd;
		
		precision = 10;
		if( firstPoint ) {
			FirstX = Math.floor(FX*precision);
			FirstY = Math.floor(FY*precision);
			firstPoint = false;
		} else if( Math.floor(FX*precision)==FirstX && Math.floor(FY*precision)==FirstY && totalLength>1 ) {
			freeze = true;
			console.log("totalLength: "+totalLength);
			//updatetext();
			if( totalLength>0 ) {
				//setUploadbtn( cleandraw );
				cleandraw = false;
			}

			//FirstX = FirstY = LX = LY = undefined;
		}
	}
	function clearmech() {
		
		if( livedisplay ) {
			//clr();
			
			ctx.strokeStyle="#000000";
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.lineCap="round";
			ctx.lineJoin="round";
			ctx.moveTo(H1X*M,H1Y*M);
			ctx.lineTo(H1arm1X*M,H1arm1Y*M);
			ctx.lineTo(DRX*M,DRY*M);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(H2X*M,H2Y*M);
			ctx.lineTo(H2arm1X*M,H2arm1Y*M);
			ctx.lineTo(DReX*M,DReY*M);
			ctx.lineTo(DRaX*M,DRaY*M);
			ctx.stroke();
			
		}
	}
	function drawmech() {
		
		if( livedisplay ) {
			
			if( speed < 10 ) {
				ctx.strokeStyle="#FFFFFF";
				ctx.lineWidth = 1*M;
				ctx.lineCap="round";
				ctx.lineJoin="round";
				ctx.beginPath();
				ctx.moveTo(H1X*M,H1Y*M);
				ctx.lineTo(H1arm1X*M,H1arm1Y*M);
				ctx.lineTo(DRX*M,DRY*M);
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(H2X*M,H2Y*M);
				ctx.lineTo(H2arm1X*M,H2arm1Y*M);
				ctx.lineTo(DReX*M,DReY*M);
				ctx.lineTo(DRaX*M,DRaY*M);
				ctx.stroke();
			
			}
			
				
			$("#theBitmapOverlay").css( { transform: "rotate(-"+__Crot+"deg)" } );
		}
	}
	
	/***********************************
	Mouse drawing on canvas 
	***********************************/
	//NEWLY ADDED
	function mouseDraw(){
		
		if (ofGetMousePressed()) {
			var mouseX = ofGetMouseX() - ofGetWidth() / 2;
			var mouseY = ofGetMouseY() - ofGetHeight() / 2;
			var pre_mouseX = ofGetPreviousMouseX() - ofGetWidth() / 2;
			var pre_mouseY = ofGetPreviousMouseY() - ofGetHeight() / 2;
			
			for (var i = 0; i < 360; i += angle_step) {
				ofRotate(angle_step);
				
				ofLine(ofVec2f(mouseX, mouseY), ofVec2f(pre_mouseX, pre_mouseY));
				ofLine(ofVec2f(-mouseX, mouseY), ofVec2f(-pre_mouseX, pre_mouseY));
			}
			console.log("mouseX = " + mouseX + " mouseY = " + mouseY);
		}			
	}
		
	
	
	/***********************************
	/endmousedrawing
	***********************************/	
	
	//Original 
	function draw() {
		
		var lw = 1;
		
		if( LX ) {
			var dx = FX-LX, dy = FY-LY, d = 2*Math.sqrt( dx*dx + dy*dy );
		} else {
			var d = 0;
		}
		if( variablewidth || colormode==3 || colormode==4 ) {
			var b = brightness<4?brightness:1;
			var dd = Math.sqrt( d/b )*1.8;
			if( dd>15 ) dd = 15;
			if( dd>0 ) lw = 15/dd;
			if( lw>5 ) lw = 5;
			if( lw<1 ) lw = 1;
			lw = lw/2;
		}
		
		switch( colormode ) {
			case 0:
				var col1 = Math.sin( AM*__Lrot )*127+127,
					col2 = Math.sin( AM*__Rrot )*127+127,
					R = Math.floor(col1),
					G = Math.floor((col1 + col2)/2),
					B = Math.floor(col2),
					A = ((col1 + col2)/256);
				if( A>1 ) A = 1;
				break;
			case 4:
				var col1 = Math.sin( AM*__Lrot + Math.PI*0.6666 )*127+127,
					col2 = Math.sin( AM*__Lrot + Math.PI*0.3333 )*127+127,
					col3 = Math.sin( AM*__Lrot )*127+127,
					col4 = Math.sin( AM*__Rrot + Math.PI*0.6666 )*127+127,
					col5 = Math.sin( AM*__Rrot + Math.PI*0.3333 )*127+127,
					col6 = Math.sin( AM*__Rrot )*127+127,
					//col4 = Math.cos( AM*__Rrot )*127+127,
					R = Math.floor( (col1 + col4)/2 );//*1.0 + col4*0.3 ),
					G = Math.floor( (col2 + col5)/2 );//*0.6 + col5*0.6 ),
					B = Math.floor( (col3 + col6)/2 );//*0.3 + col6*1.0 ),
					A = 1;	//((col1 + col2)/256);
				if( A>1 ) A = 1;
				break;
			case 1:
				var R = G = B = 255,
					A = Math.sin( AM*__Rrot*3 ) * Math.sin( AM*__Lrot*3 );
				break;
			case 2:
				var R = 255, G = 255, B = 0, A = 0.5;
				break;
			case 3:
				var B = Math.floor( 0+(lw-0.5)*128 );
				if( B>255 ) B = 255;
				//console.log( (10-d)/10 );
				var R = 255, G = 255 , A = (10-dd)/10;
				break;
		}
		
		//A /= 10;
		A /= ( brightness>3 ? 5*(brightness-2): 1 );
		
		if( LX ) {
			if( !noplot ) {
				ctx2.strokeStyle="rgba("+R+","+G+","+B+","+A+")";	//"#FFFF00";
				ctx2.lineWidth = lw;
				ctx2.beginPath();
				ctx2.moveTo(LX*M,LY*M);
				ctx2.lineTo(FX*M,FY*M);
				ctx2.stroke();
			}
			
			totalLength += d/2;
		
		} 
		LX = FX;
		LY = FY;

	}


	// Fonting here...
	
			function linearToPolar( c ) {
				var x = c.x, y = c.y, r, a;
				//var AM = 180/Math.PI;
				r = Math.sqrt( x*x + y*y );
				a = Math.asin( y/r )/AM;
				if( x<0 ) a = 180-a;
				a = (a+360)%360;
				return { r: r, a: a }
			}
			function polarToLinear( p ) {
				var r = p.r, a = p.a, x, y;
				//var AM = 180/Math.PI;
				a = ((a+360)%360)*AM;
				
				x = Math.cos( a )*r;
				y = -Math.sin( a )*r;
				
				return { x: x, y: y }
			}

			function fix2( v ) {
				return Math.round( 100*v )/100;
			}
			function fix6( v ) {
				return Math.round( 1000000*v )/1000000;
			}
			// -------------- FONT
			/*function getchardata( chr ) {
				var i=font[0].lastIndexOf( chr ),
					data=[];
				if( i>-1 ) {
					var chdata = font[2].split(" ")[i],
						l = 0;
					data[0] = Number(chdata.substr(0,1));
					for( var p=0,pi; p<chdata.length; p++ ) {
						pi = getindex( chdata.charCodeAt(p) );
						if( pi<0 ) data[++l] = [];
						else data[l].push( font[1].substr( pi ,2 ) );
					}
				} else data[0]=chr==" "?3:-1;
				return data;
			}*/
			function getindex( code ) {
				code-=65;
				code>25&&(code-=6);
				return code*2;
			}
			
			function makeText( txt, chs ) {
				var width,
					pos = 0,
					data = [0];
				chs = chs==undefined?1: chs;
				/*for( var i=0, cdata; i<txt.length; i++ ) {
					cdata = getchardata( txt.substr( i, 1 ) );
					if( cdata[0]>=0 ) {
						for(var l=1; l<cdata.length; l++ ) {
							for( var p=0, pt, line=[]; p<cdata[l].length; p++ ) {
								pt = cdata[l][p].split("");
								line.push( { x: Number(pt[0])+pos, y: Number(pt[1]) } );
							}
							data.push( line );
						}
						pos += chs+cdata[0];						
					}
				}*/
				if( pos>0 ) data[0] = pos-1;
				return data;
			}
			function renderSVGLinearText( tdata, textB, pixH, weight ) {
				var out = '<g class="text">',
					add = weight/2;
				if( add<0.5 ) add = 0.5;
					
				for( var i=1; i<tdata.length; i++ ) {				
					out += '<polyline fill="none" stroke="#444" stroke-width="'+weight+'" stroke-linecap="square" stroke-miterlimit="2"  points="';
					for( var p=0; p<tdata[i].length; p++ ) {
						out += (tdata[i][p].x*pixH+add) + " " + (textB-tdata[i][p].y*pixH+add) + " ";
					}
					out += '"/>';
				}				
				out += "</g>";
				return out;
			}
			function renderCanvasPrecisionPolarText( ctx, tdata, textB, pixH, plotAngle, sc, lw, sa, reversed ) {
				
				var angularLength = tdata[0]*plotAngle,		// angular length of the text
					ba = angularLength/2 + sa,				// base angle
					dir = reversed? -1: 1;
				//	out = '<g class="text">';
				ctx.strokeStyle="#333333";
				ctx.lineWidth = lw;
				ctx.lineCap="square";
				ctx.lineJoin="round";

					
				for( var i=1, first; i<tdata.length; i++ ) {
				//	out += '<polyline fill="none" stroke="#444" stroke-width="0.5" stroke-linecap="square" stroke-miterlimit="1"  points="';
					ctx.beginPath();
					first = true;
					
					for( var p=0, a, r, dot, dx, inc, lx, ly, x, y, mp=tdata[i].length; p<mp; p++ ) {
					
						x = tdata[i][p].x;
						y = tdata[i][p].y;
						if( p==0 ) { 
							lx = x;
							ly = y
							a = (-lx * plotAngle + ba)*dir;
							r = (ly-5)*dir * pixH + textB;
							dot = polarToLinear( { r: r, a: a } );
							//out += fix2(dot.x*sc) + " " +fix2(dot.y*sc) + " ";
							if( first ) {
								first = false;
								ctx.moveTo(dot.x*sc+480*M,dot.y*sc+480*M);
							} else {
								ctx.lineTo(dot.x*sc+480*M,dot.y*sc+480*M);
							}
						} else {
							dx = Math.abs( x-lx );
							if( dx==0 ) {
								dx=1;
							}
							ix = ( x-lx )/dx;
							iy = ( y-ly )/dx;
							for( var s=1, X, Y; s<=dx; s++ ) {
								Y = ly + iy*s;
								X = lx + ix*s;
								a = (-X * plotAngle + ba)*dir;
								r = (Y-5)*dir * pixH + textB;
								dot = polarToLinear( { r: r, a: a } );
								//out += fix2(dot.x*sc) + " " + fix2(dot.y*sc) + " ";
								if( first ) {
									first = false;
									ctx.moveTo(dot.x*sc+480*M,dot.y*sc+480*M);
								} else {
									ctx.lineTo(dot.x*sc+480*M,dot.y*sc+480*M);
								}
							}
							lx = x;
							ly = y;
						}
					}
					//out += '"/>';
					ctx.stroke();
				}				
				//out += "</g>";
			}
			
			function replaceWithSVGText( selection, upperCase, pixH, weight, chs  ) {
				pixH = pixH || 1;
				chs = chs==undefined? 2: chs;
				weight = weight || 1;
				
				var txt = selection.html();
				
				//if( upperCase ) txt = txt.toUpperCase();
					
				var tdata = makeText( txt, chs ),
					w = tdata[0]*pixH+weight,
					h = pixH*8+weight,
					out = renderSVGLinearText( tdata, pixH*8, pixH, weight );
				
				out = '<svg version="1.2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="'+w+'px" height="'+h+'px" viewBox="0 0 '+w+' '+h+'" xml:space="preserve">'+out+'</svg>';
				
				selection.html( out );
			}
	
	function testtext() {
				// text on wheel
				var tdata = makeText("generated with the * HTML SPIROGRAPH * by Abel Vincze 2016", 5);	//makeText("  * HTML SPIROGRAPH * Iparigrafika Ltd. (C) 2016 * HTML SPIROGRAPH * version 1.2 by Abel Vincze * HTML SPIROGRAPH *", 2),
					textH = 2*M;
					textB = 440*M,	// alapvonal 75%-nal
					plotAngle = 180/(textB*Math.PI/textH);
					
					
				renderCanvasPrecisionPolarText( ctx3, tdata, textB, textH, plotAngle, 1, 1.5*M, 89 );

				tdata = makeText("Dist 400 - Arm1 50 - Arm2 400 - rot 30 - rota 0.0013 - Arm1 50 - Arm2 400 - rot 30 - rota 0.0013 - Rot 1.232 RPM", 2),
				textH = 1.5*M;
				textB = 440*M,	// alapvonal 75%-nal
				plotAngle = 180/(textB*Math.PI/textH);
					
				renderCanvasPrecisionPolarText( ctx3, tdata, textB, textH, plotAngle, 1, 1*M, -90 );

	}
	function updatetext() {
		captioninvalid = false;
		invalidatecaption = false;
		alphafillcanvas( ctx3, 0 );
		
				testtext()
				
				tdata = makeText(	"C "+fix6(__Crota*10)+
									" RPM   OX "+fix6(__HBx)+
									"   OY "+fix2(__HBy)+
									"   HDist "+fix2(__Hdist)+
									"   L "+fix6(__Lrota*10)+
									" RPM   OA "+fix2(handlrot)+
									" Deg   L1 "+fix2(__Larm1)+
									"   L2 "+fix2(__Larm2)+
									"   R "+fix6(__Rrota*10)+
									" RPM   R1 "+fix2(__Rarm1)+
									"   R2 "+fix2(__Rarm2)+
									"   Ext "+fix2(__Ext)+
									"   Total Length "+(Math.round( totalLength ))+" px = "+friendlylength( totalLength/39.37 )
									
								, 2),
				textH = 1.5*M;
				textB = 440*M,	// alapvonal 75%-nal
				plotAngle = 180/(textB*Math.PI/textH);
					
				renderCanvasPrecisionPolarText( ctx3, tdata, textB, textH, plotAngle, 1, 1.5*M, 90, true );
		
	}
		function friendlylength( cm ) {
			if( cm/(100*1000)>1 ) {
				return (Math.round( cm/(1000) )/100) +" km";
			}
			if( cm/(100)>1 ) {
				return (Math.round( cm )/100) +" m";
			}
			return (Math.round( cm*100 )/100) +" cm";
		}
	

	function redraw() {
		setCleandraw( true );
		alphafillcanvas( ctx2, 0 );
		reset();
	}	
	function reset() {
				alphafillcanvas( ctx3, 0 );
				testtext();
				
				clearmech();
				__Crot = 0;
				__Lrot = handlrot;
				__Rrot = handrrot;
				__Erot = handerot;
				drawmech();
				
				$("#theBitmapOverlay").css( { transform: "none" } );

				totalLength = 0;
				firstPoint = true;
				LX = LY = undefined;
				freeze = false;
	}
		function setCleandraw( clean ) {
			cleandraw = clean;
		}


		function imageresize( sctx, dctx ) {
			var simgd = sctx.getImageData(0, 0, W*M, H*M),
			    spix = simgd.data,
			    WW = simgd.width,
			    HH = simgd.height,
			    dimgd = dctx.createImageData(bw, bh),
				dpix = dimgd.data,
				pw = Math.ceil( (W*M)/bw ),
				ph = Math.ceil( (H*M)/bh ),
				m = 1.3/(pw*ph);
				
				
			for (var y = 0, x, r, g, b, a, sy, sx, sa; y<bh; y++) {
				for ( x = 0; x<bw; x++) {
					di = 4*(bw*y+x);
					r = g = b = a = 0;
					for( sy = 0; sy<ph; sy++ ) { 
						for( sx = 0; sx<pw; sx++ ) {
							si = (x*pw+sx + (y*ph+sy)*W*M)*4;
							sa = spix[ si+3 ]/255;
							
							r += spix[ si+0 ]*sa;
							g += spix[ si+1 ]*sa;
							b += spix[ si+2 ]*sa;
							
						
						}
						
					}
					dpix[ di+0 ] = r*m;
					dpix[ di+1 ] = g*m;
					dpix[ di+2 ] = b*m;
					dpix[ di+3 ] = 255; //a*m*1.2;
				}
			}
			
			
			
			dctx.putImageData(dimgd, 0, 0);
		}
		


		function randomizer( type ) {
			var tolerance = 20;
			
			
			if( type == 3 ) {
				var Cr, Lr, Rr, rm;
				
				rm = Math.random()*5;
				
				Cr = Math.ceil( Math.random()*10 );
				var crmmax = Math.floor( 50/Cr );
				var crm = crmmax+1-Math.ceil( Math.sqrt( Math.random()*(crmmax*crmmax) ) );
				var add = 0;
					console.log("crm: "+crm);
				if( crm<4 ) {
					add = 1/Math.ceil( Math.random()*(4-crm)*2 );
					console.log("---add: "+add);
				}
				Lr = Cr*(crm+add);
				
				Rr = 1/(Math.ceil( Math.random()*32)*(rm==1?10:1) );

				__Crota = Cr/10*(Math.random()<0.5?-1:1);
				__Lrota = Lr/10*(Math.random()<0.5?-1:1);	
				__Rrota = Rr/10*(Math.random()<0.5?-1:1);
				
				if( Math.random()<0.3 ) {
					var t = __Crota;
					__Crota = __Lrota;
					__Lrota = t;
				}
				
			} else {
				__Crota = randomRPM( type, true );
				__Lrota = randomRPM( type, false );	
				__Rrota = randomRPM( type, false );
			}
			handlrot = Math.floor( Math.random()*360 );


			__HBx = Math.round( Math.random()*200-100 );
			__HBy = Math.round( Math.random()*350-500 );
			__Larm1 = Math.round( Math.sqrt(Math.random())*150 );
			__Rarm1 = Math.round( Math.sqrt(Math.random())*150 );
			
			var mind = __Larm1+__Rarm1 + 50 + tolerance,
				corr = (100-__HBy);
			if( corr<mind ) corr=mind;
			__Hdist = Math.round(Math.sqrt(Math.random())*(corr-mind)+mind);
			var minl = (__Larm1+__Rarm1+__Hdist + tolerance)/2,
				maxd = __Hdist - (__Larm1 + __Rarm1) - tolerance,
				arm = Math.round( minl+( Math.random()*(100) ) ),
				d = Math.round( Math.random()*maxd );
			
			__Larm2 = arm;
			__Rarm2 = fixrightarm2( arm + d );

			if( type == 3 && __Larm2 > __Larm1 && Math.random()<0.5 ) {
				var t = __Rrota;
				__Rrota = __Lrota;
				__Lrota = t;
			}


			__Ext = Math.round( Math.random()*100 );
			

			setCleandraw( true );
			redraw();
			setFormValues();
		
		}
		function randomRPM( type, main ) {
			// eloszoris ketfele: 0-1 kozott tort ertek.
			// valamint 1-5 kozott gyors ertek..
			var r, rd, m = [ 1, 10, 1, 1 ][type];
			console.log( "---" );
			console.log( m );
			if( main ) m *= 10;
			
			if( type==2 ) {
				if( Math.random()<0.4 ) { r = (1/Math.ceil( Math.random()*10 ))/10*(Math.random()>0.5?-1:1); }
				else { r = (Math.ceil( Math.random()*5 ) * Math.ceil( Math.random()*20-10 ))/10; }
			} else {
				if( Math.random()<0.2 && type>0 ) { r = (1/Math.ceil( Math.random()*10 ))/1*(Math.random()>0.5?-1:1); }
				else { r = Math.floor( (Math.random()*10-5)*m ) / m; }
			}
			console.log( r );
			return r;
		}
	function setFormValues() {
		
		$("#livedraw").prop("checked", livedisplay==true );
		$("#acceleration").val( fix6( speed ) );
		$("#rotorRPM").val( fix6( __Crota*10 ) );
		$("#baseoffsx").val( fix6( __HBx ) );
		$("#baseoffsy").val( fix6( __HBy ) );
		$("#handdist").val( fix6( __Hdist ) );

		$("#lrpm").val( fix6( __Lrota*10 ) );
		$("#larma").val( fix6( handlrot ) );
		$("#larm1").val( fix6( __Larm1 ) );
		$("#larm2").val( fix6( __Larm2 ) );

		$("#rrpm").val( fix6( __Rrota*10 ) );
		$("#rarm1").val( fix6( __Rarm1 ) );
		$("#rarm2").val( fix6( __Rarm2 ) );
		$("#rarmext").val( fix6( __Ext ) );
		
		
		$("#cutpixels").prop("checked", cutpixels==true );

		$("#brgbtn"+(brightness-1)).addClass("selected");
		$("#colbtn"+colormode).addClass("selected");
		
		updateHash();
	}


		var shift = false,
			alt = false;

		
		function livedrawChange () {
			livedisplay = !!$("#livedraw:checked").val();
			if( !livedisplay ) {
				$("#theBitmapOverlay").css( { transform: "none" } );
				clr();
				livespeed = speed;
				if( livespeed > nolivespeed ) nolivespeed = livespeed;
				speed = nolivespeed;
			} else {
				nolivespeed = speed;
				if( nolivespeed < livespeed ) livespeed = nolivespeed;
				speed = livespeed;
				if( freeze ) {
					drawmech();
				}
			}
			$("#acceleration").val( fix6( speed ) );

		}
		function cutpixelsChange () {
			cutpixels = !!$("#cutpixels:checked").val();
			setCleandraw( false );
			if( alt ) redraw();
		}
		
			function fixInput( v, setFN, def, min, max, integer ) {
				if( isNaN( v ) ) v = def;
				if( min != undefined && v<min ) v=min;
				else if( max != undefined && v>max ) v=max;
				if( integer ) v = Math.round( v );
				setFN( v );
				return v;
			}

		function rotorRPMchange() {
			__Crota = fixInput( Number( $("#rotorRPM").val() ), rotorRPMset, __Crota*10, -50, 50 ) /10;
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function rotorRPMset( v ) {
			$("#rotorRPM").val( fix6( v ) );
		}
		function accelerationchange() {
			speed = fixInput( Number( $("#acceleration").val() ), accelerationset, speed, 0, 5000, true );
			//firstPoint = true;
		}
		function accelerationset( v ) {
			$("#acceleration").val( v );
		}
		
		function baseoffsxchange() {
			__HBx = fixInput( Number( $("#baseoffsx").val() ), baseoffsxset, __HBx, baseoffsxmin, baseoffsxmax );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function baseoffsxset( v ) {
			$("#baseoffsx").val( fix6( v ) );
			
		}
		
		function baseoffsychange() {
			__HBy = fixInput( Number( $("#baseoffsy").val() ), baseoffsyset, __HBy, baseoffsymin, baseoffsymax );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function baseoffsyset( v ) {
			$("#baseoffsy").val( fix6( v ) );
		}
		
		function handdistchange() {
			dist = fixInput( Number( $("#handdist").val() ), handdistset, __Hdist, handdistmin, handdistmax );
			__Hdist = fixdist( dist );
			if( __Hdist != dist ) handdistset( __Hdist );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function handdistset( v ) {
			$("#handdist").val( fix6( v ) );
		}

		function lrpmchange() {
			__Lrota = fixInput( Number( $("#lrpm").val() ), lrpmset, __Lrota*10, -50, 50 ) /10;
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function lrpmset( v ) {
			$("#lrpm").val( fix6( v ) );
		}
		function rrpmchange() {
			__Rrota = fixInput( Number( $("#rrpm").val() ), rrpmset, __Rrota*10, -50, 50 ) /10;
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function rrpmset( v ) {
			$("#rrpm").val( fix6( v ) );
		}

		function larm1change() {
			dist = fixInput( Number( $("#larm1").val() ), larm1set, __Larm1, 0, 1000 );
			__Larm1 = fixleftarm1( dist );
			if( __Larm1 != dist ) larm1set( __Larm1 );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function larm1set( v ) {
			$("#larm1").val( fix6( v ) );
		}
		function larmachange() {
			dist = Math.round( fixInput( Number( $("#larma").val() ), larmaset, handlrot, -360, 360 ));
			handlrot = (dist+360)%360;
			if( handlrot != dist ) larmaset( handlrot );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function larmaset( v ) {
			$("#larma").val( fix6( v ) );
		}
		function larm2change() {
			dist = fixInput( Number( $("#larm2").val() ), larm2set, __Larm2, 0, 1000 );
			__Larm2 = fixleftarm2( dist );
			if( __Larm2 != dist ) larm2set( __Larm2 );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function larm2set( v ) {
			$("#larm2").val( fix6( v ) );
		}

		function rarm1change() {
			dist = fixInput( Number( $("#rarm1").val() ), rarm1set, __Rarm1, 0, 1000 );
			__Rarm1 = fixrightarm1( dist );
			if( __Rarm1 != dist ) rarm1set( __Rarm1 );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function rarm1set( v ) {
			$("#rarm1").val( fix6( v ) );
		}
		function rarm2change() {
			dist = fixInput( Number( $("#rarm2").val() ), rarm2set, __Rarm2, 0, 1000 );
			__Rarm2 = fixrightarm2( dist );
			if( __Rarm2 != dist ) rarm2set( __Rarm2 );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function rarm2set( v ) {
			$("#rarm2").val( fix6( v ) );
		}

		function rarmextchange() {
			__Ext = fixInput( Number( $("#rarmext").val() ), rarmextset, __Ext, 0, 1000 );
			firstPoint = true;
			setCleandraw( false );
			if( alt ) redraw();
		}
		function rarmextset( v ) {
			$("#rarmext").val( fix6( v ) );
		}
	
		var tolerance=2;
		function fixdist( d ) {
			var maxd = (__Larm2 + __Rarm2) - (__Larm1 + __Rarm1) -tolerance,
				mind = (__Larm1 + __Rarm1) + Math.abs(__Larm2 - __Rarm2) +tolerance;
			if( d>maxd ) d = maxd;
			if( d<mind ) d = mind;
			
			return d;
		}
		function fixleftarm1( d ) {
			var maxd = (__Larm2 + __Rarm2) - (__Hdist + __Rarm1) - tolerance,
				maxd2 = __Hdist - (__Rarm1 + Math.abs(__Larm2 - __Rarm2)) -tolerance,
				mind = __Hdist - (__Larm2 + __Rarm2 + __Rarm1) +tolerance;
			maxd = ( maxd<maxd2? maxd: maxd2 );
			if( d>maxd ) d = maxd;
			if( d<mind ) d = mind;
			
			return d;
		}
		function fixleftarm2( d ) {
			var maxd = __Hdist - (__Larm1 + __Rarm1) + __Rarm2 -tolerance,
				mind = __Rarm2 - (__Hdist - (__Larm1 + __Rarm1)) +tolerance,
				mind2 = (__Hdist + __Larm1 + __Rarm1 ) - __Rarm2 +tolerance;
			mind = ( mind>mind2? mind: mind2 );
			if( d>maxd ) d = maxd;
			if( d<mind ) d = mind;
			
			return d;
		}
		function fixrightarm1( d ) {
			var maxd = (__Larm2 + __Rarm2) - (__Hdist + __Larm1) - tolerance,
				maxd2 = __Hdist - (__Larm1 + Math.abs(__Larm2 - __Rarm2)) -tolerance,
				mind = __Hdist - (__Larm2 + __Rarm2 + __Larm1) +tolerance;
			maxd = ( maxd<maxd2? maxd: maxd2 );
			if( d>maxd ) d = maxd;
			if( d<mind ) d = mind;
			
			return d;
		}
		function fixrightarm2( d ) {
			var maxd = __Hdist - (__Larm1 + __Rarm1) + __Larm2 -tolerance,
				mind = __Larm2 - (__Hdist - (__Larm1 + __Rarm1)) +tolerance,
				mind2 = (__Hdist + __Larm1 + __Rarm1 ) - __Larm2 +tolerance;
			mind = ( mind>mind2? mind: mind2 );
			if( d>maxd ) d = maxd;
			if( d<mind ) d = mind;
			
			return d;
		}

			function parseHash( h, go ) {
				h = h || location.hash;
				/*if( !h ) h="#200,200,100,6,1,0,0,4,1,8,2,4,27,-90,0,0,16,4,4,27,-60,1,1,12,1,12,20,-60,2,0,60,5,12,20,0,0,0,2,-563";*/
				if( h ) {
					var t = h.substr( 1 ),
						CRC=0,
						CRC2=0;
						
					//if( t=="clear" ) return false;
						
					t = t.split(",");
					
					for( var i=0; i<t.length-1; i++ ) {
						CRC += Number(t[i]);
						CRC2 = Math.sin( Number(t[i]) )*100-CRC2;
					}
					if( t[i]!=Math.ceil(CRC%800+CRC2*2) ) {
						updateHash();
						return false;	// Wrong CRC
					}

					var i=0, 
						gs,
						g = function() {
							return Number(t[i++]);
						};
					if( go ) { 
						g();
						g();
					} else {	
						livedisplay = (g()==1);
						speed = g();
					}
					$("#colbtn"+colormode).removeClass("selected");	//Ugly bwheehh:(
					$("#brgbtn"+(brightness-1)).removeClass("selected");

					colormode = g();
					cutpixels = (g()==1);
					brightness = g();
						
					__Crota = g();
					__HBx = g();
					__HBy = g();
					__Hdist = g();
					__Lrota = g();
					__Larm1 = g();
					__Larm2 = g();
					__Rrota = g();
					__Rarm1 = g();
					__Rarm2 = g();
					__Ext = g();
					handlrot = g();
					
					console.log( "hash parsed successfully" );
					
					setFormValues();

					if( go ) {
						setCleandraw( cleandraw );
						if( alt ) { redraw(); } else { reset(); }
					}
					
					return true;
				}	//*/
				return false;
			}
			function updateHash() {
				var h  = "",
					S=",",
					CRC=0,
					CRC2=0,
					g = function( n ) {
						h += n+S;
						CRC += Number(n);
						CRC2 = Math.sin( Number(n) )*100-CRC2;
					};
				g(livedisplay?1:0);
				g(speed);
				g(colormode);
				g(cutpixels?1:0);
				g(brightness);

				g(__Crota);
				g(__HBx);
				g(__HBy);
				g(__Hdist);
				g(__Lrota);
				g(__Larm1);
				g(__Larm2);
				g(__Rrota);
				g(__Rarm1);
				g(__Rarm2);
				g(__Ext);
				g(handlrot);	// for future use
				g(0);
				g(1);	// version
				h+=Math.ceil(CRC%800+CRC2*2);
				location.hash = "#"+h;
			}
			function onHashChange( e ) {
				parseHash();
				redraw();
			}
		
/*	
	$( function() {
		
	// start loop!
		$(window).bind("resize", onResize );
		setCleandraw( true );
		if( !parseHash() ) setFormValues();
		clr();
		window.raf = (function(){
			return 	window.requestAnimationFrame       ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame    ||
					function( callback ) {
						window.setTimeout( callback, 100/6 );
					};
		})();
		mainloop();
		//testtext();
		//UIreset();
	
			//reset();
			$("p.title").each(function() { replaceWithSVGText( $( this ), true, 6, 6  ); });
			replaceWithSVGText( $("#footer a"), true, 1, 1 );
	} );
	*/
