// dotenv/config.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string; // URL do banco de dados
      PORT?: string;        // Porta do servidor (opcional)
      NODE_ENV: 'dev' | 'production' | 'test'; // Ambiente
    }
  }
  