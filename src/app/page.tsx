import { redirect } from 'next/navigation';


export default function Home() {
  redirect('/login');
  
  // A página está sendo redirecionada
}
