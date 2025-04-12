var focus_on_preview = 0;

window.onload = function() {
  if(location.pathname.split("/").slice(-1) == "index.html") {
    document.getElementById("searchbox").focus();
  }
}

function quickNavigation(event) {
  let prev = document.getElementsByClassName("preview");
  el = document.activeElement;
  if(el.id == "searchbox") { //sets the focus if previous focus on searchbox
    if (event.code == "ArrowUp") {
      prev[prev.length - 1].focus();
      focus_on_preview = prev.length - 1;
    } else {
      prev[0].focus();
      focus_on_preview = 0;
    }
  } else { //sets the focus if previous focus NOT on searchbox
    if (event.key == "ArrowUp") { 
      if (focus_on_preview == 0) {
        focus_on_preview = prev.length - 1;
      } else {
        focus_on_preview -= 1;
      }
    } else if (event.key == "ArrowDown"){
      if (focus_on_preview == prev.length - 1) {
        focus_on_preview = 0;
      } else {
        focus_on_preview += 1;
      }
    }
    prev[focus_on_preview].focus();
  }
}

function updatePreview(event) {
  if (event.code == "ArrowUp" || event.code == "ArrowDown") {
    quickNavigation(event);
    return;
  }

  let filter, preview_box, preview_list, begin, end, counter;
  counter = 0; //used for limiting the max previews
  filter = document.getElementById('searchbox').value.toUpperCase(); //the search string
  preview_list = new Set(); //collects all previews, that will be shown
  preview_box = document.getElementsByClassName('preview-box')[0]; //the box in which the previews are appearing
  
  const response = fetch('/resources/json/sites.json')
  .then((response) => response.json())
  .then((json) => {
    if (filter != "") {
      const hr = document.createElement('hr'); //adds a horizontal line first
      hr.className = "base-seperator";
      preview_list.add(hr);
      for (let i = 0; i < json.sitelist.length; i++) {
        begin = json.sitelist[i].name.toUpperCase().indexOf(filter);
        end = begin + filter.length;
        
        if (begin > -1) {
          const li = document.createElement('li'); //generating list element
          li.className = "base-li";
          const preview = document.createElement('a'); //generating html link
          preview.href = json.sitelist[i].href;
          preview.className = "preview";
          preview.addEventListener("keydown", quickNavigation);
          preview.innerHTML = 
            json.sitelist[i].name.substring(0, begin) + 
            '<b>' + json.sitelist[i].name.substring(begin, end) + '</b>' + 
            json.sitelist[i].name.substring(end, json.sitelist[i].name.length);
          li.appendChild(preview);
          //console.log(li); 
          preview_list.add(li);
          counter += 1;
        }   
        
        if (counter >= 5) {
          break;
        }
      }
    }
    
    preview_box.textContent = ''; //deletes all previous previews
    preview_box.style.paddingBottom = "0px";
    if (preview_list.size > 1) {
      preview_box.style.paddingBottom = "20px";
      for (const el of preview_list) { //adds new previews
        preview_box.appendChild(el);   
      }  
    }
  });
  
}

function enterSearch(evt) {
  alert("entered");
}
