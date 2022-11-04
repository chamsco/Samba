import type { ReactNode } from "react";
import Footer from "./footer/Footer";
import { Header } from "./header/Header";

type LayoutProps = {
  readonly children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <div className="flex flex-col h-screen justify-between">
    <Header />
    <main className="h-full w-full bg-white">
     
      {children}
    </main>
    <Footer/>
  </div>
  );