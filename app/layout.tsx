import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aniket Sharma, Web & App Developer",
  description:
    "Aniket Sharma is a full-stack developer building fast web and mobile products with React, Next.js, and React Native.",
  openGraph: {
    title: "Aniket Sharma, Web & App Developer",
    description:
      "Full-stack developer building fast web and mobile products with React, Next.js, and React Native.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/*
          Fonts per taste-skill: Cabinet Grotesk (display) + Satoshi (body).
          Inter is deliberately not the baseline; no serif by default.
        */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
