import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "Your API_KEY";

const genAI = new GoogleGenerativeAI(API_KEY);

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}


const result='';

async function run() {
    console.log('Start......')

    const palette=document.querySelector('.color-pallete')
    palette.innerHTML = '';
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = `return only a text json of color pallete of image \\
                  make sure you rearange befor passing json like \\
                  you can rearange color light to dark and make sure\\
                  you make cluster of similer color\\cluster means first 3 are one shade of color
                  then other 3 or somenuumber of shade of colors like that\\
                  do not include white and black color and their shade\\
                  and you dont have to return tons of colors you can give some colors\\
                  do not return almost similer colors\\
                  return as stringfy json you dont have to add three \` before and after json \`
                  do not return json like markup just return text based json\\
                  return object as "colors:"
                  `

  const fileInputEl = inputFile;
  const imageParts = await Promise.all(
    [...fileInputEl.files].map(fileToGenerativePart)
  );

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();

  console.log(text)

const obj=JSON.parse(text)


obj['colors'].forEach(element => {
    const newPallete=document.createElement('div');
    newPallete.style.backgroundColor=element;
    palette.appendChild(newPallete);
});
}




const generateButton = document.getElementById("generateButton");
generateButton.addEventListener("click", run);


  document.getElementById('drop-area').addEventListener('click', function() {
  document.getElementById('myFileInput').click();
});


  const dropArea=document.getElementById("drop-area");
  const inputFile=document.getElementById("myFileInput");
  const imageView=document.getElementById("img-view");

  inputFile.addEventListener('change',uploadImage);


  function uploadImage(){
    
    let imgLink=URL.createObjectURL(inputFile.files[0]);
    console.log(imgLink)
    imageView.style.backgroundImage=`url(${imgLink})`;
    imageView.style.backgroundRepeat='no-repeat';

    imageView.textContent='';

  }


  dropArea.addEventListener('dragover',(e)=>{
    e.preventDefault();
  })
  dropArea.addEventListener('drop',(e)=>{
    e.preventDefault();
    inputFile.files=e.dataTransfer.files;
    uploadImage();
  })


