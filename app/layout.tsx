import { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Shirey Enterprise Group",
  description: "SEG Contractor Communications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}