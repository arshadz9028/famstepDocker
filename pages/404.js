import { useEffect } from 'react'
import { useRouter } from 'next/router'
function Error() {
  const router = useRouter()
  useEffect(() => {
    router.push('/home')
  }, [])
}

export default Error
