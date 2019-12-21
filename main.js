
window.onload = function(){
	
	function mainClock() {
		var clock = document.getElementById("main-clock");
		clock.innerHTML = new Date().toLocaleTimeString();
	}

	setInterval(mainClock,500);
}
