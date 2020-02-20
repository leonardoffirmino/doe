const express = require('express')
const server = express()

//configurar server para outros arquivos estaticos
server.use(express.static('public'))


//Habilitar body do Formulário
server.use(express.urlencoded({extended:true}))

//Configurar conexão Banco de dados
const Pool = require('pg').Pool
const db =  new Pool({
    user: 'postgres',
    password: '67472525',
    host: 'localhost',
    port: 5432,
    database:'doe'
})


//Configurando template engine
const nunjucks = require('nunjucks')
nunjucks.configure("./",{
    express: server,
    noCache: true
})



//Configurar apresentação da página
server.get("/",function(req,res){
    db.query("Select * From donors",function(err,result){
        if (err) return res.send("Erro de Banco de Dados!!!")


        const donors = result.rows
        return  res.render("index.html",{ donors })
    })


    

})

//Pegar dados do Formulário 
server.post("/",function(req,res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood    
    

    if (name == "" || email == "" || blood == ""){
       return res.send("Todos os campos são obrigatórios") 

    }

    //Colocando valores no Banco 
    const query = `
    INSERt INTO donors ("name","email","blood")
    VALUES($1,$2,$3)`

    const values = [name,email,blood]

    db.query(query,values,function(err){
        if (err) return res.send("Erro no Banco de Dados!!")

        return  res.redirect("/")
    })

    
})


//Ligar o servidor e permitir acesso na porta 3000
server.listen(3000,function(){
    console.log("Iniciei o servidor")
})

