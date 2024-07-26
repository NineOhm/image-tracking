import dynamic from 'next/dynamic'

const ARScanner = dynamic(() => import('@/components/ARScanner'), { ssr: false })

export default function ARPage() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ARScanner />
    </div>
  )
}