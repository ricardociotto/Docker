express = require("express")
const mysql = require("mysql2/promise")

app = express();
app.use(express.json())

const dbConfig = {
    host: "localhost",
    user: "R1cky",
    password: "12345",
    database: "Teste",
} 

async function StartDatabase() {
    const connection =  await mysql.createConnection(dbConfig)

    await connection.query(`
        CREATE TABLE IF NOT EXISTS jogos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL)`)

        await connection.end()
}

StartDatabase()


app.get('/jogos', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.query("SELECT * FROM jogos")
    await connection.end()
    
    res.json(rows)
}) 

app.get('/jogos/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.query('SELECT * FROM jogos WHERE id = ?', [id]);
      await connection.end();
  
      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(404).json({ message: 'Jogo não encontrado' });
      }
  
      return res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  }); 


app.post('/jogos', async (req, res) => {
    
    const {name} = req.body
    const connection = await mysql.createConnection(dbConfig)
    await connection.query("INSERT INTO jogos (name) VALUES (?)", [name])
    
    await connection.end()

    res.json({ message: "adicionado com sucesso", name})
 }) 

 app.put('/jogos/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const connection = await
    mysql.createConnection(dbConfig);
      const [result] = await connection.query("UPDATE jogos SET name = ? WHERE id = ?", [name,id]);
    await connection.end();

    if(result.affectedRows === 0){
        return res.status(404).json({message: 'Jogo não encontrado'});
    }
    res.json({ message: "Jogo atualizado com sucesso",
        id, name });
});


app.delete('/jogos/:id', async (req, res) => {
    const { id } = req.params;
  
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('DELETE FROM jogos WHERE id = ?', [id]);
    await connection.end();
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
  
    res.json({ message: `Jogo ${id} foi deletado` });
  }); 

app.listen(3000, () => {
    console.log("Test")
})
