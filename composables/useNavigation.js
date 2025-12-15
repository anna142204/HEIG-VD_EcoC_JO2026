export function useNavigation() {
  const navigateTo = (url) => {
    if (!url) return

    const isExternal = url.startsWith('http://') || url.startsWith('https://')
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      const router = useRouter()
      router.push(url)
    }
  }

  return { navigateTo }
}