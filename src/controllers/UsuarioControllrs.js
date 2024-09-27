import conn from "../config/conn.js";
import bcrypt from "bcrypt";
import {v4 as uuidv4 } from "uuid";
import getToken from "../helpers/get-token.js";
import jwt from "jsonwebtoken";

//helpers
import createUserToken from "../helpers/create-user-token.js";
import { response } from "express";

export const register = (request, response ) => {
    const {nome, email, telefone, senha, confirmsenha} = request.body;

    if (!nome) {
        response.status(400).json({message: "O nome é obrigatorio "});
        return;
    }
    if (!email) {
        response.status(400).json({message: "O email é obrigatorio "});
        return;
    }
    if (!telefone) {
        response.status(400).json({message: "O telefone é obrigatorio "});
        return;
    }
    if (!senha) {
        response.status(400).json({message: "O senha é obrigatorio "});
        return;
    }
    if (!confirmsenha) {
        response.status(400).json({message: "O campo senha é obrigatorio "});
        return;
    }

    //VERIFICAR SE O EMAIL É VALIDO
    if (!email.includes("@")) {
        response
        .status(409)
        .json({message: "A se o email é valido"});
        return;
    }
    
    //senha === confirmsenha
    if (!senha !== confirmsenha) {
        response
        .status(409)
        .json({message: "A senha e a confirmacao de senha  devem ser iguais"});
        return;
    }

    const checkSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
    const checkSqlData = ["email", email]
    conn.query(checkSql, checkSqlData, async (err, data)=>{
        if(err){
            console.error(err)
            response.status(500).json({err: "Erro ao buscar email para cadastro"})
            return
        }

        //2- 
        if(data.length >0){
            response.status(409).json({err: "o email já esta em uso"})
            return
        }

        //POSSO FAZER O REGISTRO
        const salt = await bcrypt.genSalt(12)
        console.log(salt)
        const senhaHash = await bcrypt.hash(senha, salt)
        // console.log("Senha digitada: ", senha)
        // console.log("senha com hast: ", senhaHash)

        //CRIAR O USUARIO
        const id = uuidv4();
        const usuario_img = "userDefault.png"
        const insertSql = /*sql*/`INSERT INTO usuarios
        (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?) 
        `
        const insertSqlData = ["usuario_id", "nome", "email", "telefone",
        "senha", "image", id, nome, email, telefone, senha, img,
    ];
    conn.query(insertSql, insertSqlData, (err) => {
        if (err) {
            console.error(err);
            response.status(500).json({err: "Erro ao cadastrar usuario"})
            return;
        }
        // 1- CRIAR UM TOKEN

        const jwt = require('jsonwebtoken');

        // Chave secreta para assinar o token
        const SECRET_KEY = '1111';
        
        // Função para gerar o token
        function generateToken(user) {
            // Payload do token
            const payload = {
                id: user.id,
                username: user.username
            };
        
            // Opções do token
            const options = {
                expiresIn: '1h' // Expiração em 1 hora
            };
        
            // Gerar o token
            const token = jwt.sign(payload, SECRET_KEY, options);
            return token;
        }
        
        // Exemplo de usuário
        const user = {
            id: 1,
            username: 'usuario_exemplo'
        };
        
        // Gerar e exibir o token
        const token = generateToken(user);
        console.log('Token JWT:', token);


        // 2- CRIAR UM TOKEN PASSAR PARA O FRONT-END
        const usuarioSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = `
        const usuarioData = ["usuario_id", id]
        conn.query(usuarioSql, usuarioData, async (err, data)=>{
            if(err){
                console.error(err)
                response.status(500).json({err: "Erro ao fazer o login"})
                return
            }
            const usuario = data [0]

            try {
             await createUserToken(usuario, request, response)
            } catch (error){
                console.error(error)
                response.status(500).json({err: "Erro ao processar o requisito"});
            }
        }) 
        response.status(201).json({message: "Usuário cadastrado"})

    })
    })
};

export const login = (request, response) => {
    const {email, senha} = request.body

    if (!email) {
        response.status(400).json({message: "O email é obrigatorio "});
        return;
    }
    if (!email) {
        response.status(400).json({message: "O senha é obrigatorio "});
        return;
    }
    const checkEmailSql = /*sql*/ `SELECT* FROM usarios WHERE ?? = ?`
    const checkEmailData = ["email", email]
    
    conn.query(checkEmailSql, checkEmailData, async (err, data) => {
        if(err){
            console.log(err)
            response.status(500).json({err: "Erro ao fazer login"})
            return
        }

        if(data.length === 0){
            response.status(500).json({err: "Email não está cadastrado"})
            return
        }
        const usuario = data [0]
        console.log(usuario.senha)

        //COMPARAR SENHA
        const compararSenha = await bcrypt.compare(senha, usuario.senha)
        console.log("Compara senha: ", compararSenha)
        if(!compararSenha){
            response.status(401).json({message: "Senha inválida"})
            return
        }

        //1- CRIAR UM TOKEN

        try {
           await createUserToken(usuario, request, response)
        } catch (error) {
            console.error(error)
            response.status(500).json({err: "Erro ao processar a informação"})
        }
    })
};

// checkUser -> VERIFICAR OS USUÁRIO LOGADO NA APLICAÇÃO
export const checkUser = (request, response) => {
    let usuarioAtual;
        if(request.headers.authorization){
            //EXTRAIR O TOKEN -> BAREAR TOKEN
            const token = getToken(request)
            console.log(token)
            //descriptografar o token jwt.decode
            const decoded = jwt.decode(token, "SENHASUPERSEGURA")
            console.log(decoded)

            const usuarioId = decoded.id
            const selectSql = /*sql*/ `SELECT nome, email, telefone, FROM usuarios WHERE ?? = ?`
            const selectData = ["usuario_id", usuarioId]
            conn.query(selectSql, selectData, (err, data)=>{
                if(err){
                    console.error(err)
                    response.status(500).json({err: "Erro ao verificar usuário"})
                    return
                }
                usuarioAtual = data[0]
                response.status(200).json(usuarioAtual)
            })
        }else {
            usuarioAtual = null
            response.status(200).json(usuarioAtual)
        }
    }
// getUserById -> VERIFICAR USUÁRIO
export const getUserById = async (request, response) => {}

// editUser -> CONTROLADOR PROTEGIDO, CONTÉM IMAGEM DO USUÁRIO
export const editUser = async (request, response) => {}; 
{
    // Verificaçoes se o usuario existe 
    const checkSql = /*sql*/ ` select * from usuarios whwre ?? = ?`
    const ckeckSqlData = ["usuario_id", id]
    conn.query(checkSql, ckeckSqlData, (err, data)=>{
        if(err){
            return response.status(404).json("Erro ao verificar usuario para update")
        }
        if(err){
            return response.status(404).json("usuario nao encontrado")
        }
    })
    // Evitar usuariso com email repetido 


    // Atualizar o usuario 
    const updateSql = /*sql*/ `update usuarios set`
    const updateData = []

try{


}catch (error) {}
}