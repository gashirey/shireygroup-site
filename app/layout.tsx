export const metadata = {
  title: "Shirey Enterprise Group",
  description: "SEG Contractor Communications",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}