import { toast } from "sonner";

class InputHelper {
  constructor(formData, setFormData, validationSchema, onSubmit) {
    this.formData = formData;
    this.setFormData = setFormData;
    this.validationSchema = validationSchema;
    this.onSubmit = onSubmit;
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    this.setFormData({ ...this.formData, [name]: trimmedValue });
  };

  validateForm = () => {
    for (const fieldName in this.validationSchema) {
      const fieldValidation = this.validationSchema[fieldName];
      const fieldValue = this.formData[fieldName];
      const alias = fieldValidation.alias || fieldName;

      if (fieldValidation.required && !fieldValue) {
        toast.error(`${alias} perlu diisi!`);
        return false;
      }

      if (fieldValidation.minLength && fieldValue.length < fieldValidation.minLength) {
        toast.error(`${alias} minimal ${fieldValidation.minLength} karakter!`);
        return false;
      }

      if (fieldValidation.maxLength && fieldValue.length > fieldValidation.maxLength) {
        toast.error(`${alias} maksimal ${fieldValidation.maxLength} karakter!`);
        return false;
      }

      if (fieldValidation.pattern && !fieldValidation.pattern.test(fieldValue)) {
        toast.error(`${alias} tidak valid!`);
        return false;
      }

      if (fieldValue.trim() === "") {
        toast.error(`${alias} tidak bisa hanya spasi!`);
        return false;
      }
    }
    return true;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      this.onSubmit(this.formData);
    }
  };
}

export default InputHelper;
