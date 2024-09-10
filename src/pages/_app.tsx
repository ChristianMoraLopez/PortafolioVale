import '@/styles/globals.css'; // Importa tus estilos globales de Tailwind CSS
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
   
      <Component {...pageProps} />
 
  );
}

export default MyApp;