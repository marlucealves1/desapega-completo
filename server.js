/**
 * MODEL -> DB BD -> Regras de negocios
 * CONTROLLER -> controla o que vem da view e devolve o que vem do model
 * VIEW -> Paginas,aquilo que o usuario ve.
 */
import path from "node:path";
import "dotenv/config"
import express from "express"
import cors from "cors"

const PORT = process.env.PORT || 3333
const app = express()

//3 middleware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json());


//pasta para os arquivos estaticos
app.use("./public",express.static(path.join(__dirname, "public")));
 
//Utilizar as rotas 
app.use("/usuarios", usuarioRouter);

app.use((request,response)=>{
    response.status(404).json({message:"Rota não encontrada"});
});

app.listen(PORT,()=> {
    console.log(`Servidor on port ${PORT}`);
}); 