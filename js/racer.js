/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {

  var startTime = Date.now(), prevTime = startTime;
  var ms = 0, msMin = 1000, msMax = 0;
  var fps = 0, fpsMin = 1000, fpsMax = 0;
  var frames = 0, mode = 0;mode
  var container = document.createElement( 'div' );
  container.id = 'stats';
  container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ) }, false );
  container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

  var fpsDiv = document.createElement( 'div' );
  fpsDiv.id = 'fps';
  fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
  container.appendChild( fpsDiv );

  var fpsText = document.createElement( 'div' );
  fpsText.id = 'fpsText';
  fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  fpsText.innerHTML = 'FPS';
  fpsDiv.appendChild( fpsText );

  var fpsGraph = document.createElement( 'div' );
  fpsGraph.id = 'fpsGraph';
  fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
  fpsDiv.appendChild( fpsGraph );

  while ( fpsGraph.children.length < 74 ) {

    var bar = document.createElement( 'span' );
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
    fpsGraph.appendChild( bar );

  }

  var msDiv = document.createElement( 'div' );
  msDiv.id = 'ms';
  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
  container.appendChild( msDiv );

  var msText = document.createElement( 'div' );
  msText.id = 'msText';
  msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  msText.innerHTML = 'MS';
  msDiv.appendChild( msText );

  var msGraph = document.createElement( 'div' );
  msGraph.id = 'msGraph';
  msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
  msDiv.appendChild( msGraph );

  while ( msGraph.children.length < 74 ) {

    var bar = document.createElement( 'span' );
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
    msGraph.appendChild( bar );

  }

  var setMode = function ( value ) {

    mode = value;

    switch ( mode ) {

      case 0:
        fpsDiv.style.display = 'block';
        msDiv.style.display = 'none';
        break;
      case 1:
        fpsDiv.style.display = 'none';
        msDiv.style.display = 'block';
        break;
    }

  }

  var updateGraph = function ( dom, value ) {

    var child = dom.appendChild( dom.firstChild );
    child.style.height = value + 'px';

  }

  return {

    domElement: container,

    setMode: setMode,

    current: function() { return fps; },

    begin: function () {

      startTime = Date.now();

    },

    end: function () {

      var time = Date.now();

      ms = time - startTime;
      msMin = Math.min( msMin, ms );
      msMax = Math.max( msMax, ms );

      msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
      updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );

      frames ++;

      if ( time > prevTime + 1000 ) {

        fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
        fpsMin = Math.min( fpsMin, fps );
        fpsMax = Math.max( fpsMax, fps );

        fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
        updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

        prevTime = time;
        frames = 0;

      }

      return time;

    },

    update: function () {

      startTime = this.end();

    }

  }

};



//=========================================================================
// minimalist DOM helpers
//=========================================================================

var Dom = {

  get:  function(id)                     { return ((id instanceof HTMLElement) || (id === document)) ? id : document.getElementById(id); },
  set:  function(id, html)               { Dom.get(id).innerHTML = html;                        },
  on:   function(ele, type, fn, capture) { Dom.get(ele).addEventListener(type, fn, capture);    },
  un:   function(ele, type, fn, capture) { Dom.get(ele).removeEventListener(type, fn, capture); },
  show: function(ele, type)              { Dom.get(ele).style.display = (type || 'block');      },
  blur: function(ev)                     { ev.target.blur();                                    },

  addClassName:    function(ele, name)     { Dom.toggleClassName(ele, name, true);  },
  removeClassName: function(ele, name)     { Dom.toggleClassName(ele, name, false); },
  toggleClassName: function(ele, name, on) {
    ele = Dom.get(ele);
    var classes = ele.className.split(' ');
    var n = classes.indexOf(name);
    on = (typeof on == 'undefined') ? (n < 0) : on;
    if (on && (n < 0))
      classes.push(name);
    else if (!on && (n >= 0))
      classes.splice(n, 1);
    ele.className = classes.join(' ');
  },

  storage: window.localStorage || {}

}

//=========================================================================
// general purpose helpers (mostly math)
//=========================================================================

var Util = {
  shuffle: function(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a;
  },
  timestamp:        function()                  { return new Date().getTime();                                    },
  toInt:            function(obj, def)          { if (obj !== null) { var x = parseInt(obj, 10); if (!isNaN(x)) return x; } return Util.toInt(def, 0); },
  toFloat:          function(obj, def)          { if (obj !== null) { var x = parseFloat(obj);   if (!isNaN(x)) return x; } return Util.toFloat(def, 0.0); },
  limit:            function(value, min, max)   { return Math.max(min, Math.min(value, max));                     },
  randomInt:        function(min, max)          { return Math.round(Util.interpolate(min, max, Math.random()));   },
  randomChoice:     function(options)           { return options[Util.randomInt(0, options.length-1)];            },
  percentRemaining: function(n, total)          { return (n%total)/total;                                         },
  accelerate:       function(v, accel, dt)      { return v + (accel * dt);                                        },
  interpolate:      function(a,b,percent)       { return a + (b-a)*percent                                        },
  easeIn:           function(a,b,percent)       { return a + (b-a)*Math.pow(percent,2);                           },
  easeOut:          function(a,b,percent)       { return a + (b-a)*(1-Math.pow(1-percent,2));                     },
  easeInOut:        function(a,b,percent)       { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);        },
  exponentialFog:   function(distance, density) { return 1 / (Math.pow(Math.E, (distance * distance * density))); },

  increase:  function(start, increment, max) { // with looping
    var result = start + increment;
    while (result >= max)
      result -= max;
    while (result < 0)
      result += max;
    return result;
  },

  project: function(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x     = (p.world.x || 0) - cameraX;
    p.camera.y     = (p.world.y || 0) - cameraY;
    p.camera.z     = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth/p.camera.z;
    p.screen.x     = Math.round((width/2)  + (p.screen.scale * p.camera.x  * width/2));
    p.screen.y     = Math.round((height/2) - (p.screen.scale * p.camera.y  * height/2));
    p.screen.w     = Math.round(             (p.screen.scale * roadWidth   * width/2));
  },

  overlap: function(x1, w1, x2, w2, percent) {
    var half = (percent || 1)/2;
    var min1 = x1 - (w1*half);
    var max1 = x1 + (w1*half);
    var min2 = x2 - (w2*half);
    var max2 = x2 + (w2*half);
    return ! ((max1 < min2) || (min1 > max2));
  }

}

//=========================================================================
// POLYFILL for requestAnimationFrame
//=========================================================================

if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
                                 window.mozRequestAnimationFrame    ||
                                 window.oRequestAnimationFrame      ||
                                 window.msRequestAnimationFrame     ||
                                 function(callback, element) {
                                   window.setTimeout(callback, 1000 / 60);
                                 }
}

//=========================================================================
// GAME LOOP helpers
//=========================================================================

var Game = {  // a modified version of the game loop from my previous boulderdash game - see http://codeincomplete.com/posts/2011/10/25/javascript_boulderdash/#gameloop
  stagelist: [1,2,3],
  init: function () {
  },
  run: function(options) {

    Game.loadImages(options.images, function(images) {

      options.ready(images); // tell caller to initialize itself because images are loaded and we're ready to rumble

      Game.setKeyListener(options.keys);

      var canvas = options.canvas,    // canvas render target is provided by caller
          update = options.update,    // method to update game logic is provided by caller
          render = options.render,    // method to render the game is provided by caller
          step   = options.step,      // fixed frame step (1/fps) is specified by caller
          stats  = options.stats,     // stats instance is provided by caller
          now    = null,
          last   = Util.timestamp(),
          dt     = 0,
          gdt    = 0;

      function frame() {
        now = Util.timestamp();
        dt  = Math.min(1, (now - last) / 1000); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        gdt = gdt + dt;
        while (gdt > step) {
          gdt = gdt - step;
          update(step);
        }
        render();
        stats.update();
        last = now;
        requestAnimationFrame(frame, canvas);
      }
      frame(); // lets get this party started
      Game.playMusic();
    });
  },

  //---------------------------------------------------------------------------

  loadImages: function(names, callback) { // load multiple images and callback when ALL images have loaded
    var result = [];
    var count  = names.length;

    var onload = function() {
      if (--count == 0)
        callback(result);
    };

    for(var n = 0 ; n < names.length ; n++) {
      var name = names[n];
      result[n] = document.createElement('img');
      Dom.on(result[n], 'load', onload);
      result[n].src = "images/" + name + ".png";
    }
  },

  //---------------------------------------------------------------------------

  setKeyListener: function(keys) {
    var onkey = function(keyCode, mode) {
      var n, k;
      for(n = 0 ; n < keys.length ; n++) {
        k = keys[n];
        k.mode = k.mode || 'up';
        if ((k.key == keyCode) || (k.keys && (k.keys.indexOf(keyCode) >= 0))) {
          if (k.mode == mode) {
            k.action.call();
          }
        }
      }
    };
    var press = function(ev) { onkey(ev.keyCode, 'down');};
    var release = function (ev) { onkey(ev.keyCode, 'up');};
    Dom.on(document, 'keydown', press );
    Dom.on(document, 'keyup',  release);
    Dom.on(document,'finished',function (ev) {
      document.removeEventListener('keydown', press);
      document.removeEventListener('keyup', release);
    });
  },

  //---------------------------------------------------------------------------

  stats: function(parentId, id) { // construct mr.doobs FPS counter - along with friendly good/bad/ok message box

    var result = new Stats();
    result.domElement.id = id || 'stats';
    Dom.get(parentId).appendChild(result.domElement);

    var msg = document.createElement('div');
    msg.style.cssText = "border: 2px solid gray; padding: 5px; margin-top: 5px; text-align: left; font-size: 1.15em; text-align: right;";
    msg.innerHTML = "Your canvas performance is ";
    Dom.get(parentId).appendChild(msg);

    var value = document.createElement('span');
    value.innerHTML = "...";
    msg.appendChild(value);

    setInterval(function() {
      var fps   = result.current();
      var ok    = (fps > 50) ? 'good'  : (fps < 30) ? 'bad' : 'ok';
      var color = (fps > 50) ? 'green' : (fps < 30) ? 'red' : 'gray';
      value.innerHTML       = ok;
      value.style.color     = color;
      msg.style.borderColor = color;
    }, 5000);
    return result;
  },

  //---------------------------------------------------------------------------

  playMusic: function() {
    var music = Dom.get('music');
    music.loop = true;
    music.volume = 0.05; // shhhh! annoying music!
    music.muted = (Dom.storage.muted === "true");
    music.play();
    Dom.toggleClassName('mute', 'on', music.muted);
    Dom.on('mute', 'click', function() {
      Dom.storage.muted = music.muted = !music.muted;
      Dom.toggleClassName('mute', 'on', music.muted);
    });
  }

}

//=========================================================================
// canvas rendering helpers
//=========================================================================

var Render = {

  polygon: function(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  },

  //---------------------------------------------------------------------------

  segment: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, fog, color) {

    var r1 = Render.rumbleWidth(w1, lanes),
        r2 = Render.rumbleWidth(w2, lanes),
        l1 = Render.laneMarkerWidth(w1, lanes),
        l2 = Render.laneMarkerWidth(w2, lanes),
        lanew1, lanew2, lanex1, lanex2, lane;

    ctx.fillStyle = color.grass;
    ctx.fillRect(0, y2, width, y1 - y2);

    Render.polygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
    Render.polygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
    Render.polygon(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road);

    if (color.lane) {
      lanew1 = w1*2/lanes;
      lanew2 = w2*2/lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;
      for(lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
        Render.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
    }

    Render.fog(ctx, 0, y1, width, y2-y1, fog);
  },

  //---------------------------------------------------------------------------

  background: function(ctx, background, width, height, layer, rotation, offset) {

    rotation = rotation || 0;
    offset   = offset   || 0;

    var imageW = layer.w/2;
    var imageH = layer.h;

    var sourceX = layer.x + Math.floor(layer.w * rotation);
    var sourceY = layer.y
    var sourceW = Math.min(imageW, layer.x+layer.w-sourceX);
    var sourceH = imageH;

    var destX = 0;
    var destY = offset;
    var destW = Math.floor(width * (sourceW/imageW));
    var destH = height;

    ctx.drawImage(background, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
    if (sourceW < imageW)
      ctx.drawImage(background, layer.x, sourceY, imageW-sourceW, sourceH, destW-1, destY, width-destW, destH);
  },

  //---------------------------------------------------------------------------

  sprite: function(ctx, width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY) {

                    //  scale for projection AND relative to roadWidth (for tweakUI)
    var destW  = (sprite.w * scale * width/2) * (SPRITES.SCALE * roadWidth);
    var destH  = (sprite.h * scale * width/2) * (SPRITES.SCALE * roadWidth);

    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));

    var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
    if (clipH < destH)
      ctx.drawImage(sprites, sprite.x, sprite.y, sprite.w, sprite.h - (sprite.h*clipH/destH), destX, destY, destW, destH - clipH);

  },

  //---------------------------------------------------------------------------

  player: function(ctx, width, height, resolution, roadWidth, sprites, speedPercent, scale, destX, destY, steer, updown) {

    var bounce = (1.5 * Math.random() * speedPercent * resolution) * Util.randomChoice([-1,1]);
    var sprite;
    if (steer < 0)
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_LEFT : SPRITES.PLAYER_LEFT;
    else if (steer > 0)
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_RIGHT : SPRITES.PLAYER_RIGHT;
    else
      sprite = (updown > 0) ? SPRITES.PLAYER_UPHILL_STRAIGHT : SPRITES.PLAYER_STRAIGHT;

    Render.sprite(ctx, width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY + bounce, -0.5, -1);
  },

  //---------------------------------------------------------------------------

  fog: function(ctx, x, y, width, height, fog) {
    if (fog < 1) {
      ctx.globalAlpha = (1-fog)
      ctx.fillStyle = COLORS.FOG;
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1;
    }
  },

  rumbleWidth:     function(projectedRoadWidth, lanes) { return projectedRoadWidth/Math.max(6,  2*lanes); },
  laneMarkerWidth: function(projectedRoadWidth, lanes) { return projectedRoadWidth/Math.max(32, 8*lanes); }

}
//=============================================================================
// GAME STAGE BUILDER
//=============================================================================

var Stage = {
    stageList : [1,2,3],
    NewGame: true,
    stagePtr: 0,
    nextLevel: function(){
      console.log("called nextLevel");
      document.getElementById("totalCars").value *= 1.1;
      document.getElementById("maxSpeed").value *= 1.1;
      document.getElementById("submit").click();
      return false;
      },
    previousLevel: function(){
      console.log("called previousLevel");
      document.getElementById("totalCars").value /= 1.1;
      document.getElementById("maxSpeed").value /= 1.1;
      document.getElementById("submit").click();
      return false;
      },
    changeStage: function(){

      Stage.stagePtr= (Stage.stagePtr+1)%Stage.stageList.length;
    if(Stage.stagePtr > 0 && Stage.stagePtr < Stage.stageList.length) {
      Game.loadImages(
        ["background" + Stage.stageList[Stage.stagePtr], "sprites" + Stage.stageList[Stage.stagePtr]],
        function(images) {
          background = images[0];
          sprites    = images[1];
          reset();
          //Dom.storage.fast_lap_time = Dom.storage.fast_lap_time || 180;
          //updateHud('fast_lap_time', formatTime(Util.toFloat(Dom.storage.fast_lap_time)));
        }
      );
      // var audio = document.getElementById("music");
      // //audio.stop();
      // var source = document.getElementById("audioSource");
      // audio.load();
      // source.src = "music/music" + Stage.stageList[Stage.stagePtr] + ".mp3";
      // Game.playMusic();
      displayToast("下一關");
      if(Stage.stagePtr < Stage.stageList.length-1)
        setTimeout(Stage.changeStage, maxTime * 1000);
      else
        setTimeout(stop, maxTime * 1000);

    }


  }
}

//=============================================================================
// RACING GAME CONSTANTS
//=============================================================================

var KEY = {
  LEFT:  37,
  UP:    38,
  RIGHT: 39,
  DOWN:  40,
  A:     65,
  D:     68,
  S:     83,
  W:     87
};

var COLORS = {
  SKY:  '#72D7EE',
  TREE: '#005108',
  FOG:  '#005108',
  LIGHT:  { road: '#6B6B6B', grass: '#10AA10', rumble: '#555555', lane: '#CCCCCC'  },
  DARK:   { road: '#696969', grass: '#009A00', rumble: '#BBBBBB'                   },
  START:  { road: 'white',   grass: 'white',   rumble: 'white'                     },
  FINISH: { road: 'black',   grass: 'black',   rumble: 'black'                     }
};

var BACKGROUND = {
  HILLS: { x:   5, y:   5, w: 1280, h: 480 },
  SKY:   { x:   5, y: 495, w: 1280, h: 480 },
  TREES: { x:   5, y: 985, w: 1280, h: 480 }
};

var SPRITES = {
  PALM_TREE:              { x:    5, y:    5, w:  215, h:  540 },
  BILLBOARD08:            { x:  230, y:    5, w:  385, h:  265 },
  TREE1:                  { x:  625, y:    5, w:  360, h:  360 },
  DEAD_TREE1:             { x:    5, y:  555, w:  135, h:  332 },
  BILLBOARD09:            { x:  150, y:  555, w:  328, h:  282 },
  BOULDER3:               { x:  230, y:  280, w:  320, h:  220 },
  COLUMN:                 { x:  995, y:    5, w:  200, h:  315 },
  BILLBOARD01:            { x:  625, y:  375, w:  300, h:  170 },
  BILLBOARD06:            { x:  488, y:  555, w:  298, h:  190 },
  BILLBOARD05:            { x:    5, y:  897, w:  298, h:  190 },
  BILLBOARD07:            { x:  313, y:  897, w:  298, h:  190 },
  BOULDER2:               { x:  621, y:  897, w:  298, h:  140 },
  TREE2:                  { x: 1205, y:    5, w:  282, h:  295 },
  BILLBOARD04:            { x: 1205, y:  310, w:  268, h:  170 },
  DEAD_TREE2:             { x: 1205, y:  490, w:  150, h:  260 },
  BOULDER1:               { x: 1205, y:  760, w:  168, h:  248 },
  BUSH1:                  { x:    5, y: 1097, w:  240, h:  155 },
  CACTUS:                 { x:  929, y:  897, w:  235, h:  118 },
  BUSH2:                  { x:  255, y: 1097, w:  232, h:  152 },
  BILLBOARD03:            { x:    5, y: 1262, w:  230, h:  220 },
  BILLBOARD02:            { x:  245, y: 1262, w:  215, h:  220 },
  STUMP:                  { x:  995, y:  330, w:  195, h:  140 },
  SEMI:                   { x: 1365, y:  490, w:  122, h:  144 },
  TRUCK:                  { x: 1365, y:  644, w:  100, h:   78 },
  CAR03:                  { x: 1383, y:  760, w:   88, h:   55 },
  CAR02:                  { x: 1383, y:  825, w:   80, h:   59 },
  CAR04:                  { x: 1383, y:  894, w:   80, h:   57 },
  CAR01:                  { x: 1205, y: 1018, w:   80, h:   56 },
  PLAYER_UPHILL_LEFT:     { x: 1383, y:  961, w:   80, h:   45 },
  PLAYER_UPHILL_STRAIGHT: { x: 1295, y: 1018, w:   80, h:   45 },
  PLAYER_UPHILL_RIGHT:    { x: 1385, y: 1018, w:   80, h:   45 },
  PLAYER_LEFT:            { x:  995, y:  480, w:   80, h:   41 },
  PLAYER_STRAIGHT:        { x: 1085, y:  480, w:   80, h:   41 },
  PLAYER_RIGHT:           { x:  995, y:  531, w:   80, h:   41 }
};

SPRITES.SCALE = 0.3 * (1/SPRITES.PLAYER_STRAIGHT.w) // the reference sprite width should be 1/3rd the (half-)roadWidth

SPRITES.BILLBOARDS = [SPRITES.BILLBOARD01, SPRITES.BILLBOARD02, SPRITES.BILLBOARD03, SPRITES.BILLBOARD04, SPRITES.BILLBOARD05, SPRITES.BILLBOARD06, SPRITES.BILLBOARD07, SPRITES.BILLBOARD08, SPRITES.BILLBOARD09];
SPRITES.PLANTS     = [SPRITES.TREE1, SPRITES.TREE2, SPRITES.DEAD_TREE1, SPRITES.DEAD_TREE2, SPRITES.PALM_TREE, SPRITES.BUSH1, SPRITES.BUSH2, SPRITES.CACTUS, SPRITES.STUMP, SPRITES.BOULDER1, SPRITES.BOULDER2, SPRITES.BOULDER3];
SPRITES.CARS       = [SPRITES.CAR01, SPRITES.CAR02, SPRITES.CAR03, SPRITES.CAR04, SPRITES.SEMI, SPRITES.TRUCK];

var IsStarted = false;

	// when animating on congrat, it is best to use requestAnimationFrame instead of setTimeout or setInterval
	// not supported in all browsers though and sometimes needs a prefix, so we need a shim
	window.requestAnimFrame = ( function() {
		return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					function( callback ) {
						window.setTimeout( callback, 1000 / 60 );
					};
	})();

	// now we will setup our basic variables for the demo
	var congrat = document.getElementById( 'firework' ),
			ctx_firework = congrat.getContext( '2d' ),
			// full screen dimensions
			cw = canvas.height,//window.innerWidth,
			ch = canvas.width,//window.innerHeight,
			// firework collection
			fireworks = [],
			// particle collection
			particles = [],
			// starting hue
			hue = 120,
			// when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
			limiterTotal = 5,
			limiterTick = 0,
			// this will time the auto launches of fireworks, one launch per 80 loop ticks
			timerTotal = 20,
			timerTick = 0,
			mousedown = false,
			// mouse x coordinate,
			mx,
			// mouse y coordinate
			my;

	// set congrat dimensions


	// now we are going to setup our function placeholders for the entire demo

	// get a random number within a range
	function random( min, max ) {
		return Math.random() * ( max - min ) + min;
	}

	// calculate the distance between two points
	function calculateDistance( p1x, p1y, p2x, p2y ) {
		var xDistance = p1x - p2x,
				yDistance = p1y - p2y;
		return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
	}

	// create firework
	function Firework( sx, sy, tx, ty ) {
		// actual coordinates
		this.x = sx;
		this.y = sy;
		// starting coordinates
		this.sx = sx;
		this.sy = sy;
		// target coordinates
		this.tx = tx;
		this.ty = ty;
		// distance from starting point to target
		this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
		this.distanceTraveled = 0;
		// track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
		this.coordinates = [];
		this.coordinateCount = 3;
		// populate initial coordinate collection with the current coordinates
		while( this.coordinateCount-- ) {
			this.coordinates.push( [ this.x, this.y ] );
		}
		this.angle = Math.atan2( ty - sy, tx - sx );
		this.speed = 3;
		this.acceleration = 1;
		this.brightness = random( 50, 70 );
		// circle target indicator radius
		this.targetRadius = 1;
	}

	// update firework
	Firework.prototype.update = function( index ) {
		// remove last item in coordinates array
		this.coordinates.pop();
		// add current coordinates to the start of the array
		this.coordinates.unshift( [ this.x, this.y ] );

		// cycle the circle target indicator radius
		if( this.targetRadius < 8 ) {
			this.targetRadius += 0.3;
		} else {
			this.targetRadius = 1;
		}

		// speed up the firework
		this.speed *= this.acceleration;

		// get the current velocities based on angle and speed
		var vx = Math.cos( this.angle ) * this.speed,
				vy = Math.sin( this.angle ) * this.speed;
		// how far will the firework have traveled with velocities applied?
		this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );

		// if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
		if( this.distanceTraveled >= this.distanceToTarget ) {
			createParticles( this.tx, this.ty );
			// remove the firework, use the index passed into the update function to determine which to remove
			fireworks.splice( index, 1 );
		} else {
			// target not reached, keep traveling
			this.x += vx;
			this.y += vy;
		}
	}

	// draw firework
	Firework.prototype.draw = function() {
		ctx_firework.beginPath();
		// move to the last tracked coordinate in the set, then draw a line to the current x and y
		ctx_firework.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
		ctx_firework.lineTo( this.x, this.y );
		ctx_firework.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
		ctx_firework.stroke();

		ctx_firework.beginPath();
		// draw the target for this firework with a pulsing circle
		ctx_firework.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
		ctx_firework.stroke();
	}

	// create particle
	function Particle( x, y ) {
		this.x = x;
		this.y = y;
		// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
		this.coordinates = [];
		this.coordinateCount = 5;
		while( this.coordinateCount-- ) {
			this.coordinates.push( [ this.x, this.y ] );
		}
		// set a random angle in all possible directions, in radians
		this.angle = random( 0, Math.PI * 2 );
		this.speed = random( 1, 10 );
		// friction will slow the particle down
		this.friction = 0.95;
		// gravity will be applied and pull the particle down
		this.gravity = 1;
		// set the hue to a random number +-50 of the overall hue variable
		this.hue = random( hue - 50, hue + 50 );
		this.brightness = random( 50, 80 );
		this.alpha = 1;
		// set how fast the particle fades out
		this.decay = random( 0.015, 0.03 );
	}

	// update particle
	Particle.prototype.update = function( index ) {
		// remove last item in coordinates array
		this.coordinates.pop();
		// add current coordinates to the start of the array
		this.coordinates.unshift( [ this.x, this.y ] );
		// slow down the particle
		this.speed *= this.friction;
		// apply velocity
		this.x += Math.cos( this.angle ) * this.speed;
		this.y += Math.sin( this.angle ) * this.speed + this.gravity;
		// fade out the particle
		this.alpha -= this.decay;

		// remove the particle once the alpha is low enough, based on the passed in index
		if( this.alpha <= this.decay ) {
			particles.splice( index, 1 );
		}
	}

	// draw particle
	Particle.prototype.draw = function() {
		ctx_firework. beginPath();
		// move to the last tracked coordinates in the set, then draw a line to the current x and y
		ctx_firework.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
		ctx_firework.lineTo( this.x, this.y );
		ctx_firework.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
		ctx_firework.stroke();
	}

	// create particle group/explosion
	function createParticles( x, y ) {
		// increase the particle count for a bigger explosion, beware of the congrat performance hit with the increased particles though
		var particleCount = 500;
		while( particleCount-- ) {
			particles.push( new Particle( x, y ) );
		}
	}


	// main demo loop
	function loop() {

		// this function will run endlessly with requestAnimationFrame
		requestAnimFrame( loop );

		// increase the hue to get different colored fireworks over time
		//hue += 0.5;

	  // create random color
	  hue= random(0, 360 );

		// normally, clearRect() would be used to clear the congrat
		// we want to create a trailing effect though
		// setting the composite operation to destination-out will allow us to clear the congrat at a specific opacity, rather than wiping it entirely
		ctx_firework.globalCompositeOperation = 'destination-out';
		// decrease the alpha property to create more prominent trails
		ctx_firework.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx_firework.fillRect( 0, 0, cw, ch );
		// change the composite operation back to our main mode
		// lighter creates bright highlight points as the fireworks and particles overlap each other
		ctx_firework.globalCompositeOperation = 'lighter';

		// loop over each firework, draw it, update it
		var i = fireworks.length;
		while( i-- ) {
			fireworks[ i ].draw();
			fireworks[ i ].update( i );
		}

		// loop over each particle, draw it, update it
		var i = particles.length;
		while( i-- ) {
			particles[ i ].draw();
			particles[ i ].update( i );
		}

		// launch fireworks automatically to random coordinates, when the mouse isn't down
		if( timerTick >= timerTotal ) {
			if( !mousedown ) {
				// start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
				fireworks.push( new Firework( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
				timerTick = 0;
			}
		} else {
			timerTick++;
		}

		// limit the rate at which fireworks get launched when mouse is down
		if( limiterTick >= limiterTotal ) {
			if( mousedown ) {
				// start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
				fireworks.push( new Firework( cw / 2, ch, mx, my ) );
				limiterTick = 0;
			}
		} else {
			limiterTick++;
		}
	}
	//
	// // mouse event bindings
	// // update the mouse coordinates on mousemove
	// congrat.addEventListener( 'mousemove', function( e ) {
	// 	mx = e.pageX - congrat.offsetLeft;
	// 	my = e.pageY - congrat.offsetTop;
	// });
	//
	// // toggle mousedown state and prevent congrat from being selected
	// congrat.addEventListener( 'mousedown', function( e ) {
	// 	e.preventDefault();
	// 	mousedown = true;
	// });
	//
	// congrat.addEventListener( 'mouseup', function( e ) {
	// 	e.preventDefault();
	// 	mousedown = false;
	// });
	//
	// // once the window loads, we are ready for some fireworks!
	// window.onload = loop;

			function fire () {
		  congrat.width = cw = canvas.width;
		  congrat.height = ch = canvas.height;
	  	loop()
		}


$( document ).ready(function() {
  $('#restartbutton').hide();


	$("#startbutton").click(startGame);
	$("#fullscreen").click(fullscreen);

  $('#startbutton').click(function () {
    $('#restartbutton').show();
    $('#startbutton').hide();
  })
	ParametersInitialization();
	reset();
	if (document.addEventListener)
	{
			document.addEventListener('webkitfullscreenchange', exitHandler, false);
			document.addEventListener('mozfullscreenchange', exitHandler, false);
			document.addEventListener('fullscreenchange', exitHandler, false);
			document.addEventListener('MSFullscreenChange', exitHandler, false);
	}

	function exitHandler()
	{
			var canvas = $("#canvas");
			var mywindow =$(window);
			if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null)
			{
				var w = mywindow.width();
				var h = mywindow.height();

				var screenratio = w/h;
				var canvasratio = canvas.width()/canvas.height();
				var fullHeight = (canvasratio < screenratio);
				console.log(fullHeight);
				if (fullHeight){
						canvas.css("height", h + "px");
						canvas.css("width", h * canvasratio + "px");
						canvas.css("left", -(canvas.width() - mywindow.width()) / 2 + "px");
				} else {
						canvas.css("height", w / canvasratio + "px");
						canvas.css("width", w + "px");
						canvas.css("top", -(canvas.height() - mywindow.height()) / 2 + "px");

				}
				reset();
				startGame();

			}
			if ((document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) == null)
			{
				canvas.css("width", "640px");
				canvas.css("height", "480px");
				canvas.css("left", " 0px");
				canvas.css("top",  "0px");
				reset();
			}
	}
});
/*************************
*                       *
*    Global variable    *
*                       *
*************************/

function fullscreen() {
	var gamecanvas = $("#canvas")[0];
	var fireworkcanvas = $("#canvas")[1];
	if (typeof gamecanvas.webkitRequestFullScreen === "function")
 		$("#canvas")[0].webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); //Chrome
	if (typeof gamecanvas.mozRequestFullScreen === "function")
 		$("#canvas")[0].mozRequestFullScreen(); //Firefox
}


function refreshTweakUI() {
 Dom.get('lanes').selectedIndex = lanes-1;
 Dom.get('currentRoadWidth').innerHTML      = Dom.get('roadWidth').value      = roadWidth;
 Dom.get('currenttotalCars').innerHTML      = Dom.get('totalCars').value      = totalCars;
 Dom.get('currentmaxSpeed').innerHTML       = Dom.get('maxSpeed').value       = maxSpeed;
 Dom.get('currentmaxTime').innerHTML        = Dom.get('maxTime').value        = maxTime;
}


function reset(options) {
 //console.log("called reset");

	 options       = options || {};
	 canvas.width  = width  = Util.toInt(options.width,          width);
	 canvas.height = height = Util.toInt(options.height,         height);
	 lanes                  = Util.toInt(options.lanes,          lanes);
	 totalCars              = Util.toInt(options.totalCars,      totalCars);
	 roadWidth              = Util.toInt(options.roadWidth,      roadWidth);
	 maxSpeed               = Util.toInt(options.maxSpeed,       maxSpeed);
	 segmentLength          = Util.toInt(options.segmentLength,  segmentLength);
	 rumbleLength           = Util.toInt(options.rumbleLength,   rumbleLength);
	 cameraDepth            = 1 / Math.tan((fieldOfView/2) * Math.PI/180);
	 playerZ                = (cameraHeight * cameraDepth);
	 resolution             = height/480;
	 maxTime                = Util.toInt(options.maxTime,        maxTime);
 refreshTweakUI();

 if ((segments.length==0) || (options.segmentLength) || (options.rumbleLength) || (options.totalCars))
 resetRoad(); // only rebuild road when necessary
}

function stop(){

 document.dispatchEvent(new Event('finished'));
 keyLeft = keyRight = keySlower = keyFaster = false;
 displayToast("遊戲結束","inf");
 fire();
}



function clear(){ ctx.clearRect(0,0,c.width,c.height); }

function displayToast(msg, time) {
var toast = $("#toast");
var hide = function () { toast.removeClass("show");}
toast.html(msg);
toast.addClass("show");
clearTimeout(hide);
if(time != "inf") setTimeout(hide, time||2000);
}

function ParametersInitialization() {
// Declare global variables
	fps            = 60;                      // how many 'update' frames per second
step           = 1/fps;                   // how long is each frame (in seconds)
width          = 1024;                    // logical canvas width
		height         = 768;                     // logical canvas height
		centrifugal    = 0.3;                     // centrifugal force multiplier when going around curves
		offRoadDecel   = 0.99;                    // speed multiplier when off road (e.g. you lose 2% speed each update frame)
		skySpeed       = 0.001;                   // background sky layer scroll speed when going around curve (or up hill)
		hillSpeed      = 0.002;                   // background hill layer scroll speed when going around curve (or up hill)
		treeSpeed      = 0.003;                   // background tree layer scroll speed when going around curve (or up hill)
		skyOffset      = 0;                       // current sky scroll offset
		hillOffset     = 0;                       // current hill scroll offset
		treeOffset     = 0;                       // current tree scroll offset
segments       = [];                      // array of road segments
		cars           = [];                      // array of cars on the road
		stats          = Game.stats('fps');       // mr.doobs FPS counter
		canvas         = Dom.get('canvas');       // our canvas...
		ctx            = canvas.getContext('2d'); // ...and its drawing context
		background     = null;                    // our background image (loaded below)
		sprites        = null;                    // our spritesheet (loaded below)
		resolution     = null;                    // scaling factor to provide resolution independence (computed)
		roadWidth      = $("#roadWidth").val();                   // actually half the roads width, easier math if the road spans from -roadWidth to +roadWidth
		segmentLength  = 300;                     // length of a single segment
		rumbleLength   = 3;                       // number of segments per red/white rumble strip
		trackLength    = 100;                    // z length of entire track (computed)
		lanes          = 5;                       // number of lanes
		fieldOfView    = 100;                     // angle (degrees) for field of view
		cameraHeight   = 1000;                    // z height of camera
		cameraDepth    = null;                    // z distance camera is from screen (computed)
		drawDistance   = 300;                     // number of segments to draw
		playerX        = 0;                       // player x offset from center of road (-1 to 1 to stay independent of roadWidth)
		playerZ        = null;                    // player relative z distance from camera (computed)
		fogDensity     = 5;                       // exponential fog density
		position       = 0;                       // current camera Z position (add playerZ to get player's absolute Z position)
		speed          = 0;                       // current speed
		maxSpeed       = $("#maxSpeed").val();    // top speed (ensure we can't move more than 1 segment in a single frame to make collision detection easier)
		accel          =  maxSpeed/5;             // acceleration rate - tuned until it 'felt' right
		breaking       = -maxSpeed;               // deceleration rate when braking
		decel          = -maxSpeed/5;             // 'natural' deceleration rate when neither accelerating, nor braking
		offRoadDecel   = -maxSpeed/2;             // off road deceleration is somewhere in between
		offRoadLimit   =  maxSpeed/4;             // limit when off road deceleration no longer applies (e.g. you can always go at least this speed even when off road)
		totalCars      = $("#totalCars").val();                     // total number of cars on the road
		currentLapTime = 0;                       // current lap time
		lastLapTime    = null;                    // last lap time
		numOfCrash     = 0;
		keyLeft        = false;
		keyRight       = false;
		keyFaster      = true;
		keySlower      = false;
		maxTime = $("#maxTime").val();

hud = {
			speed:            { value: null, dom: Dom.get('speed_value')            },
			current_lap_time: { value: null, dom: Dom.get('current_lap_time_value') },
			crash:            { value: null, dom: Dom.get('crash_value')            },
			score:            { value: null, dom: Dom.get('score_value')            },
			last_lap_time:    { value: null, dom: Dom.get('last_lap_time_value')    },
			fast_lap_time:    { value: null, dom: Dom.get('fast_lap_time_value')    }
		}

}

function update(dt) {
////console.log("called update");
var n, car, carW, sprite, spriteW;
var playerSegment = findSegment(position+playerZ);
var playerW       = SPRITES.PLAYER_STRAIGHT.w * SPRITES.SCALE;
var speedPercent  = speed/maxSpeed;
var dx            = dt * 2 * speedPercent; // at top speed, should be able to cross from left to right (-1 to 1) in 1 second
var startPosition = position;

updateCars(dt, playerSegment, playerW);

position = Util.increase(position, dt * speed, trackLength);

if (keyLeft)
playerX = playerX - dx;
else if (keyRight)
playerX = playerX + dx;

playerX = playerX - (dx * speedPercent * playerSegment.curve * centrifugal);

if (keyFaster)
speed = Util.accelerate(speed, accel, dt);
else if (keySlower)
speed = Util.accelerate(speed, breaking, dt);
else
speed = Util.accelerate(speed, decel, dt);


if ((playerX < -1) || (playerX > 1)) {

	if (speed > offRoadLimit)
	speed = Util.accelerate(speed, offRoadDecel, dt);

	for(n = 0 ; n < playerSegment.sprites.length ; n++) {
		sprite  = playerSegment.sprites[n];
		spriteW = sprite.source.w * SPRITES.SCALE;
		if (Util.overlap(playerX, playerW, sprite.offset + spriteW/2 * (sprite.offset > 0 ? 1 : -1), spriteW)) {
			speed = maxSpeed/5;
			position = Util.increase(playerSegment.p1.world.z, -playerZ, trackLength); // stop in front of sprite (at front of segment)
			break;
		}
	}
}

for(n = 0 ; n < playerSegment.cars.length ; n++) {
	car  = playerSegment.cars[n];
	carW = car.sprite.w * SPRITES.SCALE;
	if (speed > car.speed) {
		if (Util.overlap(playerX, playerW, car.offset, carW, 0.8)) {
			// var audio = new Audio('music/crash.mp3');
			// audio.play();
			numOfCrash += 1;
			speed    = car.speed * (car.speed/speed);
			position = Util.increase(car.z, -playerZ, trackLength);
			break;
		}
	}
}

playerX = Util.limit(playerX, -3, 3);     // dont ever let it go too far out of bounds
speed   = Util.limit(speed, 0, maxSpeed); // or exceed maxSpeed

skyOffset  = Util.increase(skyOffset,  skySpeed  * playerSegment.curve * (position-startPosition)/segmentLength, 1);
hillOffset = Util.increase(hillOffset, hillSpeed * playerSegment.curve * (position-startPosition)/segmentLength, 1);
treeOffset = Util.increase(treeOffset, treeSpeed * playerSegment.curve * (position-startPosition)/segmentLength, 1);

if (position > playerZ) {

	if (currentLapTime && (startPosition < playerZ)) {
		//alert("hellos");//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		displayToast("你贏了!");
		lastLapTime    = currentLapTime;
		//currentLapTime = 0;
		if (lastLapTime <= Util.toFloat(Dom.storage.fast_lap_time)) {
			Dom.storage.fast_lap_time = lastLapTime;
			Dom.addClassName('fast_lap_time', 'fastest');
			Dom.addClassName('last_lap_time', 'fastest');
		}
		else {
			Dom.removeClassName('fast_lap_time', 'fastest');
			Dom.removeClassName('last_lap_time', 'fastest');
		}
		updateHud('last_lap_time', formatTime(lastLapTime));
		Dom.show('last_lap_time');
	}
	else {
		currentLapTime += dt;
	}
}

updateHud('speed',            5 * Math.round(speed/500));
updateHud('current_lap_time', formatTime(currentLapTime));
updateHud('crash', numOfCrash);
updateHud('score', Math.round(15000 + currentLapTime * 100 - numOfCrash * 20));
}

//-------------------------------------------------------------------------

function updateCars(dt, playerSegment, playerW) {
//console.log("called updateCars");
var n, car, oldSegment, newSegment;
for(n = 0 ; n < cars.length ; n++) {
	car         = cars[n];
	oldSegment  = findSegment(car.z);
	car.offset  = car.offset + updateCarOffset(car, oldSegment, playerSegment, playerW);
	car.z       = Util.increase(car.z, dt * car.speed, trackLength);
	car.percent = Util.percentRemaining(car.z, segmentLength); // useful for interpolation during rendering phase
	newSegment  = findSegment(car.z);
	if (oldSegment != newSegment) {
		index = oldSegment.cars.indexOf(car);
		oldSegment.cars.splice(index, 1);
		newSegment.cars.push(car);
	}
}
}

function updateCarOffset(car, carSegment, playerSegment, playerW) {
////console.log("called updateCarOffset");
var i, j, dir, segment, otherCar, otherCarW, lookahead = 20, carW = car.sprite.w * SPRITES.SCALE;

// optimization, dont bother steering around other cars when 'out of sight' of the player
if ((carSegment.index - playerSegment.index) > drawDistance)
return 0;

for(i = 1 ; i < lookahead ; i++) {
	segment = segments[(carSegment.index+i)%segments.length];

	if ((segment === playerSegment) && (car.speed > speed) && (Util.overlap(playerX, playerW, car.offset, carW, 1.2))) {
		if (playerX > 0.5)
		dir = -1;
		else if (playerX < -0.5)
		dir = 1;
		else
		dir = (car.offset > playerX) ? 1 : -1;
		return dir * 1/i * (car.speed-speed)/maxSpeed; // the closer the cars (smaller i) and the greated the speed ratio, the larger the offset
	}

	for(j = 0 ; j < segment.cars.length ; j++) {
		otherCar  = segment.cars[j];
		otherCarW = otherCar.sprite.w * SPRITES.SCALE;
		if ((car.speed > otherCar.speed) && Util.overlap(car.offset, carW, otherCar.offset, otherCarW, 1.2)) {
			if (otherCar.offset > 0.5)
			dir = -1;
			else if (otherCar.offset < -0.5)
			dir = 1;
			else
			dir = (car.offset > otherCar.offset) ? 1 : -1;
			return dir * 1/i * (car.speed-otherCar.speed)/maxSpeed;
		}
	}
}

// if no cars ahead, but I have somehow ended up off road, then steer back on
if (car.offset < -0.9)
return 0.1;
else if (car.offset > 0.9)
return -0.1;
else
return 0;
}

//-------------------------------------------------------------------------

function updateHud(key, value) { // accessing DOM can be slow, so only do it if value has changed
////console.log("called updateHud");
if (hud[key].value !== value) {
	hud[key].value = value;
	Dom.set(hud[key].dom, value);
}
}

function formatTime(dt) {
////console.log("called formatTime");
var minutes = Math.floor(dt/60);
var seconds = Math.floor(dt - (minutes * 60));
var tenths  = Math.floor(10 * (dt - Math.floor(dt)));
if (minutes > 0)
return minutes + "." + (seconds < 10 ? "0" : "") + seconds + "." + tenths;
else
return seconds + "." + tenths;
}

//=========================================================================
// RENDER THE GAME WORLD
//=========================================================================

function render() {
////console.log("called render");
var baseSegment   = findSegment(position);
var basePercent   = Util.percentRemaining(position, segmentLength);
var playerSegment = findSegment(position+playerZ);
var playerPercent = Util.percentRemaining(position+playerZ, segmentLength);
var playerY       = Util.interpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);
var maxy          = height;

var x  = 0;
var dx = - (baseSegment.curve * basePercent);

ctx.clearRect(0, 0, width, height);

Render.background(ctx, background, width, height, BACKGROUND.SKY,   skyOffset,  resolution * skySpeed  * playerY);
Render.background(ctx, background, width, height, BACKGROUND.HILLS, hillOffset, resolution * hillSpeed * playerY);
Render.background(ctx, background, width, height, BACKGROUND.TREES, treeOffset, resolution * treeSpeed * playerY);


var n, i, segment, car, sprite, spriteScale, spriteX, spriteY;

for(n = 0 ; n < drawDistance ; n++) {

	segment        = segments[(baseSegment.index + n) % segments.length];
	segment.looped = segment.index < baseSegment.index;
	segment.fog    = Util.exponentialFog(n/drawDistance, fogDensity);
	segment.clip   = maxy;

	Util.project(segment.p1, (playerX * roadWidth) - x,      playerY + cameraHeight, position - (segment.looped ? trackLength : 0), cameraDepth, width, height, roadWidth);
	Util.project(segment.p2, (playerX * roadWidth) - x - dx, playerY + cameraHeight, position - (segment.looped ? trackLength : 0), cameraDepth, width, height, roadWidth);

	x  = x + dx;
	dx = dx + segment.curve;

	if ((segment.p1.camera.z <= cameraDepth)         || // behind us
	(segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
	(segment.p2.screen.y >= maxy))                  // clip by (already rendered) hill
	continue;

	Render.segment(ctx, width, lanes,
		segment.p1.screen.x,
		segment.p1.screen.y,
		segment.p1.screen.w,
		segment.p2.screen.x,
		segment.p2.screen.y,
		segment.p2.screen.w,
		segment.fog,
		segment.color);

		maxy = segment.p1.screen.y;
	}

	for(n = (drawDistance-1) ; n > 0 ; n--) {
		segment = segments[(baseSegment.index + n) % segments.length];

		for(i = 0 ; i < segment.cars.length ; i++) {
			car         = segment.cars[i];
			sprite      = car.sprite;
			spriteScale = Util.interpolate(segment.p1.screen.scale, segment.p2.screen.scale, car.percent);
			spriteX     = Util.interpolate(segment.p1.screen.x,     segment.p2.screen.x,     car.percent) + (spriteScale * car.offset * roadWidth * width/2);
			spriteY     = Util.interpolate(segment.p1.screen.y,     segment.p2.screen.y,     car.percent);
			Render.sprite(ctx, width, height, resolution, roadWidth, sprites, car.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
		}

		for(i = 0 ; i < segment.sprites.length ; i++) {
			sprite      = segment.sprites[i];
			spriteScale = segment.p1.screen.scale;
			spriteX     = segment.p1.screen.x + (spriteScale * sprite.offset * roadWidth * width/2);
			spriteY     = segment.p1.screen.y;
			Render.sprite(ctx, width, height, resolution, roadWidth, sprites, sprite.source, spriteScale, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, segment.clip);
		}

		if (segment == playerSegment) {
			Render.player(ctx, width, height, resolution, roadWidth, sprites, speed/maxSpeed,
				cameraDepth/playerZ,
				width/2,
				(height/2) - (cameraDepth/playerZ * Util.interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent) * height/2),
				speed * (keyLeft ? -1 : keyRight ? 1 : 0),
				playerSegment.p2.world.y - playerSegment.p1.world.y);
			}
		}
	}

function findSegment(z) {
////console.log("called findSegment");
return segments[Math.floor(z/segmentLength) % segments.length];
}

//=========================================================================
// BUILD ROAD GEOMETRY
//=========================================================================

function lastY() {/*console.log("called lastY");*/ return (segments.length == 0) ? 0 : segments[segments.length-1].p2.world.y; }

function addSegment(curve, y) {
////console.log("called addSegment");
var n = segments.length;
segments.push({
index: n,
p1: { world: { y: lastY(), z:  n   *segmentLength }, camera: {}, screen: {} },
p2: { world: { y: y,       z: (n+1)*segmentLength }, camera: {}, screen: {} },
curve: curve,
sprites: [],
cars: [],
color: Math.floor(n/rumbleLength)%2 ? COLORS.DARK : COLORS.LIGHT
});
}

function addSprite(n, sprite, offset) {
////console.log("called addSprite");
segments[n].sprites.push({ source: sprite, offset: offset });
}

function addRoad(enter, hold, leave, curve, y) {
////console.log("called addRoad");
var startY   = lastY();
var endY     = startY + (Util.toInt(y, 0) * segmentLength);
var n, total = enter + hold + leave;
for(n = 0 ; n < enter ; n++)
addSegment(Util.easeIn(0, curve, n/enter), Util.easeInOut(startY, endY, n/total));
for(n = 0 ; n < hold  ; n++)
addSegment(curve, Util.easeInOut(startY, endY, (enter+n)/total));
for(n = 0 ; n < leave ; n++)
addSegment(Util.easeInOut(curve, 0, n/leave), Util.easeInOut(startY, endY, (enter+hold+n)/total));
}

var ROAD = {
LENGTH: { NONE: 0, SHORT:  25, MEDIUM:   50, LONG:  100 },
HILL:   { NONE: 0, LOW:    20, MEDIUM:   40, HIGH:   60 },
CURVE:  { NONE: 0, EASY:    2, MEDIUM:    4, HARD:    6 }
};

function addStraight(num) {
////console.log("called addStraight");
num = num || ROAD.LENGTH.MEDIUM;
addRoad(num, num, num, 0, 0);
}

function addHill(num, height) {
////console.log("called addHill");
num    = num    || ROAD.LENGTH.MEDIUM;
height = height || ROAD.HILL.MEDIUM;
addRoad(num, num, num, 0, height);
}

function addCurve(num, curve, height) {
////console.log("called addCurve");
num    = num    || ROAD.LENGTH.MEDIUM;
curve  = curve  || ROAD.CURVE.MEDIUM;
height = height || ROAD.HILL.NONE;
addRoad(num, num, num, curve, height);
}

function addLowRollingHills(num, height) {
////console.log("called addLowRollingHills");
num    = num    || ROAD.LENGTH.SHORT;
height = height || ROAD.HILL.LOW;
addRoad(num, num, num,  0,                height/2);
addRoad(num, num, num,  0,               -height);
addRoad(num, num, num,  ROAD.CURVE.EASY,  height);
addRoad(num, num, num,  0,                0);
addRoad(num, num, num, -ROAD.CURVE.EASY,  height/2);
addRoad(num, num, num,  0,                0);
}

function addSCurves() {
////console.log("called addSCurves");
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.NONE);
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.MEDIUM,  ROAD.HILL.MEDIUM);
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,   ROAD.CURVE.EASY,   -ROAD.HILL.LOW);
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.EASY,    ROAD.HILL.MEDIUM);
addRoad(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM,  -ROAD.CURVE.MEDIUM, -ROAD.HILL.MEDIUM);
}

function addBumps() {
////console.log("called addBumps");
addRoad(10, 10, 10, 0,  5);
addRoad(10, 10, 10, 0, -2);
addRoad(10, 10, 10, 0, -5);
addRoad(10, 10, 10, 0,  8);
addRoad(10, 10, 10, 0,  5);
addRoad(10, 10, 10, 0, -7);
addRoad(10, 10, 10, 0,  5);
addRoad(10, 10, 10, 0, -2);
}

function addDownhillToEnd(num) {
////console.log("called addDownhillToEnd");
num = num || 200;
addRoad(num, num, num, -ROAD.CURVE.EASY, -lastY()/segmentLength);
}

function resetRoad() {
////console.log("called resetRoad");
segments = [];

addStraight(ROAD.LENGTH.SHORT);
addLowRollingHills();
addSCurves();
addCurve(ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.LOW);
addBumps();
addLowRollingHills();
addCurve(ROAD.LENGTH.LONG*2, ROAD.CURVE.MEDIUM, ROAD.HILL.MEDIUM);
addStraight();
addHill(ROAD.LENGTH.MEDIUM, ROAD.HILL.HIGH);
addSCurves();
addCurve(ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM, ROAD.HILL.NONE);
addHill(ROAD.LENGTH.LONG, ROAD.HILL.HIGH);
addCurve(ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, -ROAD.HILL.LOW);
addBumps();
addHill(ROAD.LENGTH.LONG, -ROAD.HILL.MEDIUM);
addStraight();
addSCurves();
addDownhillToEnd();

resetSprites();
resetCars();

segments[findSegment(playerZ).index + 2].color = COLORS.START;
segments[findSegment(playerZ).index + 3].color = COLORS.START;
for(var n = 0 ; n < rumbleLength ; n++)
segments[segments.length-1-n].color = COLORS.FINISH;

trackLength = segments.length * segmentLength;
}

function resetSprites() {
console.log("called resetSprites");
var n, i;

/*    addSprite(20,  SPRITES.BILLBOARD07, -1);
	addSprite(40,  SPRITES.BILLBOARD06, -1);
	 addSprite(60,  SPRITES.BILLBOARD08, -1);
	 addSprite(80,  SPRITES.BILLBOARD09, -1);
	 addSprite(100, SPRITES.BILLBOARD01, -1);
		addSprite(120, SPRITES.BILLBOARD02, -1);
		addSprite(140, SPRITES.BILLBOARD03, -1);
	addSprite(160, SPRITES.BILLBOARD04, -1);
		addSprite(180, SPRITES.BILLBOARD05, -1);
addSprite(240,                  SPRITES.BILLBOARD07, -1.2);
		addSprite(240,                  SPRITES.BILLBOARD06,  1.2);
		addSprite(segments.length - 25, SPRITES.BILLBOARD07, -1.2);
		addSprite(segments.length - 25, SPRITES.BILLBOARD06,  1.2);
*/
for(n = 10 ; n < 200 ; n += 4 + Math.floor(n/100)) {
addSprite(n, SPRITES.PALM_TREE, 0.5 + Math.random()*0.5);
addSprite(n, SPRITES.PALM_TREE,   1 + Math.random()*2);
}

for(n = 250 ; n < 1000 ; n += 5) {
addSprite(n,     SPRITES.COLUMN, 1.1);
addSprite(n + Util.randomInt(0,5), SPRITES.TREE1, -1 - (Math.random() * 2));
addSprite(n + Util.randomInt(0,5), SPRITES.TREE2, -1 - (Math.random() * 2));
}

for(n = 200 ; n < segments.length ; n += 3) {
addSprite(n, Util.randomChoice(SPRITES.PLANTS), Util.randomChoice([1,-1]) * (2 + Math.random() * 5));
}

var side, sprite, offset;
for(n = 1000 ; n < (segments.length-50) ; n += 100) {
side      = Util.randomChoice([1, -1]);
addSprite(n + Util.randomInt(0, 50), Util.randomChoice(SPRITES.BILLBOARDS), -side);
//  for(i = 0 ; i < 20 ; i++) {
//  sprite = Util.randomChoice(SPRITES.PLANTS);
//offset = side * (1.5 + Math.random());
//  addSprite(n + Util.randomInt(0, 50), sprite, offset);
//  }

}

}

function resetCars() {
//console.log("called resetCars");
cars = [];
var n, car, segment, offset, z, sprite, speed;
for (var n = 0 ; n < totalCars ; n++) {
offset = Math.random() * Util.randomChoice([-0.8, 0.8]);
z      = Math.floor(Math.random() * segments.length) * segmentLength;
sprite = Util.randomChoice(SPRITES.CARS);
speed  = maxSpeed/4 + Math.random() * maxSpeed/(sprite == SPRITES.SEMI ? 4 : 2);
car = { offset: offset, z: z, sprite: sprite, speed: speed };
segment = findSegment(car.z);
segment.cars.push(car);
cars.push(car);
}
}

Dom.on('roadWidth',      'change', function(ev) { /*console.log("changing");*/Dom.blur(ev);reset({ roadWidth:     Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) });});
Dom.on('totalCars',      'change', function(ev) { /*console.log("changing");*/Dom.blur(ev); reset({ totalCars:     Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) }); });
Dom.on('maxSpeed',       'change', function(ev) { /*console.log("changing");*/Dom.blur(ev); reset({ maxSpeed:      Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) }); });
Dom.on('maxTime',        'change',
function(ev) { /*console.log("changing");*/
Dom.blur(ev);
reset({ maxTime:       Util.limit(Util.toInt(ev.target.value), Util.toInt(ev.target.getAttribute('min')), Util.toInt(ev.target.getAttribute('max'))) });
});

function startGame(){
//console.log("called startGame");

//if(Stage.NewGame) ParametersInitialization();
if(IsStarted)return;
Stage.NewGame = false;
IsStarted = true;
Game.run({
canvas: canvas, render: render, update: update, stats: stats, step: step,
images: ["background1", "sprites1"],
keys: [
	{ keys: [KEY.LEFT,  KEY.A], mode: 'down', action: function() { keyLeft   = true;  } },
	{ keys: [KEY.RIGHT, KEY.D], mode: 'down', action: function() { keyRight  = true;  } },
	{ keys: [KEY.UP,    KEY.W], mode: 'down', action: function() { keyFaster = true;  } },
	{ keys: [KEY.DOWN,  KEY.S], mode: 'down', action: function() { keySlower = true;  } },
	{ keys: [KEY.LEFT,  KEY.A], mode: 'up',   action: function() { keyLeft   = false; } },
	{ keys: [KEY.RIGHT, KEY.D], mode: 'up',   action: function() { keyRight  = false; } }
],
ready: function(images) {
	background = images[0];
	sprites    = images[1];
	reset();
	//Dom.storage.fast_lap_time = Dom.storage.fast_lap_time || 180;
	displayToast("開始");
	console.log(Stage.stageList);
	setTimeout(Stage.changeStage, maxTime * 1000);
}
});

}
