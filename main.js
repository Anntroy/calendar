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
	
	const addNote = (event) => {
		event.preventDefault();
		//Div for note + btns
		const noteDiv = document.createElement("div");
		noteDiv.classList.add("note");
		//Note
		const newNote = document.createElement("li");
		newNote.innerText = noteInput.value;
		if (newNote.innerText === "") return;
		newNote.classList.add("note-item");
		noteDiv.appendChild(newNote);
		saveLocalNotes(noteInput.value);
		//Check button
		const completedButton = document.createElement("button");
		completedButton.innerHTML = "<i class='fas fa-check'></i>";
		completedButton.classList.add("complete-btn");
		noteDiv.appendChild(completedButton);
		//Trash button
		const trashButton = document.createElement("button");
		trashButton.innerHTML = "<i class='fas fa-trash'></i>";
		trashButton.classList.add("trash-btn");
		noteDiv.appendChild(trashButton);

		noteList.appendChild(noteDiv);
		noteInput.value = "";
	}
	const deleteCheck = (event) => {
		const item = event.target;
		const note = item.parentElement;
		if (item.classList[0] === "trash-btn"){
			note.classList.add("deleted");
			removeLocalNote(note);
			note.addEventListener("transitionend",() => {note.remove()});
		}
		if (item.classList[0] === "complete-btn"){
			note.classList.toggle("completed");
		}
	}
	const saveLocalNotes = (note) => {
		let notes;
		if (localStorage.getItem("notes") === null) {
			notes = [];
		}else{
			notes = JSON.parse(localStorage.getItem("notes"));
		}
		notes.push(note);
		localStorage.setItem("notes", JSON.stringify(notes));
	}
	const getNotes = () => {
		let notes;
		if (localStorage.getItem("notes") === null) {
			notes = [];
		}else{
			notes = JSON.parse(localStorage.getItem("notes"));
		}
		notes.forEach((note)=> {
			//Div for note + btns
			const noteDiv = document.createElement("div");
			noteDiv.classList.add("note");
			//Note
			const newNote = document.createElement("li");
			newNote.innerText = note;
			if (newNote.innerText === "") return;
			newNote.classList.add("note-item");
			noteDiv.appendChild(newNote);
			//Check button
			const completedButton = document.createElement("button");
			completedButton.innerHTML = "<i class='fas fa-check'></i>";
			completedButton.classList.add("complete-btn");
			noteDiv.appendChild(completedButton);
			//Trash button
			const trashButton = document.createElement("button");
			trashButton.innerHTML = "<i class='fas fa-trash'></i>";
			trashButton.classList.add("trash-btn");
			noteDiv.appendChild(trashButton);

			noteList.appendChild(noteDiv);
		});
	}
	const removeLocalNote = (note) => {
		let notes;
		if (localStorage.getItem("notes") === null) {
			notes = [];
		}else{
			notes = JSON.parse(localStorage.getItem("notes"));
		}
		const noteIndex = note.children[0].innerText;
		notes.splice(notes.indexOf(noteIndex), 1);
		localStorage.setItem("notes", JSON.stringify(notes));
	}
	
	let prevView= document.getElementById("view-changer").value;
	let dateTracker = new Date();
	const modal = document.getElementsByClassName('modal')[0];
	const noteInput = document.querySelector('.note-input');
	const noteButton = document.querySelector('.note-btn');
	const noteList = document.querySelector('.note-list');

	updateMonthView();
	setInterval(mainClock,500);
	document.getElementById("left").addEventListener("click", () => {changeDate(-1)});
	document.getElementById("right").addEventListener("click", () => {changeDate(1)});
	document.getElementById("view-changer").addEventListener("change", changeView);
	document.getElementsByClassName("close-btn")[0].addEventListener("click", closeModal);
	getNotes();
	noteButton.addEventListener("click", addNote);
	noteList.addEventListener("click", deleteCheck);


}
