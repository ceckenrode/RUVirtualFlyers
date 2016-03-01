var attachmentlimit = 10; // Limiting maximum uploads to 10
var attachmentid = 1;
function attachmore() { // Function is called when user presses Attach Another File
attachmentid += 1;
document.getElementById('attachmentdiv').innerHTML += '<div id="attachmentdiv_' + attachmentid + '" style="margin-top:5px"><input type="file" id="attachment_' + attachmentid + '" name="attachment_' + attachmentid + '" size="30" onchange="document.uploadattachments.submit();"/></div>';
if(attachmentid == attachmentlimit) {document.getElementById('addanother').style.display='none';}}