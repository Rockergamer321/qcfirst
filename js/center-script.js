$('.info-button').on("click", function() {
  $(this).next('.modal').css("display", "block"); 
});

$('.closeinfo').on("click", function() {
  $(this).closest('.modal').css("display", "none");
});

$('.roster-button').on("click", function() {
  $(this).parent().parent().siblings('.roster-modal').css("display", "block");
});

$('.closeroster').on("click", function() {
  $(this).closest('.roster-modal').css("display", "none");
});

$('.delete-button').on("click", function() {
  $(this).parent().parent().siblings('.drop-modal').css("display", "block");
});

$('.closewarning').on("click", function() {
  $(this).closest('.drop-modal').css("display", "none");
});

$('.no-button').on("click", function() {
  $(this).closest('.drop-modal').css("display", "none");
});