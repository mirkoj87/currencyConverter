var xml_content = '';

$( document ).ready(function() {
	
	//*********************SOLUTION WHEN WE READ XML FROM web page( Allow-Control-Allow-Origin extension for Chrome browser is required)****************************************** 
    /*$.ajax({
		type: 'GET',
		url: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
		dataType: 'xml',
		async: false,  
	}).done(function(data) {
		xml_content = data;
		
	}).fail(function() {
		alert( "error" );
	});*/
	
	//*********************SOLUTION WHEN WE READ XML FILE FROM FILE SYSTEM******************************************
	$.ajax({
		type: 'GET',
		url: 'xml/eurofxref-daily.xml',
		dataType: 'xml',
		async: false,  
	}).done(function(data) {
		xml_content = data;
		
	}).fail(function() {
		alert( "error" );
	});
	
	loadCurrencies();
	
	//JavaScript image dropdown solution (because html does not allow attributes for option element)
	try {
	$("body select").msDropDown();
	} catch(e) {
	alert(e.message);
	}
	
});	
	
function loadCurrencies() {
		
	var from_curr = $('#from');
	var to_curr = $('#to');
	var last_update = '<p>Datum tečaja: '; 
	
		
	var cubes = xml_content.getElementsByTagName("Cube");
	//eur is missing on xml file
	var options = '<option data-image="flags/eur.png">EUR</option>';
	
	//Slovenian representation of date
	var date = cubes[1].getAttribute('time').substr(8,2);  
	var month = cubes[1].getAttribute('time').substr(5, 2);
	var year = cubes[1].getAttribute('time').substr(0, 4);
		
	last_update += date + '.' + month + '.' + year +' </p>';
	
	//add all currency names from xml file	
	for (var i = 2; i < cubes.length; i++) { 
		options += '<option data-image="flags/' + cubes[i].getAttribute('currency').toLowerCase() + '.png">'+ cubes[i].getAttribute('currency') +'</option>';
		
	}	
	from_curr.html(options);
	to_curr.html(options); 
	$(".last_update").html(last_update);
} 

function convert(){
	var from_selected = $('#from').val();
	var to_selected = $('#to').val();
	var amount = $('#amount').val();
	var result = $('#result');
	
	if(from_selected.length>0 && to_selected.length>0 && amount.length>0 ){
		
		var cubes = xml_content.getElementsByTagName("Cube");
		var fact1 ='';
		var fact2 = '';
		
		for (var i = 2; i<cubes.length; i++) {
			if(from_selected=='EUR') {
				fact1=1;
				break;
			}
			if(cubes[i].getAttribute('currency')== from_selected) {
				fact1=cubes[i].getAttribute('rate');
			}
		}
			
		for (var j = 2; j< cubes.length; j++) {
			if(to_selected=='EUR') {
				fact2=1;
				break;
			}
			if(cubes[j].getAttribute('currency')== to_selected) {
				fact2=cubes[j].getAttribute('rate')
			}
		}
		
		if(fact1!=undefined && fact2!=undefined){
			result.text((amount*fact2/fact1).toFixed(2));						
		}
	}
}




