import dynamic from 'next/dynamic';

const CheckoutPage = dynamic(() => import('./CheckoutContent'), { ssr: false });

export default function Page() {
  return <CheckoutPage />;
}
