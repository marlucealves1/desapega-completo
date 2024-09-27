import conn from "../config/conn"

const getUserByToken = async(token)=>{
    return new Promise((resolve, reject)=>{
        if(!token){
            response.status(401).json({message:"Acesso negado"})
            return
        }

        const decoded = jwt.verify(token, "SENHASUPERSEGURA")
        const userId = [decoded.userId]
        const checksqlData = ["usuario_id", userid]
        conn.query(ckeckSql, chekesSql, (err, data)=>{
            if (err){
                reject({status: 500, message:"Erro ao buscar usuario"});
            }else{
                resolve(data[0]);
            }
        })
    })
}

export default getUserByToken;