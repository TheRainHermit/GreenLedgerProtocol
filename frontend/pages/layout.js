import { Web3Provider } from '@/contexts/Web3Context'
import './globals.css'

export const metadata = {
  title: 'GreenLedger Protocol',
  description: 'Sustainability Scoring System with Automated Rewards',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}