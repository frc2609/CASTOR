"use strict"

function aggregateStats(scout, aggregate){

	var pointValues = {
		"auto_leave":2,
		"auto_amp":2,
		"auto_speaker":5,
		"tele_amp":1,
		"tele_speaker_unamped":2,
		"tele_speaker_amped":5,
		"tele_trap":5,
		"tele_park":1,
		"tele_onstage":3,
		"tele_spotlit":1,
		"tele_harmony":2,
	}

	scout["auto_collect_home"] =
		scout["auto_collect_blue_mid"]||0+
		scout["auto_collect_blue_mid_amp"]||0+
		scout["auto_collect_blue_amp"]||0+
		scout["auto_collect_red_mid"]||0+
		scout["auto_collect_red_mid_amp"]||0+
		scout["auto_collect_red_amp"]||0
	scout["auto_collect_center"] =
		scout["auto_collect_centerline_source"]||0+
		scout["auto_collect_centerline_mid_source"]||0+
		scout["auto_collect_centerline_mid"]||0+
		scout["auto_collect_centerline_mid_amp"]||0+
		scout["auto_collect_centerline_amp"]||0
	scout["auto_collect"] = scout["auto_collect_home"] + scout["auto_collect_center"]
	scout["auto_amp_score"] = pointValues["auto_amp"] * scout["auto_amp"]||0
	scout["auto_speaker_score"] = pointValues["auto_speaker"] * scout["auto_speaker"]||0

	// TODO

	var cycleSeconds =  (scout['full_cycle_count']||0) * (scout["full_cycle_average_seconds"]||0) + (aggregate['full_cycle_count']||0) * (aggregate["full_cycle_average_seconds"]||0)
	var cycles = (scout['full_cycle_count']||0) + (aggregate['full_cycle_count']||0)

	Object.keys(statInfo).forEach(function(field){
		if(/^(\%|avg|count)$/.test(statInfo[field]['type'])){
			aggregate[field] = (aggregate[field]||0)+(scout[field]||0)
			var set = `${field}_set`
			aggregate[set] = aggregate[set]||[]
			aggregate[set].push(scout[field]||0)
		}
		if(/^capability$/.test(statInfo[field]['type'])) aggregate[field] = aggregate[field]||scout[field]||0
		if(/^text$/.test(statInfo[field]['type'])) aggregate[field] = (!aggregate[field]||aggregate[field]==scout[field])?scout[field]:"various"
	})
	aggregate["count"] = (aggregate["count"]||0)+1
	aggregate["event"] = scout["event"]
	aggregate["full_cycle_fastest_seconds"] = (scout["full_cycle_fastest_seconds"]&&(aggregate["full_cycle_fastest_seconds"]||999)>scout["full_cycle_fastest_seconds"])?scout["full_cycle_fastest_seconds"]:(aggregate["full_cycle_fastest_seconds"]||0)
	if (cycles > 0) aggregate["full_cycle_average_seconds"] = Math.round(cycleSeconds / cycles)
	aggregate["max_score"] = Math.max(aggregate["max_score"]||0,scout["score"])
	aggregate["min_score"] = Math.min(aggregate["min_score"]===undefined?999:aggregate["min_score"],scout["score"])
	aggregate["tele_max_place_score"] = Math.max(aggregate["tele_max_place_score"]||0,scout["tele_place_score"])
	aggregate["tele_min_place_score"] = Math.min(aggregate["tele_min_place_score"]===undefined?999:aggregate["tele_min_place_score"],scout["tele_place_score"])
}

var statInfo = {
	"event": {
		name: "Event",
		type: "text"
	},
	"match": {
		name: "Match",
		type: "text"
	},
	"team": {
		name: "Team",
		type: "text"
	},
	"auto_start": {
		name: "Location where the robot starts",
		type: "text"
	},
	"auto_leave": {
		name: "Exited the Starting Area During Auto",
		type: "%"
	},
	"auto_collect_blue_mid": {
		name: "Collected Blue Wing Note Midfield During Auto",
		type: "%"
	},
	"auto_collect_blue_mid_amp": {
		name: "Collected Blue Wing Note Between Midfield and Amp During Auto",
		type: "%"
	},
	"auto_collect_blue_amp": {
		name: "Collected Blue Wing Note Nearest Amp During Auto",
		type: "%"
	},
	"auto_collect_centerline_source": {
		name: "Collected Centerline Note Nearest Source During Auto",
		type: "%"
	},
	"auto_collect_centerline_mid_source": {
		name: "Collected Centerline Note Between Midfield and Amp During Auto",
		type: "%"
	},
	"auto_collect_centerline_mid": {
		name: "Collected Centerline Note Midfield During Auto",
		type: "%"
	},
	"auto_collect_centerline_mid_amp": {
		name: "Collected Centerline Note Between Midfield and Source During Auto",
		type: "%"
	},
	"auto_collect_centerline_amp": {
		name: "Collected Centerline Nearest Amp During Auto",
		type: "%"
	},
	"auto_collect_red_mid": {
		name: "Collected Red Wing Note Midfield During Auto",
		type: "%"
	},
	"auto_collect_red_mid_amp": {
		name: "Collected Red Wing Note Between Midfield and Amp During Auto",
		type: "%"
	},
	"auto_collect_red_amp": {
		name: "Collected Red Wing Note Nearest Amp During Auto",
		type: "%"
	},
	"auto_collect_home": {
		name: "Notes Collected from the Home Wing During Auto",
		type: "avg"
	},
	"auto_collect_center": {
		name: "Notes Collected from Center Field During Auto",
		type: "avg"
	},
	"auto_collect": {
		name: "Notes Collected During Auto",
		type: "avg"
	},
	"auto_amp": {
		name: "Notes Placed in the Amp During Auto",
		type: "avg"
	},
	"auto_amp_score": {
		name: "Score in the Amp During Auto",
		type: "avg"
	},
	"auto_speaker": {
		name: "Notes Shot in the Speaker During Auto",
		type: "avg"
	},
	"auto_speaker_score": {
		name: "Score in the Speaker During Auto",
		type: "avg"
	},
	"coopertition": {
		name: "Alliance activated coopertition light",
		type: "%"
	}
	//tele_collect_home,tele_collect_center,tele_collect_source,tele_amp,tele_speaker_unamped,tele_speaker_amped,trap,tele_drop,full_cycle_fastest_seconds,full_cycle_average_seconds,full_cycle_count,onstage,harmony,floor_pickup,source_pickup,passing,stashing,chain_end,scouter,comments,created,modified

}

var teamGraphs = {
}

var aggregateGraphs = {
}

function showPitScouting(el,team){
}

var whiteboardStamps = [
]
