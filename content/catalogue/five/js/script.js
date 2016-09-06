// Make links to articles go to offset
///////////////////////////////////////////////
// Via http://stackoverflow.com/questions/17534661/make-anchor-link-go-some-pixels-above-where-its-linked-to
// Makes links to articles go an offset of 100px up from the actual article
// The function actually applying the offset
function offsetAnchor(e) {
	if (e){
		/* If event, check if newURL is different than oldURL (actual has change)*/
		console.log('hashchange')
		// console.log('event', e)
		// console.log('oldUrl', e.originalEvent.oldURL)
		// console.log('newUrl', e.originalEvent.newURL)
		// /* If url not changed, exit here*/
		// console.log('same:', e.originalEvent.oldURL == e.originalEvent.newURL)
	}else{
		/* If just page load*/
		console.log('page load')
	}
	console.log(window.location.href.indexOf(location.hash))
	if(location.hash.length !== 0) {
		window.scrollTo(window.scrollX, window.scrollY - 100);
	}
}
// This will capture hash changes while on the page
$(window).on("hashchange", function(event){
	offsetAnchor(event)
});

// This is here so that when you enter the page with a hash,
// it can provide the offset in that case too. Having a timeout
// seems necessary to allow the browser to jump to the anchor first.
window.setTimeout(offsetAnchor, 1); 

// /* If link clicked, and link dest is local section
$('a').click(function(e)
{
	console.log('a type clicked')
	var href = $(this)[0].getAttribute('href')
	var currURL = window.location.href
	/* If a contains href, and href starts with '#' (local)*/
	if (href && (href.indexOf('#') === 0) && (currURL.indexOf(href) !== -1)){
		/* If currentURL contains href, prevent default*/
		console.log('local dest, already here, so prevent default')
		e.preventDefault()
	}
})

// Nav bar
//////////////////////////
$(document).ready(function(){
	var h = window.innerHeight;

	$(window).on('scroll',function() {
		var scrolltop = $(this).scrollTop();

		if(scrolltop >= h) {
			$("#fixed-nav-bar").show()
		}
		else if(scrolltop <= h) {
			$("#fixed-nav-bar").hide()
		}
	});
});

// Read More/less
//////////////////////////
$('.read-button').on('click', function() { 
	if ($(this).text() == 'Read more'){
		$(this).html('Read less');
	}else{
		$(this).html('Read more');
	}
});

// We Are
////////////////////////////////
// If any about-collapse is shown, hide text
$('.about-collapse').on('shown.bs.collapse', function() { 
	$('#select-text').html('');
	var id = this.id
	var res = id.split('-')
	// If a "... collapse-right" class, do nothing (don't do it twice)
	if (res[res.length-1] != 'right'){
		// Parse id of button
		var button = document.getElementById(res[0]+'-button')
		button.classList.add(res[0]+'-active')

		// Set this id as curr open
		document.getElementById('We-Are').setAttribute('curr-open', res[0])

		// // Set colors to match the shown collapse if within range
		var curr = window.pageYOffset
		var offsetVar = window.innerHeight/4.5
		var top = offset(document.getElementById('We-Are')).top
		if (curr > top - offsetVar){
			console.log('in range')
			var htmlStyles = window.getComputedStyle(document.querySelector("html"));
			// Parse color
			var colorName = '--'+res[0]
			var color = htmlStyles.getPropertyValue(colorName)
			document.querySelector("html").style.setProperty("--color-one", color);
			document.querySelector("html").style.setProperty("--color-two", color);
			document.querySelector("html").style.setProperty("--color-three", color);
			document.querySelector("html").style.setProperty("--color-four", color);
		}
	}
});

// If any about-collapse is hidden, show text 
// remove active class
$('.about-collapse').on('hidden.bs.collapse', function() { 
	$('#select-text').html('Select a school for club information.');
	var id = this.id
	var res = id.split('-')
	// If a "... collapse-right" class, do nothing (don't do it twice)
	if (res[res.length-1] != 'right'){
		// Parse id of button
		var button = document.getElementById(res[0]+'-button')
		button.classList.remove(res[0]+'-active')

		// Set nothing as curr open
		document.getElementById('We-Are').setAttribute('curr-open', 'false')

		document.querySelector("html").style.setProperty("--color-one", '#000000');
		document.querySelector("html").style.setProperty("--color-two", '#000000');
		document.querySelector("html").style.setProperty("--color-three", '#000000');
		document.querySelector("html").style.setProperty("--color-four", '#000000');
	}
});

// If We-Are expanded, collapse all others and remove *-active class
$("[data-collapse-group='about-collapse-group']").click(function () {
	var $this = $(this);
	// Add active-class to current 
	var name = this.id.split('-')[0]
	var addClassName = name+'-active'
	$this.addClass(addClassName)

	// Evaluate all others
	$("[data-collapse-group='about-collapse-group']:not([data-target='" + $this.data("target") + "'])").each(function () {
			// Collapse all others
			$($(this).data("target")).removeClass("in").addClass('collapse');
			// Make sure active is off for all others
			var removeClassName = this.id.split('-')[0] + '-active'
			$($(this).removeClass(removeClassName))
	});
});

// Helper class for fetching and updating info on scroll/click/resize/internal link
///////////////////////////////////////////////
function getObjectInfo(){
	console.log('recalculating')
	// Get just <section class ="full"> elements
	// var sections = document.getElementsByClassName("full")
	var sections = document.getElementsByTagName("section")
	var array = Array.prototype.slice.call(sections)
	var objectInfo = []
	for (var i = 0; i < array.length; i++){
		var orig = array[i].id
		// If an open We-Are section, modify this
		if (array[i].id == 'We-Are' && array[i].getAttribute('curr-open') != 'false'){
			var currOpen = array[i].getAttribute('curr-open')
			orig = array[i].id+'-'+currOpen
		}
		var currName = false
		var el = false
		var currTop = false
		/* If has id and id not empty */
		if (array[i].id && array[i].id.length > 0){
			currName = replaceAll(array[i].id, '-', ' ')
			el = array[i]
			currTop = offset(el).top
		}
		if (array[i].id == "Home" || array[i].id == "Graphic"){
			currName = false
		}

		var object = {name: currName, top: currTop, orig: orig}
		objectInfo.push(object)
	}
	// Ensure sorted by increasing y value
	objectInfo = objectInfo.sort(function(a, b){
		return a.top - b.top
	})
	return objectInfo
}

// Force recalculate on resize
window.onresize=function(){
	console.log('Resize')
	showSectionName()
}

// Force recalculate on hash change (internal link)
window.onhashchange=function(){
	console.log("Hash change")
	showSectionName()
}

$('.about-button').on('click', function(){
	console.log("About button clicked")
	showSectionName()
})

function offset(el) {
	var rect = el.getBoundingClientRect(),
	scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

// function replaceAll(str, find, replace) {
// 	return str.replace(new RegExp(find, 'g'), replace);
// }

function escapeRegExp(str) {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

// Recalculate on scroll
window.onscroll = function(){showSectionName()}

function showSectionName(){
	var offset = window.innerHeight/4.5
	// Always fetch new object info (handles Read More clicked)
	var objectInfo = this.getObjectInfo()
	var curr = window.pageYOffset
	// No need to binary search, probably fast enough
	for (var i = 0; i < objectInfo.length; i++){
		if (curr > objectInfo[i].top - offset){
			if (objectInfo[i].name){
				console.log('name evaluating:', name)
				document.getElementById("updateText").innerHTML = objectInfo[i].name
				var colorInfo = getColors(objectInfo[i].orig)
				document.querySelector("html").style.setProperty("--color-one", colorInfo[0]);
				document.querySelector("html").style.setProperty("--color-two", colorInfo[1]);
				document.querySelector("html").style.setProperty("--color-three", colorInfo[2]);
				document.querySelector("html").style.setProperty("--color-four", colorInfo[3]);	
			}else{
				console.log('No name FULL section, set blank')
				document.getElementById("updateText").innerHTML = ''
				document.querySelector("html").style.setProperty("--color-one", '#000000');
				document.querySelector("html").style.setProperty("--color-two", '#000000');
				document.querySelector("html").style.setProperty("--color-three", '#000000');
				document.querySelector("html").style.setProperty("--color-four", '#000000');	
			}
		}
	}	
}

function getColors(name){
	return colorDict[articleDict[name]]
}

/* Hardcoded dict unless you think of a better way */
var articleDict = {
	'Welcome': 'standard',
	'Catalogue-Five': 'standard',
	'Contents': 'standard',
	'Foreword': 'standard',
	'Hello-From': 'standard',
	'Rutgers-University': 'rutgers',
	'Boston-University': 'bu',
	'Harvard-University': 'harvard',
	'The-New-School': 'new-school',
	'University-of-Michigan': 'michigan',
	'University-of-Ottawa': 'ottawa',
	'MIT': 'mit',
	'Yale': 'yale',
	'Meet-Me-in-the-Middle': 'brown',
	'Time-Well-Spent': 'risd',
	'Mushroom-Hunt': 'risd-brown',
	'Laurence-Humier': 'risd',
	'Weather-or-Not?': 'risd-brown',
	'GENSPACE': 'standard',
	'Citizen-+-Virtual': 'risd-brown-mit-bu',
	'ADAPTATION': 'standard',
	'Gingko-Bioworks': 'risd-brown',
	'Brainy-Beats': 'brown',
	'RIGAMAJIG': 'risd',
	'STEAM-Assistive-Makeathon': 'brown',
	'STEAM-Week': 'risd',
	'DISCIPLINARYISM': 'standard',
	'Worlds-From-Cardboard': 'risd-brown',
	'Yeast-Selfies': 'risd-brown',
	'Looking-Forward-and-Ahead': 'standard',
	'We-Are': 'standard',
	'Colophon': 'standard',
	'We-Are-RISD': 'risd',
	'We-Are-Brown': 'brown',
	'We-Are-MIT': 'mit',
	'We-Are-Yale': 'yale',
	'We-Are-BU': 'bu',
	'We-Are-Harvard': 'harvard',
	'We-Are-Rutgers': 'rutgers',
	'We-Are-New': 'new-school',
	'STARTING-STEAM-@-YOUR-SCHOOL': 'standard',
}

var colorDict = {
	/* Nav bar styles*/
	// Default
	'standard': ['#000000', '#000000', '#000000', '#000000'],
	// Rutgers
	'rutgers': ['#6048a8', '#6048a8', '#6048a8', '#6048a8'],
	// BU
	'bu': ['#0ba016', '#0ba016', '#0ba016', '#0ba016'], 
	// Harvard
	'harvard': ['#fcc342', '#fcc342', '#fcc342', '#fcc342'],
	// New School
	'new-school': ['#f77116', '#f77116', '#f77116', '#f77116'],
	// Michigan
	'michigan': ['#B3C100', '#B3C100', '#B3C100', '#B3C100'],
	// Ottawa
	'ottawa': ['#C60967', '#C60967', '#C60967', '#C60967'],
	// MIT
	'mit': ['#24A8B3', '#24A8B3', '#24A8B3', '#24A8B3'], 
	// Yale
	'yale': ['#1A76BB', '#1A76BB', '#1A76BB', '#1A76BB'],
	// Brown
	'brown': ['#EC1C24', '#EC1C24', '#EC1C24', '#EC1C24'],
	// RISD
	'risd': ['#737373', '#737373', '#737373', '#737373'],
	// RISD+Brown
	'risd-brown': ['#737373', '#737373', '#EC1C24', '#EC1C24'],
	// RISD+Brown+MIT+BU
	'risd-brown-mit-bu': ['#737373', '#EC1C24', '#24A8B3', '#0ba016'],
}