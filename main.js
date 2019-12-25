
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
					day.innerHTML = "";
					day.removeEventListener("click",imageAppear);
				} else {
					day.innerHTML = date++;
					day.style.opacity = 1;
					day.addEventListener("click",imageAppear);
				}

			}	
			firstDay = 0;
		}
		document.getElementById("month-year").innerHTML = dateFns.format(currMonth, 'MMMM, ' + yearTrack);
	}
	
	function updateMonth(x){
		
		if((x<0) && (monthTrack==0)){
			monthTrack = 11;
			yearTrack--;
		} else if ((x>0) && (monthTrack == 11)){
			monthTrack = 0;
			yearTrack++;
		} else {
			monthTrack += x;
		}
		
		currMonth = dateFns.setMonth(currMonth, monthTrack);
		currMonth = dateFns.setYear(currMonth, yearTrack);
		updateCalendar();
	}
	
	async function newImage(){
		let response = await fetch('https://dog.ceo/api/breeds/image/random');
		let data = await response.json();
		let url = data.message;
		
		//Setting the image
		document.getElementById("image").src = url;

		//Setting the breed string
		let breed = url.split("/")[4].toLowerCase();
		document.getElementById("quote").innerHTML = "This is a " + breed;
	}

	function imageAppear(){
		document.getElementById("image-container").style.display = "flex";
	}

	function exitOut(){
		document.getElementById("image-container").style.display = "none";
		newImage();
	}
	

	var currMonth = new Date();
	var yearTrack = dateFns.getYear(currMonth);
	var monthTrack = dateFns.getMonth(currMonth);
	updateCalendar();
	setInterval(mainClock,500);
	document.getElementById("left").addEventListener("click",function(){updateMonth(-1)});
	document.getElementById("right").addEventListener("click",function(){updateMonth(1)});
	document.getElementById("close").addEventListener("click", exitOut);
	newImage();
	
}
