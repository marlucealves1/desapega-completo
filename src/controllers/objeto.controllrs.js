import { response } from "express";
import { request } from "http";
import conn from "../config/conn.js";
import { v4 as uuidv4 } from "uuid";
import getToken from "../helpers/get.token.js";
import getUserByToken from "../helpers/get-user-by-token.js";





export const create = async (request, response) => {
    const { nome, categoria, peso, cor, descricao, preco } = request.body;
    const disponivel = 1

    const token = getToken(request)
    const usuario = await getUserByToken(token)
    //buscar o token do usuario 
    if (!nome) {
        response.status(400).json({ message: "O  é obrigatorio" });
        return;
    }
    if (!categoria) {
        response.status(400).json({ message: "A categoria é obrigatorio" });
        return;
    }

    if (!cor) {
        response.status(400).json({ message: "A cor  é obrigatorio" });
        return;
    }

    if (!peso) {
        response.status(400).json({ message: "O peso é obrigatorio" });
        return;
    }

    if (!descricao) {
        response.status(400).json({ message: "A descricao é obrigatorio" });
        return;
    }

    if (!preco) {
        response.status(400).json({ message: "O Preco é obrigatorio" });
        return;
    }


 const objeto_id = uuidv4()
 const usuario_id = usuario.usuario_id
const objetoSql = /*sql*/` INSERT INTO objetos (??, ??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

const objetoData = [
    "objeto_id", 
    "nome", 
    "categoria", 
    "peso",
    "cor",
    "descricao",
    "disponivel",
    "preco",
    "usuario_id",

    objeto_id, 
    nome, 
    categoria, 
    peso,
    cor,
    descricao,
    disponivel,
    preco,
    usuario_id
]
conn.query(objetoSql, objetoData, (err)=>{
    if(err){
        console.error
            response.status
        response.status(500).json({message: "Erro ao adicionar objeto"});
        return;
    }

    if(request.file){
const insertImageSql = /*sql*/ `ÌNSERT INTO objeto_iamges(image_id, image_path, objeto_id) VALUES ? `
    const imageValues = request.file.map((file)=>{
        uuidv4(),
        objeto_id,
        file.filename
    })
    conn.query(insertImageSql, [imageValues], (err)=>{
        if(err){
            console.log(insertImageSql, [imaValues], (err)=>{
                response.status(500).json({err: "nao possivel adicionar imagem ao objeto"})
            return
            })
            response.status(500).json({err:"Obejeto criado adicionar imagem ao objeto"})
        }
    })
}else{
        response.status(201).json({message:"Objeto criado com sucesso!"})
    }
})

    response.status(200).json("Chegou aqui ")
}
