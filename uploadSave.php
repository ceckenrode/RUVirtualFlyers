$conn=mysql_connect("rutgers_locations","root","")
    or die("Could Not Connect to the Server...");

    $db=mysql_select_db("pratham",$conn) 
    or die("Could not select Databse...");
if(isset($_REQUEST['submit'])) {$path = "upload/";
$filename1 = $_POST['entity'];
echo $pic1 = $path . $filename1 . "/" ;
mkdir($pic1, 0, true); $target_path = $pic1; for($i=1;$i<=5;$i++) {
$attachments = 'attachment_'.$i;
$attachmentdiv = 'attachmentdiv_'.$i;
$FileName = $_FILES[$attachments]['name']; if($FileName != "") 
{
  $FileType = $_FILES[$attachments]['type'];
  $FileExtension = strtolower(substr($FileName,strrpos($FileName,'.')+1));
  // Check for supported file formats
  if($FileExtension != "gif" && $FileExtension != "jpg" && $FileExtension != "png" && $FileExtension != "doc" && $FileExtension != "docx" && $FileExtension != "pdf" && $FileExtension != "xls" && $FileExtension != "xlsx" && $FileExtension != "txt" && $FileExtension != "rtf")
{ echo "<script type='text/javascript'>parent.document.getElementById('typeerrormessage').style.display = 'inline';</script>";}
else {$FileSize = round($_FILES[$attachments]['size']/2024);// Check for file size

if($FileSize > 2000){ echo "<script type='text/javascript'>parent.document.getElementById('sizeerrormessage').style.display = 'inline';</script>";}
else {$FileTemp = $_FILES[$attachments]['tmp_name']; $FileLocation = $target_path.basename($FileName); // Finally Upload

if(move_uploaded_file($FileTemp,$FileLocation)) {
// On successful upload send a message to corresponding attachmentdiv from which the file came from
echo "<script type='text/javascript'>parent.document.getElementById('".$attachmentdiv."').innerHTML = '<input CHECKED type=\"checkbox\"><font size=2><b>".$FileName."</b> <i>(".$FileType.")</i> ".$FileSize." Kb <b>Successfully Uploded..</b></font>';</script>";
echo "<script type='text/javascript'>parent.document.getElementById('typeerrormessage').style.display = 'none';</script>";
echo "<script type='text/javascript'>parent.document.getElementById('sizeerrormessage').style.display = 'none';</script>";
} else{echo "There was an error uploading the file, please try again!";}
}}}}}