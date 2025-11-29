// Force dynamic rendering for login page to prevent Clerk build errors
export const dynamic = 'force-dynamic'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


