import express from 'express'
import axios, { create } from 'axios'
import responseTime from 'response-time'
import { createClient } from 'redis'


const app = express()

// conexion a la base redis
const client = createClient({
  host: '127.0.0.1',
  port: 6379
})

app.use(responseTime())

app.get('/characters', async (req, res) => {

  // consulta a redis si tiene algo llamado characters
  const reply = await client.get('characters')
  if (reply) return res.json(JSON.parse(reply))

  // si no tiene, consulta la api y le guarda en redis characters
  const {data} = await axios.get('https://rickandmortyapi.com/api/character')
  const saveResult = await client.set('characters', JSON.stringify(data))
  console.log(saveResult)

  return res.json(data)
})


const main = async () => {
  await client.connect()
  app.listen(3000)
  console.log('Server running at port 3000')
}

main()