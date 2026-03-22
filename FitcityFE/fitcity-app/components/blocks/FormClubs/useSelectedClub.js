const selectedClub = ref({})

export const useSelectedClub = () => {
	const setClub = (value) => (selectedClub.value = value)
	return {
		selectedClub,
		setClub,
	}
}
