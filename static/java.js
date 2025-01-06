
// ---------------------------------------------------

About = document.getElementById('aboutcontent');
document.getElementById('about').onclick = () => {
  About.classList.toggle('active')
}
Feed = document.getElementById('feedcontent');
document.getElementById('feed').onclick = () => {
  Feed.classList.toggle('active')
}
// ----------------------------------------------------

window.onload = () => {
  About.classList.add('active')
}






  


// Get the login modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



// Get the register modal
var modal = document.getElementById('id02');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}




