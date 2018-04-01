

  function changeStage(){
      console.log("called changeStage");
      //randomize stage
	    maxStage = 8;
	    var NewStageNumber = 9;//Math.floor(Math.random() * (maxStage - 1 + 1)) + 1; // Math.floor(Math.random() * (max - min + 1)) + min;// BUG:potential repeated stage

      //
		if(NewStageNumber > 0 && NewStageNumber <= 8) {
			console.log("New stage: " + NewStageNumber);
			Game.loadImages(
				["background" + NewStageNumber, "sprites" + NewStageNumber],
				function(images) {
					background = images[0];
					sprites    = images[1];
					reset();
					Dom.storage.fast_lap_time = Dom.storage.fast_lap_time || 180;
					updateHud('fast_lap_time', formatTime(Util.toFloat(Dom.storage.fast_lap_time)));
				}
			);
			var audio = document.getElementById("music");
			//audio.stop();
			var source = document.getElementById("audioSource");
			audio.load();
			source.src = "music/music" + NewStageNumber + ".mp3";
			Game.playMusic();
      displayToast("Next Stage");
			setTimeout(changeStage, maxTime * 1000);
		} else if(NewStageNumber == 9) {

			console.log("New stage: " + NewStageNumber);
		    document.getElementById("backgroundImg").value = "background5" ;
          document.getElementById("sprites").value = "sprites5" ;
          document.getElementById("submit").click();
          return false;

		} else {
			console.log("New stage error: " + NewStageNumber);
		}
      }
