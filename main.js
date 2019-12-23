
window.onload = function(){
	
	function mainClock() {
		var clock = document.getElementById("main-clock");
		clock.innerHTML = new Date().toLocaleTimeString();
	}
	function updateCalendar(){
		
		//Finding the first day of week to start at
		//and the number of days in the month
		var firstDay = dateFns.startOfMonth(currMonth);
		var lastDay = dateFns.endOfMonth(currMonth);
		firstDay = dateFns.getDay(firstDay);
		lastDay = dateFns.getDate(lastDay);
		
		var date = 1;

		//This is a loop for the weeks.
		for(var j = 0; j < 6; j++){
			
			var week = document.getElementById("calendar-root").children[j];
			
			//This is a loop for the days.
			for(var i = 0; i<7;i++){

				var day = week.children[i];
				//Deciding to erase the block or add date.
				if (i<firstDay || date > lastDay){
					day.style.opacity = 0;
				} else {
					day.innerHTML = date++;
				}
			}
			firstDay = 0;
		}
	}

	var currMonth = new Date();
	var yearTrack = dateFns.getYear(currMonth);
	var monthTrack = dateFns.getMonth(currMonth);
	
	setInterval(mainClock,500);
	
	updateCalendar();
}
