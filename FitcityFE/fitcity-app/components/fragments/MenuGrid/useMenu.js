const themeRef = ref('dark')
const refreshAnchorRef = ref(null)
const buttonCTARef = ref(false)

export function useMenu() {
	const setMenuTheme = (val) => (themeRef.value = val)
	const getMenuTheme = () => themeRef

	const setRefreshAnchors = (val) => (refreshAnchorRef.value = val)
	const refreshAnchors = () => refreshAnchorRef.value && refreshAnchorRef.value()

	const setButtonCTA = (val) => (buttonCTARef.value = val)
	const getButtonCTA = () => buttonCTARef

	return { setMenuTheme, getMenuTheme, setRefreshAnchors, refreshAnchors, setButtonCTA, getButtonCTA }
}
