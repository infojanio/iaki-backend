import { app } from "./app";
import { env } from "./env"

<<<<<<< HEAD
app.listen({
  host: '0.0.0.0',
  port: env.PORT,
}).then(() => {
  console.log('🚀 HTTP Server Running!')
})
=======
app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server rodando!')
  })
>>>>>>> master
