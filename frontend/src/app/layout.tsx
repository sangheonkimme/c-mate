import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C-Mate",
  description: "매칭 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-2 font-sans text-base antialiased">
        {children}
      </body>
    </html>
  );
}
