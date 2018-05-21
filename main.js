var main = main || {};

/* Will Hold searchData */
main.searchData = {};

/* To avoid unnecessary search calls. Compare with previous term searched */
main.oldSearchTerm;

main.search = function(event) {
	try {
		
		// trimming white space 
		var search_item = event.target.value.toLowerCase().trim();
		
		if (main.oldSearchTerm !== search_item) {
			var renderData = main.searchData.filter(function(item) {
				return item.name.toLowerCase().indexOf(search_item) == 0;
			});

			main.render(renderData);

			$noResult = document.getElementById('no-result');

			if ($noResult) {
				if (renderData && renderData.length > 0) {
					$noResult.style.display  = 'none';

				} else {
					$noResult.style.display  = 'block';
				}
			}
		}

		main.oldSearchTerm = search_item;
		
	} catch(e) {

	}
}


main.selectClickedUser = function(id) {
	try {

		$inputTxt 			= document.getElementById('inpTxt');
		$selectedDiv 		= document.getElementById(id);
		$allResultsDiv 		= document.getElementById('tplHtmlResults');

		/* Add the text to search bar $inputTxt, and hide the div */
		$inputTxt.value = $selectedDiv.innerHTML;

		/* 
			Some post Click work 
			- Hide other results
			- 

		*/
	
		$allResultsDiv.style.display = 'none';


	} catch(e) {

	}
}


/**
 * This function is a custom Templating render function. 
 * It eliminates having HTML concatenation in the JS file like:
 *
 * str += "<div id=\"renderDiv\">\
 * 		   <p>Some text</p>\
 * 		  </div>";
 *
 * Avoiding the above, helps keep the JS file clean and free from HTML. 
 * The trade-off here is a bit of extra looping.
 * Since the render is a client side function, an extra loop doesn't impact the system performance.
 *
 * Moreover, it is a reusable function. Pass on any JSON array, 
 * have it's template in the HTML, reference it here and the job is done.
 * 
 */
main.render = function(renderData) {
	try {

		var $template = document.getElementById("HtmlResults").innerHTML;
		var str = $template;
		
		var toRenderTemplate = "";

		renderData.forEach(function(value){
		
		/* For each object in JSON, we import out raw template and then, in the next loop replace handlebar values */
		str = $template;

 			
 			/* Iterate through each key in every object */
 			Object.keys(value).forEach(function(keyNames) {
 				
 				/* KeyNames: e.g: "city" */
 				// console.log(keyNames)

 				/* Values e.g: "Dallas" */
 				// console.log(value[keyNames]);

 				var first_name_handelbar = new RegExp("{{\\s*?" + keyNames + "\\s*?}}", 'ig');
				str = str.replace(first_name_handelbar, value[keyNames]);	

 			});

 			toRenderTemplate += str;

		});
		
		// console.log(toRenderTemplate);
		if (renderData && renderData.length > 0) {
			$renderDiv = document.getElementById("tplHtmlResults");
			$renderDiv.innerHTML = toRenderTemplate;
			$renderDiv.style.display = 'block';

		} else {
			$renderDiv.style.display = 'none';
		}


	} catch(e) {

	}
}


document.addEventListener("DOMContentLoaded", function() {
  
  	// Make ajax and load Data
  	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

    

        if (this.readyState == 4 && this.status == 200) {
            main.searchData = JSON.parse(this.responseText);
            
            /* Render all the data initially */
            main.render(main.searchData);

        }
    };

    xhttp.open("GET", "./data.json", true);
    xhttp.send();
  
});