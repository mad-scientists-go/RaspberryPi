var Gpio = require('pigpio').Gpio
var trigger = new Gpio(23, {mode: Gpio.OUTPUT})
var echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
console.log('1')

var io = require ('socket.io-client')
var socket = io.connect("https://16410a46.ngrok.io",{reconnection:true})
//socket.connect()
console.log('2')
socket.on('connect',function(data){
	console.log('Connected to the pi')
	var MICROSECONDS_PER_CM = 1e6/34321;
	trigger.digitalWrite(0);
	//(function(){
	var startTick;
	//var arr =[2]
	var arr2=[];
	var p1 = 0
	var p2 = p1-1
	var unitPurchased
	var qtyOnShelf = 2
	echo.on('alert',function(level,tick){
		var endTick,diff;
		if(level === 1){
			startTick = tick
		}else{
			endTick= tick
			diff = endTick - startTick;
			let halfDiff = diff/2 
			// a is distance in cm from sensor to 1st surfsce of reflection
			let a = (halfDiff / MICROSECONDS_PER_CM)
			let qty = 5 - Math.floor(a/4.25)    
			// 4.25 is the breadth of the product . Taking total quantity to be 5 (5*4.25 //measure it in the demo)
			
			//if(quantity changes){spcket.emit to send the new quantity. also check that its someone taking a can
			//and not a disturbance}
			if(qty !== qtyOnShelf){
				if(arr2.length === 0){
					arr2.push(qty)
				}else{
					if(qty === arr2[arr2.length-1]){
						arr2.push(qty)
						if(arr2.length >2){
							unitPurchased = qtyOnShelf - arr2[arr2.length-1]
							qtyOnShelf= arr2[arr2.length-1]
							arr2 = []
							socket.emit('sensorData',unitPurchased)
						}
					}else{
						arr2=[qty]
					}
				}
			}else{
			
			}
			console.log('arr',qtyOnShelf)
			console.log('arr2',arr2)
			//arr[p1]!==arr[p2]
			}
	
	})
	//}())
	setInterval(function(){
		trigger.trigger(100,1)
	},500)
	
})
