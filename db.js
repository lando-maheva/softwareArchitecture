
//import mysql from 'mysql2/promise';
import mysql from 'mysql2/promise';
//get the pool class from mysql
const {Pool} = mysql;
//setup the local pool config with user,password,host,port and database name
let localPoolConfig = {
    user:'root',
    password:'',
    host:'localhost',
    port:3306,
    database:'softwareArchitecture'
};
//setup the pool config to use the connection string from the environment variable if it exists otherwise use the local pool config
const poolConfig = process.env.DATABASE_URL ? {
    connectionString:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
} : localPoolConfig;
  //create a new pool using the pool config  
const pool = mysql.createPool(poolConfig);
//export the pool as default export
export default pool;

//these are steps we need inorder to conn





