window.onload = function(){
	
	function mainClock() {
		let clock = document.getElementById("main-clock");
		clock.innerHTML = new Date().toLocaleTimeString();
	}
	function selectDay(e){
		let date = e.target;
		//let wrapper = date.parentElement;
		let dayNumber = Number(date.innerText);
		let diff = dateFns.getDate(dateTracker) - dayNumber;
		if (prevView === 'weekly' && Math.abs(diff) > 6){
			dateTracker = dateFns.addMonths(dateTracker, Math.sign(diff));
			updateFooter();
		}
		
		// let outer = document.createElement("div");
		// outer.id = "pop-out-wrapper";
		// wrapper.insertBefore(outer, date);
		// let dialog = document.createElement("dialog");
		// dialog.id = "pop-out";
		// outer.appendChild(dialog);
		// dialog.appendChild(document.createElement("input"));
		// dialog.show();
		modal.style.display = 'flex';
		dateTracker = dateFns.setDate(dateTracker, dayNumber);
		date.style.color = "orange";
	}
	function changeDailyView(){
		let day = document.getElementById("calendar-root").children[0].children[0].children[0];
		day.style.opacity = 1;
		day.addEventListener("click", selectDay);
		updateDailyView();
	}
	function updateDailyView(){
		let day = document.getElementById("calendar-root").children[0].children[0].children[0];
		let title = document.querySelector(".calendar-days").children[0];
		title.innerHTML = dateFns.format(dateTracker, 'dddd');
		day.innerHTML = dateFns.getDate(dateTracker);
		updateFooter();
	}

	function changeWeekView(){

		let week = document.getElementById("calendar-root").children[0];
		let date = dateFns.startOfWeek(dateTracker);
		
		for (let i = 0; i < 7; i++) {
			let day = week.children[i].children[0];
			day.style.opacity = 1;
			day.innerHTML = dateFns.getDate(date);
			date = dateFns.addDays(date, 1);
			day.style.display = "block";
			day.addEventListener("click", selectDay);
		}
		updateFooter();
		
	}

	function updateMonthView(){
		
		//Finding the first day of week to start at
		//and the number of days in the month
		let firstDay = dateFns.startOfMonth(dateTracker);
		let lastDay = dateFns.endOfMonth(dateTracker);
		firstDay = dateFns.getDay(firstDay);
		lastDay = dateFns.getDate(lastDay);
		
		let date = 1;

		//This is a loop for the weeks.
		for(let j = 0; j < 6; j++){
			
			let week = document.getElementById("calendar-root").children[j];
			
			//This is a loop for the days.
			for(let i = 0; i < 7; i++){

				let day = week.children[i].children[0];
				//Deciding to erase the block or add date.
				if (i<firstDay || date > lastDay){
					day.style.opacity = 0;
					day.innerHTML = "";
					day.removeEventListener("click", selectDay);
				} else {
					day.innerHTML = date++;
					day.style.opacity = 1;
					day.addEventListener("click", selectDay);
				}

			}	
			firstDay = 0;
		}
		updateFooter();
	}
	
	const changeDate = x => {	
		if (prevView === 'monthly'){
			dateTracker = dateFns.addMonths(dateTracker, x);
			updateMonthView()
		} else if (prevView === 'weekly'){
			dateTracker = dateFns.addWeeks(dateTracker, x);
			/* */
			changeWeekView();
		} else {
			dateTracker = dateFns.addDays(dateTracker, x);
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
		document.getElementById("month-year").innerHTML = dateFns.format(dateTracker, 'MMMM, ' + dateFns.getYear(dateTracker));
	}
	const closeModal = () => {modal.style.display = 'none';}
	let prevView= document.getElementById("view-changer").value;
	let dateTracker = new Date();

	updateMonthView();
	setInterval(mainClock,500);
	document.getElementById("left").addEventListener("click", () => {changeDate(-1)});
	document.getElementById("right").addEventListener("click", () => {changeDate(1)});
	document.getElementById("view-changer").addEventListener("change", changeView);
	document.getElementsByClassName("close-btn")[0].addEventListener("click", closeModal);

	let modal = document.getElementsByClassName('modal')[0];

}
