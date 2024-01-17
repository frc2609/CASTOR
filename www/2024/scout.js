"use strict"

$(document).ready(function(){

	$('.onstage-state').click(toggleOnstage)

	function toggleOnstage(){
		var onstage = $('#onstage-input').prop('checked')
		$('#not-onstage').toggle(!onstage)
		$('#is-onstage').toggle(onstage)
	}

	var cycles = []
	var cycle
	cycleInterrupt()

	$('.placement').click(function(){
		cycleStage("placement")
	})

	$('.collectSource').click(function(){
		cycleStage("collect")
	})

	setInterval(function(){
		$('#currentCycleTimer').text(":" + ((""+Math.round((cycle.startTime==0?0:(Date.now()-cycle.startTime))/1000)).padStart(2, "0")))
	}, 100)

	function cycleStage(place){
		if (cycle.stage==0 || cycle.lastPlace==place){
			cycle.stage = 1
			cycle.startTime = Date.now()
		} else if (cycle.stage==1){
			cycle.stage = 2
		} else {
			var cycleTime = Math.round((Date.now() - cycle.startTime)/1000)
			if (cycleTime >= 7){ // Faster than seven seconds is not possible, scouter error.
				cycles.push(cycleTime)
				$('input[name="full_cycle_fastest_seconds"]').val(Math.min(...cycles))
				$('input[name="full_cycle_average_seconds"]').val(Math.round(cycles.reduce((a,b) => a + b, 0) / cycles.length))
				$('input[name="full_cycle_count"]').val(cycles.length)
			}
			cycle.stage = 1
			cycle.startTime = Date.now()
		}
		cycle.lastPlace = place
	}

	onShowScouting.push(function(){
		cycleInterrupt()
		cycles=[]
		toggleOnstage()
		setTimeout(initialRobotStartPosition,500)
		return true
	})

	function cycleInterrupt(){
		cycle = {
			startTime: 0,
			lastPlace: "",
			stage: 0
		}
	}

	$('.count,button,label').click(function(){
		if (!$(this).is('.placement,.collectSource')) cycleInterrupt()
	})

	function initialRobotStartPosition(){
		var s = $('#auto-start-input').val()
		var m = s.match(/^([0-9]{1,2})x([0-9]{1,2})$/)
		if (!m || !m.length) return
		var px = parseInt(m[1]),
		py = parseInt(m[2])
		if (pos.startsWith('R')) px = 100 - px
		var d = document.getElementById('start-area').getBoundingClientRect(),
		r = document.getElementById('robot-starting-position'),
		s = r.getBoundingClientRect(),
		x = Math.round(px * d.width / 100 - s.width/2),
		y = Math.round(py * d.height / 100 - s.height/2)
		r.style.left=x+"px"
		r.style.top=y+"px"
	}

	function setRobotStartPosition(e){
		var d = document.getElementById('start-area').getBoundingClientRect(),
		r = document.getElementById('robot-starting-position'),
		s = r.getBoundingClientRect(),
		x = e.clientX - d.left,
		y = e.clientY - d.top,
		px = Math.round(100 * x / d.width),
		py = Math.round(100 * y / d.height)
		if (pos.startsWith('R')) px = 100 - px
		r.style.left=(x-s.width/2)+"px"
		r.style.top=(y-s.height/2)+"px"
		$('#auto-start-input').val(px+"x"+py)
	}

	$('#start-area').mousemove(function(e){
		if (e.buttons) setRobotStartPosition(e)
	})


	$('#start-area').click(setRobotStartPosition)
})
