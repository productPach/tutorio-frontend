import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import BodyWithProviders from "@/components/Body/BodyWithProviders";

// export const metadata: Metadata = {
//   title: "Tutorio — место, где встречаются ученики и репетиторы",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans&family=Montserrat:wght@400;500;600&family=PT+Sans&family=Poppins:wght@400;600&family=Sofia+Sans:wght@900&family=Source+Sans+3:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        {/* <script src="//code.jivo.ru/widget/b6FSfh54M9" async></script> */}
      </head>
      <ReduxProvider>
        <BodyWithProviders>{children}</BodyWithProviders>
      </ReduxProvider>
    </html>
  );
}
