function mainClock() {
	var clock = document.getElementById("main-clock");
	var y = new Date().toLocaleTimeString();
	clock.innerHTML = y;
	setTimeout(mainClock, 1000);
}