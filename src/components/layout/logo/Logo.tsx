import Link from "next/link";

export const Logo = () => (
  <div className="flex justify-start lg:w-0 lg:flex-1">
    <Link href="/">
      <img
        className="h-8 w-auto sm:h-10"
        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
        alt=""
        width={40}
        height={44}
/>
    </Link>
  </div>
);