import { HeaderSignInStudent } from "@/components/HeaderMenu/HeaderSignInStudent";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderSignInStudent />
      <main>{children}</main>
    </>
  );
}
