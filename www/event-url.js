var eventId=(location.hash.match(/^\#(?:(?:.*\&)?(?:event\=))?(20[0-9]{2}[a-zA-Z0-9_\-]+)(?:\&.*)?$/)||["",""])[1]
var eventYear = eventId.replace(/([0-9]{4}).*/,'$1')
var eventVenue = eventId.replace(/[0-9]{4}(.*)/,'$1')
var eventName = `${eventYear} ${eventVenue}`
var eventMatches = []
var eventAlliances = []
var eventStats = []
var eventFiles = []
function eventAjax(file,callback){
    $.ajax({
        async: true,  
        beforeSend: function(xhr){
            xhr.overrideMimeType("text/plain;charset=UTF-8");
        },
        url: file,
        timeout: 5000,
        cache: false,
        type: "GET",
        success: callback,
        error: function(xhr,status,err){
            console.log(err)
            callback("")
        }
    })
}
function csvToArrayOfMaps(csv){
    var arr = []
    var lines = csv.split(/[\r\n]+/)
    if (lines.length>0){
        var headers = lines.shift().split(/,/)
        for(var i=0; i<lines.length; i++){
            if (lines[i]){
                var data = lines[i].split(/[,]/)
                var map = {}
                for (var j=0; j<data.length; j++){
                    map[headers[j]] = /^[0-9]+$/.test(data[j])?parseInt(data[j]):data[j]
                }
                arr.push(map)
            }
        }
    }
    return arr
}
function loadEventSchedule(callback){
    eventAjax(`/data/${eventId}.schedule.csv`,function(text){
        eventMatches=csvToArrayOfMaps(text)
        if (callback) callback(eventMatches)
    })
}
function loadAlliances(callback){
    eventAjax(`/data/${eventId}.alliances.csv`,function(text){
        eventAlliances=csvToArrayOfMaps(text)
        if (callback) callback(eventAlliances)
    })
}
function loadEventStats(callback){
    eventAjax(`/data/${eventId}.txt`,function(text){
        eventStats=csvToArrayOfMaps(text)
        if (callback) callback(eventStats)
    })
}
function loadEventFiles(callback){
    eventAjax(`/event-files.cgi?event=${eventId}`,function(text){
        eventFiles=text.split(/[\n\r]+/)
        if (callback) callback(eventFiles)
    })
}
function getUploads(){
    var uploads = []
    var year = eventId.substring(0,4)
    for (i in localStorage){
        if (new RegExp(`^${year}.*_.*_`).test(i)) {
            uploads.push(localStorage.getItem(i))
        }
    }
    return uploads
}