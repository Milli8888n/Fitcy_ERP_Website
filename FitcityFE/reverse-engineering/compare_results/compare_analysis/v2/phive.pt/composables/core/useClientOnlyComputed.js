import { ref, onMounted, watch } from "vue";

export function useClientOnlyComputed(initialValue, fn, dependencies) {
  const value = ref(initialValue);

  onMounted(() => {
    value.value = fn();
    watch(dependencies, () => {
      value.value = fn();
    });
  });

  return value;
}
