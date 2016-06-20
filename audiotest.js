

var mics = [
	{
		 pos: [0.5, 0]
		,data: []
	}
	,{
		 pos: [0.5, Math.sqrt(1-0.25)]
		,data: []
	}
	,{
		 pos: [1.5, Math.sqrt(1-0.25)]
		,data: []
	}
]


var sampleDuration = 0.01; //seconds
var sampleRate = 8000; //hz

// generate noise
var noiseLevel = 0.05;

for(var i = 0; i < sampleDuration * sampleRate; i++){
	for(var m in mics){
		mics[m].data[i] = Math.random() * noiseLevel;
	}
}

var speedOfSound = 343.2; // m/s

var sounds = [
	{
		 data: [1, 0.5, 0.25, 0.125]
		,pos: [10, 2]
		,time: -21 // ms before start of sample
	}
	,{
		 data: [-1, 2, -1]
		,pos: [10, 30] 
		,time: -90 // ms before start of sample
	}
	,{
		 data: [0.5, -1]
		,pos: [1, 0]
		,time: 3 // ms before start of sample
	}
];

for(var i in sounds){
	for(var m in mics){
		var dist = Math.sqrt(
			  Math.pow(sounds[i].pos[0] - mics[m].pos[0], 2)
			+ Math.pow(sounds[i].pos[1] - mics[m].pos[1], 2)
		);
		var duration = Math.round((dist / speedOfSound) * 1000);
		var arrival = duration + sounds[i].time;

		for(var t in sounds[i].data){
			var index = arrival + t;
			if(index >= 0 && index < mics[m].data.length){
				mics[m].data[index] += sounds[i].data[t];
			}
		}
	}
}


render();

function render(){
	var canvasContainer = document.getElementById("canvasContainer");
	var hStretch = 10;
	var vStretch = -10;
	
	for(var i in mics){
		mics[i].canvas = document.createElement("canvas");
		mics[i].canvas.setAttribute("id", "mic"+i);
		canvasContainer.appendChild(mics[i].canvas);
		mics[i].canvas.height = 100;
		mics[i].canvas.width = (sampleDuration * sampleRate - 1) * hStretch;
		var context = mics[i].canvas.getContext("2d");

		var h = mics[i].canvas.height/2;
		var m = 0;
		context.moveTo(0, mics[i].data[0] * vStretch + h);
		while(m++ <= mics[i].data.length){
			context.lineTo(m*hStretch, mics[i].data[m] * vStretch + h);
		}
		context.stroke();
	}
}
