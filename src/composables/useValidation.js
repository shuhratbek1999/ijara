import { ref } from "vue";

export function useValidation(rules = []) {
  const error = ref("");

  const validate = (value) => {
    for (const rule of rules) {
      const result = rule(value);
      if (result !== true) {
        error.value = result;
        return false;
      }
    }
    error.value = "";
    return true;
  };

  return {
    error,
    validate,
  };
}
