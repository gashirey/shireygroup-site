export const metadata = {
  title: 'Shirey Enterprise Group',
  description: 'SEG Contractor Communications',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
