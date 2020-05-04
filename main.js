
window.onload = function(){
	
	function mainClock() {
		let clock = document.getElementById("main-clock");
		clock.innerHTML = new Date().toLocaleTimeString();
	}
	function changeDailyView(){
		let day = document.getElementById("calendar-root").children[0].children[0];
		day.style.opacity = 1;
		updateDailyView();

	}
	function updateDailyView(){
		let day = document.getElementById("calendar-root").children[0].children[0];
		let title = document.querySelector(".calendar-days").children[0];
		title.innerHTML = dateFns.format(currDate, 'dddd');
		day.innerHTML = dateFns.getDate(currDate);
		updateFooter();
	}

	function changeWeekView(){

		let week = document.getElementById("calendar-root").children[0];
		let date = dateFns.startOfWeek(currDate);
		
		for (let i = 0; i < 7; i++) {
			let day = week.children[i];
			day.style.opacity = 1;
			day.innerHTML = dateFns.getDate(date);
			date = dateFns.addDays(date, 1);
			day.style.display = "block";
			day.addEventListener("click", null);
		}
		updateFooter();
		
	}

	function updateMonthView(){
		
		//Finding the first day of week to start at
		//and the number of days in the month
		let firstDay = dateFns.startOfMonth(currDate);
		let lastDay = dateFns.endOfMonth(currDate);
		firstDay = dateFns.getDay(firstDay);
		lastDay = dateFns.getDate(lastDay);
		
		let date = 1;

		//This is a loop for the weeks.
		for(let j = 0; j < 6; j++){
			
			let week = document.getElementById("calendar-root").children[j];
			
			//This is a loop for the days.
			for(let i = 0; i < 7; i++){

				let day = week.children[i];
				//Deciding to erase the block or add date.
				if (i<firstDay || date > lastDay){
					day.style.opacity = 0;
					day.innerHTML = "";
					day.removeEventListener("click", null);
				} else {
					day.innerHTML = date++;
					day.style.opacity = 1;
					day.addEventListener("click", null);
				}

			}	
			firstDay = 0;
		}
		updateFooter();
	}
	
	const changeDate = x => {	
		if (prevView === 'monthly'){
			currDate = dateFns.addMonths(currDate, x);
			updateMonthView()
		} else if (prevView === 'weekly'){
			currDate = dateFns.addWeeks(currDate, x);
			changeWeekView();
		} else {
			currDate = dateFns.addDays(currDate, x);
			updateDailyView();
		}
	}

	const monthDisplay = displayVal => {
		let month = document.getElementById("calendar-root");
		for(let i = 1; i < 6; i++) {
			month.children[i].style.display = displayVal;
		}
	}
	const weekDisplay = displayVal => {
		let week = document.getElementById("calendar-root").children[0];
		let titles = document.querySelector(".calendar-days");
		titles.children[0].innerHTML = "Su";
		for(let i = 1; i < 7; i++){
			titles.children[i].style.display = displayVal;
			week.children[i].style.display = displayVal;
		}
	}
	
	function changeView() {

		let change = document.getElementById("view-changer").value;
		
		if (change === 'monthly'){
			weekDisplay("block");
			monthDisplay("flex");
			updateMonthView();
		} else if (change === 'weekly'){
			monthDisplay("none");
			weekDisplay("block");
			changeWeekView();		
		} else {
			monthDisplay("none");
			weekDisplay("none");
			changeDailyView();
		}
		prevView = change;

	}
	const updateFooter = () => {
		document.getElementById("month-year").innerHTML = dateFns.format(currDate, 'MMMM, ' + dateFns.getYear(currDate));
	}
	let prevView= document.getElementById("view-changer").value;
	let currDate = new Date();

	updateMonthView();
	setInterval(mainClock,500);
	document.getElementById("left").addEventListener("click", () => {changeDate(-1)});
	document.getElementById("right").addEventListener("click", () => {changeDate(1)});
	document.getElementById("view-changer").addEventListener("change", changeView);

}
