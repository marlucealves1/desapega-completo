import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//Estrutura onde vai guardar as imagens 
const imageStorage = multer.diskStorage({
    destination: (request, file,cd)=>{

        let folder = "";

        if(request.baseUrl.includes("usuarios")){
            folder = "usuarios";

        }else if(request.baseUrl.includes("usuarios")){
            folder = "objetos";
        }
        cb(null, path.join(__dirname, `../public/${folder}`))
    },
    filename: (request, file,cd)=>{
        //nome do arquivo
    cb(null,Date.now() + String(Math.floor(Math.random()* 10000))+ path.extname(file.originalname))

    },
});
// executar a funcao para guardar a imagem  
const imageUpload = multer({
    storage: imageStorage,
    fileFilter(request, file, cd){
        if(!file.originalname.match(/\.(png||jpg)$/)){
        return cd(new Error("Por favor, envie apenas jpg ou png"))
        }
cd(null, true);
    }
})
export default imageUpload;