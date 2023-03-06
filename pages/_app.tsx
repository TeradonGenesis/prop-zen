import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return(
    <div className="bg-[#A1B88D]">
      <Component {...pageProps} />
    </div>
  );

}
