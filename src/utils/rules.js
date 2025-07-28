// utils/rules.js

export const required =
  (msg = "Bu maydon to‘ldirilishi shart") =>
  (val) =>
    val ? true : msg;

export const minLength =
  (min, msg = null) =>
  (val) =>
    val.length >= min
      ? true
      : msg || `Kamida ${min} ta belgidan iborat bo‘lishi kerak`;

export const isNumber =
  (msg = "Faqat raqam kiriting") =>
  (val) =>
    !isNaN(val) ? true : msg;

export const email =
  (msg = "Email noto‘g‘ri") =>
  (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? true : msg;
