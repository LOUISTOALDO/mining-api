import './globals.css'

export const metadata = {
  title: 'Elysium',
  description: 'Predictive Maintenance for Mining Operations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
