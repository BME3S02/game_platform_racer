
$( document ).ready(function() {
  window.startTime = new Date().valueOf();
});

function sendRecord(){
  window.endTime = new Date().valueOf();
  jQuery.ajax({
    type: "POST",
    url: "saverecord.php",
    dataType: "JSON",
    data: {
      playTime: Math.round(((endTime - startTime) / 1000)/60),
      latestLapTime: Dom.get('current_lap_time_value').innerText,
      fastestLapTime: Dom.get('last_lap_time_value').innerText
    }
  });
}
$(window).on('beforeunload', sendRecord );
