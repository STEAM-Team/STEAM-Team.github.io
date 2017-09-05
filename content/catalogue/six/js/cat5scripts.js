// Read More/less
// Note that now that we have UOttawa, we have a french translation
//////////////////////////
$('.read-button').on('click', function() { 
	if ($(this).text() == 'Read more'){
		$(this).html('Read less');
	}
	else if($(this).text() == 'En savoir plus'){
		$(this).html('En savoir moins');
	}
	else if($(this).text() == 'En savoir moins'){
		$(this).html('En savoir plus');
	}
	else { 
		//$(this).html('En savoir plus');
		$(this).html('Read more');
	}
});
