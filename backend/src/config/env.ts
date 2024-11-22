import { config as loadDotenv } from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente definindo o caminho do arquivo .env para a pasta raiz do repositório
export const loadEnv = () => {
  loadDotenv({ path: path.resolve(__dirname, '../../../.env') });
};