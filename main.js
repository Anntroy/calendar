function mainClock() {
	var clock = document.getElementById("main-clock");
	clock.innerHTML = new Date().toLocaleTimeString();
}