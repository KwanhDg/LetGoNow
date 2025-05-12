import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-white flex items-center justify-between shadow-md px-6">
      <div className="flex items-center space-x-8">
        <Link href="/">
          <Image src="/assets/icon/logo.png" alt="LetGoNow" width={56} height={56} className="h-14 w-auto" />
        </Link>
        <nav className="flex space-x-8">
          <Link
            href="/yachts"
            className="text-black font-roboto text-xl font-bold hover:text-teal-500 hover:border-b-4 hover:border-teal-500 transition py-2"
          >
            Tìm du thuyền
          </Link>
          <Link
            href="/flights"
            className="text-black font-roboto text-xl font-bold hover:text-teal-500 hover:border-b-4 hover:border-teal-500 transition py-2"
          >
            Đặt vé máy bay
          </Link>
        </nav>
      </div>
      <Link href="/login">
        <button 
          type="button" 
          className="flex items-center justify-center w-10 h-10 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </button>
      </Link>
    </header>
  );
} 