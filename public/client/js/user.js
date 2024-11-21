// change-detail-user
const innerUpload=document.querySelector(".inner-upload");
const imagePreview=document.querySelector("[image-preview]");
const fileInputUpload=document.querySelector("[upload-image]");
console.log(innerUpload);
if(innerUpload){
  innerUpload.addEventListener("click",()=>{
    fileInputUpload.click();
  })
}
if(fileInputUpload){
  fileInputUpload.addEventListener("change",(e)=>{
    const file=e.target.files[0];
    const src=URL.createObjectURL(file);
    imagePreview.src=src;
  })
}

// end change-detail-user