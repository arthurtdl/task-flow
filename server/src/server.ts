import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {

  const enviroment = process.env.NODE_ENV || 'development';

  if (enviroment === 'development') {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } else {
    console.log(`🚀 Server is running in production mode on port ${PORT}`);
  }
});