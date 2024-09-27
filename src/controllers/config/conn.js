import mysql from "msql2";

const conn =  mysql.creatpool({})
const conn2 = mysql.createConnection({
    connectionLimit: 10,
    host:process.env.MYSQL.HOST,
    user:process.env.MYSQL.USER,
    passaword:process.env.MYSQL.PASSAWORD,
    database:process.env.MYSQL.DATABASE,
})

conn.query("Select 1 + 1 as soluction", (error, results)=>{
    if(error){
        console.error(error);
        return;
    }
        console.log("the soluction is:", result[0].soluction);
    }
);
export default conn;